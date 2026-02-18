import sys
import asyncio
import json
import os
from typing import TypedDict, Optional, Annotated, List
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from schemas import AgentState
import uuid
import shutil

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

load_dotenv()

# ==========================================================
# STATE DEFINITION
# ==========================================================
from pydantic import BaseModel, Field

class Step(BaseModel):
    action: str = Field(description="The action to take, e.g., CLICK or HOVER")
    label: str = Field(description="The text label of the element to interact with")

class NavigationPlan(BaseModel):
    steps: List[Step] = Field(description="List of steps to reach the goal")
    success_criteria: str = Field(description="What to look for to confirm success")



# ==========================================================
# TOOLS
# ==========================================================

async def highlight_and_screenshot(page, label, step_index):
    # Locate the element
    locator = page.locator(f"a:has-text('{label}'), button:has-text('{label}')").first
    
    if await locator.count() == 0:
        locator = page.get_by_text(label, exact=False).first

    # if await locator.count() > 0:
    #     # Inject CSS to highlight the element
    #     await locator.evaluate("""
    #         (el) => {
    #             el.style.outline = '5px solid red';
    #             el.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
    #             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    #         }
    #     """)
        
    #     # Give it a moment for the scroll/style to settle
    #     await asyncio.sleep(1) 
        
    #     # Save screenshot
    #     path = f"data/step_{step_index}_{label.replace(' ', '_').lower()}.png"
    #     await page.screenshot(path=path)
    #     print(f"Saved screenshot: {path}")
        
    #     # Optional: Remove highlight after screenshot if continuing on same page
    #     await locator.evaluate("(el) => { el.style.outline = ''; el.style.backgroundColor = ''; }")
    #     return path

    if await locator.count() > 0:
        # Inject CSS to highlight
        await locator.evaluate("""
            (el) => {
                el.style.outline = '5px solid red';
                el.style.outlineOffset = '2px'; 
                el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                el.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        """)
        
        # Settle for screenshot
        await asyncio.sleep(0.5) 
        
        path = f"data/step_{step_index}_{label.replace(' ', '_').lower()}.png"
        await page.screenshot(path=path)
        print(f"Saved highlighted screenshot: {path}")
        
        # Clean up styles immediately after
        await locator.evaluate("(el) => { el.style.outline = ''; el.style.backgroundColor = ''; }")
        return path
    return None

