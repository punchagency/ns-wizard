import sys
import asyncio
import json
import os
from typing import TypedDict, Optional
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from schemas import AgentState


if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

load_dotenv()

async def handle_feature_not_found(state: AgentState):
    llm = ChatOpenAI(model = "gpt-4o", temperature = 0, api_key = os.getenv("api_key"))
    prompt = f"""Your role is to refine this response "Feature or service not found"
    for this user request {state['goal']} on the website {state["url"]}.
    Check the UI Data: {json.dumps(state['ui_data'])} for a close match and ask the user if 
    he/she is interested in that. If there isn't any close match, ask the user to verify if it is 
    available on NowSecure.

    """
    result = await llm.ainvoke(prompt)
    state["final_walkthrough"] = result.content
    return state

async def extract_ui(state: AgentState) -> AgentState:
    url = state["url"]
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        try:
            # Increased timeout and used 'commit' for faster initial access
            await page.goto(url, wait_until="commit", timeout=90000)
            await page.wait_for_load_state("domcontentloaded")
            await asyncio.sleep(5) 

            ui_data = await page.evaluate("""
                () => {
                    const results = { navigation_links: [], buttons: [], headings: [] };
                    const isVisible = (el) => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
                    };
                    const getPos = (rect) => rect.x < window.innerWidth / 3 ? "left" : (rect.x > (window.innerWidth * 2) / 3 ? "right" : "center");
                    
                    const collect = (root) => {
                        root.querySelectorAll("nav a, header a, button, [role='button'], a.click-data").forEach(el => {
                            if (!isVisible(el)) return;
                            const rect = el.getBoundingClientRect();
                            const text = (el.innerText || el.getAttribute('aria-label') || "").trim();
                            if (!text) return;
                            const data = { text, position: getPos(rect) };
                            if (el.tagName === 'A') results.navigation_links.push(data);
                            else results.buttons.push(data);
                        });
                        root.querySelectorAll("h1, h2, h3").forEach(h => {
                            if (isVisible(h) && h.innerText.trim()) results.headings.push(h.innerText.trim());
                        });
                        root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) collect(el.shadowRoot); });
                    };
                    collect(document);
                    return results;
                }
            """)
            # ASSIGN HERE, inside the try block
            state["ui_data"] = ui_data
        except Exception as e:
            print(f"Extraction Error: {e}")
            state["ui_data"] = {"navigation_links": [], "buttons": [], "headings": []}
        finally:
            await browser.close()
            
    return state

async def planner(state: AgentState) -> AgentState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0, model_kwargs={"response_format": {"type": "json_object"}})
    prompt = f"""
    You are a web navigation planner. 
    GOAL: {state['goal']}
    
    UI DATA: {json.dumps(state['ui_data'])}

    STRATEGY:
    1. Look for the exact goal in the UI labels.
    2. If NOT found, look for a logical category (e.g., 'Solutions', 'Products', 'Platform', 'Customer', 'Resources', 'Company') to find the goal.
    3. If you click a category, the next step should be to look for the goal again.
    4. Note that the goal need not be exact for example if the user is looking for customer reviews, we can consider Customer Reviews on G2

    Return JSON: {{"steps": [{{"action": "CLICK", "label": "Text"}}], "success_criteria": "text"}}
    """
    
    response = await llm.ainvoke(prompt)
    state["plan"] = json.loads(response.content)
    return state


async def executor(state: AgentState) -> AgentState:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        print(f"--- Navigating to {state['url']} ---")
        # Use a more relaxed initial load
        await page.goto(state["url"], wait_until="domcontentloaded", timeout=60000)
        
        for step in state["plan"].get("steps", []):
            label = step.get("label")
            action = step.get("action", "CLICK").upper()
            
            # Robust locator: case-insensitive and handles sub-elements
            locator = page.get_by_text(label, exact=False).first
            
            if await locator.count() > 0:
                print(f"Action: {action} on '{label}'")
                await locator.scroll_into_view_if_needed()
                
                if action == "CLICK":
                    try:
                        async with page.expect_navigation(timeout=3000):
                            await locator.click(force=True)
                    except:
                        await locator.click(force=True)
                        
                    await asyncio.sleep(2) 
                    
                elif action == "HOVER":
                    await locator.hover()
                    await asyncio.sleep(1)
            else:
                print(f"Warning: Element '{label}' not found.")

        await asyncio.sleep(2)
        state["page_content"] = await page.content()
        await browser.close()
        
    return state


def validator(state: AgentState) -> AgentState:
    success_criteria = state["plan"].get("success_criteria", "")
    
    # We check the content captured AFTER the steps were executed
    if success_criteria.lower() in state["page_content"].lower():
        print("Goal achieved based on page content.")
        state["success"] = True
    else:
        print(f"Success criteria '{success_criteria}' not found. Retrying...")
        state["success"] = False
        state["round"] += 1
    return state

async def humanize(state: AgentState) -> AgentState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    prompt = f"""
    Convert this plan into a user-friendly guide. 
    Mention spatial positions (left, center, right) if available in UI data.
    Furthermore be polite and ask for user satisfaction and possible follow up questions.
    GOAL: {state['goal']}
    PLAN: {json.dumps(state['plan'])}
    UI DATA: {json.dumps(state['ui_data'])}
    """
    response = await llm.ainvoke(prompt)
    state["final_walkthrough"] = response.content
    return state

def should_continue(state: AgentState):
    if state["success"] == True: return "humanize"
    elif state["success"] == False: return "handle_feature"
    return END if state["round"] >= 3 else "planner"

# --- GRAPH BUILDER ---
workflow = StateGraph(AgentState)
workflow.add_node("extract_ui", extract_ui)
workflow.add_node("planner", planner)
workflow.add_node("executor", executor)
workflow.add_node("validator", validator)
workflow.add_node("humanize", humanize)
workflow.add_node("handle_feature", handle_feature_not_found)

workflow.set_entry_point("extract_ui")
workflow.add_edge("extract_ui", "planner")
workflow.add_edge("planner", "executor")
workflow.add_edge("executor", "validator")
workflow.add_conditional_edges("validator", should_continue, {"planner": "planner", "humanize": "humanize", "handle_feature": "handle_feature", END: END})
workflow.add_edge("humanize", END)
workflow.add_edge("handle_feature", END)

graph = workflow.compile(checkpointer=MemorySaver())


async def main(url: str, goal: str, thread_id: str):
    initial_state: AgentState = {
        "url": url,
        "goal": goal,
        "ui_data": None,
        "plan": None,
        "page_content": "",
        "success": False,
        "round": 0,
        "final_walkthrough": None
    }

    
    final_state = await graph.ainvoke(initial_state, config={"configurable": {"thread_id": thread_id}})
    
    result = final_state.get("final_walkthrough")
    print(final_state.get("plan"))
    # Log/Print for debugging
    print("\n" + "="*60)
    print("FINAL RESULT\n")
    print(result)
    print("="*60)

    return result if result else "Feature/Service not found"

if __name__ == "__main__":
    url = "https://www.nowsecure.com/"
    goal = "How do I check for football updates"
    thread_id = "default_user"
    asyncio.run(main(url=url, goal=goal, thread_id=thread_id))

