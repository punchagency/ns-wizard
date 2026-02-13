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



async def extract_ui(state: AgentState) -> AgentState:
    url = state["url"]
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        context.set_default_navigation_timeout(90000)
        page = await context.new_page()
        try:
    
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await asyncio.sleep(5) # Allow JS to hydrate

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
                        // Piercing Shadow DOM
                        root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) collect(el.shadowRoot); });
                    };
                    collect(document);
                    return results;
                }
            """)
        finally:
            await browser.close()
            
    state["ui_data"] = ui_data
    return state

async def planner(state: AgentState) -> AgentState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0, model_kwargs={"response_format": {"type": "json_object"}})
    prompt = f"""
    Produce a JSON plan. Use ONLY labels from the UI Data. 
    UI: {json.dumps(state['ui_data'])}
    GOAL: {state['goal']}
    JSON Format: {{"steps": [{{"action": "CLICK", "label": "Text"}}], "success_criteria": "text"}}
    """
    response = await llm.ainvoke(prompt)
    state["plan"] = json.loads(response.content)
    return state

async def executor(state: AgentState) -> AgentState:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(state["url"], wait_until="load")
        
        for step in state["plan"].get("steps", []):
            label = step.get("label")
            locator = page.get_by_text(label, exact=False).first
            if await locator.count() > 0:
                await locator.scroll_into_view_if_needed()
                # Use force=True for elements hidden in dropdowns
                await locator.click(force=True, timeout=5000)
                await asyncio.sleep(2)
        
        state["page_content"] = await page.content()
        await browser.close()
    return state

def validator(state: AgentState) -> AgentState:
    success_criteria = state["plan"].get("success_criteria", "")
    state["success"] = success_criteria.lower() in state["page_content"].lower()
    if not state["success"]: state["round"] += 1
    return state

async def humanize(state: AgentState) -> AgentState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    prompt = f"""
    Convert this plan into a user-friendly guide. 
    Mention spatial positions (left, center, right) if available in UI data.
    GOAL: {state['goal']}
    PLAN: {json.dumps(state['plan'])}
    UI DATA: {json.dumps(state['ui_data'])}
    """
    response = await llm.ainvoke(prompt)
    state["final_walkthrough"] = response.content
    return state

def should_continue(state: AgentState):
    if state["success"]: return "humanize"
    return END if state["round"] >= 2 else "planner"

# --- GRAPH BUILDER ---
workflow = StateGraph(AgentState)
workflow.add_node("extract_ui", extract_ui)
workflow.add_node("planner", planner)
workflow.add_node("executor", executor)
workflow.add_node("validator", validator)
workflow.add_node("humanize", humanize)

workflow.set_entry_point("extract_ui")
workflow.add_edge("extract_ui", "planner")
workflow.add_edge("planner", "executor")
workflow.add_edge("executor", "validator")
workflow.add_conditional_edges("validator", should_continue, {"planner": "planner", "humanize": "humanize", END: END})
workflow.add_edge("humanize", END)

graph = workflow.compile(checkpointer=MemorySaver())

async def main(url: str, goal: str, thread_id: str):

    initial_state: AgentState = {
        "url": url,
        "goal": goal,
        "ui_data": None,
        "plan": None,
        "page_content": None,
        "success": False,
        "round": 0,
        "final_walkthrough": None
    }

    result = await graph.ainvoke(initial_state, config = {"configurable": {"thread_id": thread_id}})
    return result.get("final_walkthrough", "Feature/Service not found")
    print("\n" + "="*60)
    print("FINAL RESULT\n")
    print(result.get("final_walkthrough", "FAILED"))
    print("="*60)


if __name__ == "__main__":
    url = "https://www.nowsecure.com/"
    goal = "How do I locate the Mobile Pen Testing as a Service (PTaaS) details?"
    thread_id = "default_user"
    asyncio.run(main(url=url, goal=goal, thread_id=thread_id))