@tool
async def scrape_page(url: str):
    """Scrapes the UI elements, links, and headings from a specific URL."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await asyncio.sleep(3) # Settle time
            
            ui_data = await page.evaluate("""
                () => {
                    const results = { navigation_links: [], buttons: [], headings: [] };
                    const isVisible = (el) => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && el.offsetWidth > 0;
                    };
                    const collect = (root) => {
                        root.querySelectorAll("nav a, header a, button, a.click-data").forEach(el => {
                            if (!isVisible(el)) return;
                            results.navigation_links.push({ 
                                text: el.innerText.trim(), 
                                url: el.href || null 
                            });
                        });
                        root.querySelectorAll("h1, h2, h3").forEach(h => {
                            if (isVisible(h)) results.headings.push(h.innerText.trim());
                        });
                        return results;
                    }
                    return collect(document);
                }
            """)
            return json.dumps(ui_data)
        finally:
            await browser.close()

# ==========================================================
# NODES
# ==========================================================

async def supervisor(state: AgentState):
    """The brain that decides to scrape a new page or finalize a plan."""
    llm = ChatOpenAI(model="gpt-4o", temperature=0).bind_tools([scrape_page])
    
    system_msg = f"""You are a web exploration agent.
    GOAL: {state['goal']}
    CURRENT URL: {state['current_url']}
    
    If you don't see the goal on the current page, use the 'scrape_page' tool on a promising link.
    If you HAVE found the goal or the path to it, output 'FINALIZE' followed by the step-by-step CLICK plan."""
    
    response = await llm.ainvoke([HumanMessage(content=system_msg)] + state['messages'])
    return {"messages": [response]}

async def tool_handler(state: AgentState):
    """Executes the scrape_page tool and updates UI Data."""
    tool_node = ToolNode([scrape_page])
    result = await tool_node.ainvoke(state)
    
    # Update current_url and ui_data from the tool output
    last_msg = result["messages"][-1]
    if isinstance(last_msg, ToolMessage):
        data = json.loads(last_msg.content)
        return {
            "messages": result["messages"],
            "ui_data": data,
            "round": state["round"] + 1
        }
    return result

async def dismiss_popups(page):
    """Attempt to click 'Accept All' and force-hide any remaining overlays."""
    try:
        # 1. Try to click the common 'Accept All' button
        # We use a short timeout so it doesn't hang if the popup isn't there
        accept_btn = page.get_by_role("button", name="Accept All")
        if await accept_btn.is_visible(timeout=2000):
            await accept_btn.click()
            await asyncio.sleep(0.5) # Wait for fade-out
            
        # 2. Force-hide the specific disclosure div via CSS 
        # This is the 'fail-safe' if the click doesn't work or it reappears
        await page.evaluate("""
            () => {
                const popups = [
                    'div.Privacy-Disclosure', 
                    '[class*="PrivacyDisclosure"]', 
                    '[id*="cookie-banner"]'
                ];
                popups.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                    });
                });
            }
        """)
    except Exception:
        pass 

# async def executor_node(state: AgentState):
#     os.makedirs("data", exist_ok=True) # Ensure directory exists
    
#     async with async_playwright() as p:
#         browser = await p.chromium.launch(headless=True)
#         context = await browser.new_context(viewport={'width': 1280, 'height': 800})
#         page = await context.new_page()

#         print(f"--- Executing Plan on {state['url']} ---")
        
#         try:
#             await dismiss_popups(page)
#             await page.goto(state["url"], wait_until="domcontentloaded", timeout=60000)
#             cookie_button = page.get_by_role("button", name="Accept All")
#             if await cookie_button.is_visible():
#                 await cookie_button.click()
#                 print("Privacy disclosure dismissed.")
#                 await asyncio.sleep(1) 

#             close_icon = page.locator("div.Privacy-Disclosure button").first # CSS selector if known
#             if await close_icon.is_visible():
#                 await close_icon.click()
#             llm = ChatOpenAI(model="gpt-4o").with_structured_output(NavigationPlan)
#             plan_prompt = f"Convert analysis into JSON plan for: {state['goal']}. UI: {json.dumps(state['ui_data'])}"
#             plan_output_model = await llm.ainvoke(plan_prompt)
#             plan_output = plan_output_model.dict()
            
#             screenshots = []
#             for i, step in enumerate(plan_output.get("steps", [])):
#                 label = step["label"]
#                 await dismiss_popups(page)
#                 # 1. Highlight and Screenshot BEFORE clicking
#                 img_path = await highlight_and_screenshot(page, label, i)
#                 if img_path:
#                     screenshots.append(img_path)
                
#                 # 2. Perform the actual click
#                 locator = page.get_by_text(label, exact=False).first
#                 if await locator.count() > 0:
#                     # Navigation often happens here
#                     await locator.click()
#                     # Wait for potential navigation or UI change
#                     await page.wait_for_load_state("domcontentloaded", timeout=600000)
#                     await asyncio.sleep(2)
#                     await dismiss_popups(page)
            
#             state["page_content"] = await page.content()
#             # Store image paths in state so 'humanize' can reference them
#             state["screenshots"] = screenshots 
            
#         finally:
#             await browser.close()
    
#     return {"page_content": state["page_content"], "plan": plan_output, "screenshots": screenshots}

async def executor_node(state: AgentState):
    os.makedirs("data", exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            await page.goto(state["url"], wait_until="load", timeout=60000)
            await dismiss_popups(page)

            # Re-generate plan with UI context
            llm = ChatOpenAI(model="gpt-4o").with_structured_output(NavigationPlan)
            plan_prompt = f"Convert analysis into JSON plan for: {state['goal']}. UI: {json.dumps(state['ui_data'])}"
            plan_output_model = await llm.ainvoke(plan_prompt)
            plan_output = plan_output_model.dict()
            
            screenshots = []
            for i, step in enumerate(plan_output.get("steps", [])):
                label = step["label"]
                
                # Ensure the popup is gone before every single step
                await dismiss_popups(page)
                
                # HIGHLIGHT AND SNAP
                img_path = await highlight_and_screenshot(page, label, i)
                if img_path:
                    screenshots.append(img_path)

                # CLICK
                locator = page.locator(f"a:has-text('{label}'), button:has-text('{label}')").first
                if await locator.count() == 0:
                    locator = page.get_by_text(label, exact=False).first

                if await locator.count() > 0:
                    await locator.click(force=True)
                    # Give the menu or page 2 seconds to finish animations/loading 
                    # before the next iteration tries to highlight the next step.
                    await asyncio.sleep(2)
            
            state["page_content"] = await page.content()
            state["screenshots"] = screenshots 
            
        finally:
            await browser.close()
    
    return {"page_content": state["page_content"], "plan": plan_output, "screenshots": screenshots}

async def humanize(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    prompt = f"Create a guide for {state['goal']} based on plan: {json.dumps(state['plan'])}"
    res = await llm.ainvoke(prompt)
    return {"final_walkthrough": res.content}

# ==========================================================
# GRAPH BUILDER
# ==========================================================

def router(state: AgentState):
    if state["messages"][-1].tool_calls:
        return "tools"
    if state["round"] >= 5: # Safety cutoff
        return "humanize"
    return "executor"

builder = StateGraph(AgentState)

builder.add_node("supervisor", supervisor)
builder.add_node("tools", tool_handler)
builder.add_node("executor", executor_node)
builder.add_node("humanize", humanize)

builder.set_entry_point("supervisor")
builder.add_conditional_edges("supervisor", router)
builder.add_edge("tools", "supervisor") # Loop back to supervisor after tool use
builder.add_edge("executor", "humanize")
builder.add_edge("humanize", END)

graph = builder.compile(checkpointer=MemorySaver())

# ==========================================================
# MAIN
# ==========================================================
def cleanup_data_directory(directory="data"):
    """Removes all files in the directory to start fresh."""
    if os.path.exists(directory):
        # Remove all files but keep the folder
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            try:
                if os.path.isfile(file_path) or os.path.is_link(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
    else:
        # Create it if it doesn't exist
        os.makedirs(directory)

async def main(url: str, goal: str, thread_id: str):
    cleanup_data_directory("data")
    initial_state = {
        "url": url,
        "current_url": url,
        "goal": goal,
        "ui_data": {},
        "plan": None,
        "page_content": "",
        "success": False,
        "round": 0,
        "messages": [],
        "final_walkthrough": None,
        "screenshots": []
    }
    
    final_state = await graph.ainvoke(initial_state, config={"configurable": {"thread_id": thread_id}})
    print(final_state["final_walkthrough"])
    return final_state

if __name__ == "__main__":
    asyncio.run(main("https://www.nowsecure.com/", "How do I access Mobile App Security Testing?", "user_14"))

