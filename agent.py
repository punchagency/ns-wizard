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

async def executor_node(state: AgentState):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a context to set a larger global timeout
        context = await browser.new_context()
        context.set_default_navigation_timeout(60000) 
        page = await context.new_page()

        print(f"--- Executing Plan on {state['url']} ---")
        
        try:
            await page.goto(state["url"], wait_until="domcontentloaded", timeout=60000)
            await asyncio.sleep(3)
            
            llm = ChatOpenAI(model="gpt-4o").with_structured_output(NavigationPlan)
            plan_prompt = f"Convert your previous analysis into a JSON plan for: {state['goal']}. UI Context: {json.dumps(state['ui_data'])}"
            plan_output_model = await llm.ainvoke(plan_prompt)
            plan_output = plan_output_model.dict()
            for step in plan_output.get("steps", []):
                label = step["label"]
                locator = page.get_by_text(label, exact=False).first
                if await locator.count() > 0:
                    await locator.scroll_into_view_if_needed()
                    await locator.click(force=True)
                    await asyncio.sleep(2)
            
            state["page_content"] = await page.content()
        finally:
            await browser.close()
    
    return {"page_content": state["page_content"], "plan": plan_output}

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

async def main(url: str, goal: str, thread_id: str):
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
        "final_walkthrough": None
    }
    
    final_state = await graph.ainvoke(initial_state, config={"configurable": {"thread_id": thread_id}})
    print(final_state["final_walkthrough"])
    return final_state["final_walkthrough"]

if __name__ == "__main__":
    asyncio.run(main("https://www.nowsecure.com/", "How do I access football updates on NowSecure?", "user_1"))

