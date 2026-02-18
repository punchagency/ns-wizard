import asyncio
import json
from dotenv import load_dotenv
from urllib.parse import urlparse

from playwright.async_api import async_playwright
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults

load_dotenv()


async def generate_plan(ui_data: dict, goal: str) -> dict:
    llm = ChatOpenAI(model="gpt-4o", temperature=0, model_kwargs={
        "response_format": {"type": "json_object"}
    })

    prompt = f"""
You are a web navigation planner.

Given the UI structure and the goal, produce a JSON plan.

RULES:
- Use ONLY provided UI labels
- Do NOT invent elements
- Output valid JSON
- Max 5 steps
- Each step must be one of:
  - CLICK
  - NAVIGATE
  - WAIT

Format:

{{
  "steps": [
    {{
      "action": "CLICK",
      "label": "Exact UI Text"
    }}
  ],
  "success_criteria": "Text that should appear on page if goal is achieved"
}}

UI STRUCTURE:
{json.dumps(ui_data, indent=2)}

GOAL:
{goal}
"""

    response = await llm.ainvoke(prompt)

    print("\nRAW LLM RESPONSE:\n", response.content)

    try:
        return json.loads(response.content)
    except Exception as e:
        print("JSON PARSE ERROR:", e)
        return {"steps": [], "success_criteria": goal}


async def execute_plan(url: str, plan: dict) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(url)
        await page.wait_for_load_state("networkidle")

        for step in plan.get("steps", []):
            action = step.get("action")
            label = step.get("label")

            if action == "CLICK":
                locator = page.locator(f"text={label}")
                if await locator.count() > 0:
                    await locator.first.click()
                    await page.wait_for_load_state("networkidle")
                else:
                    print(f"Element not found: {label}")

            elif action == "NAVIGATE":
                await page.goto(label)
                await page.wait_for_load_state("networkidle")

            elif action == "WAIT":
                await asyncio.sleep(2)

        content = await page.content()
        await browser.close()

        return content

def validate_execution(page_content: str, success_criteria: str) -> bool:
    return success_criteria.lower() in page_content.lower()


async def extract_ui_structure(url: str) -> dict:
    """
    Load the page using Playwright and extract structured UI elements.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True, 
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )

        page = await context.new_page()
        await page.goto(url, timeout=60000)
        await asyncio.sleep(2)

        # Wait for network idle to ensure content loads
        await page.wait_for_load_state("networkidle")

        # Extract navigation links
        nav_links = await page.evaluate("""
        () => {
            const elements = Array.from(document.querySelectorAll("nav a, header a"));

            return elements
                .map(el => {
                    const rect = el.getBoundingClientRect();
                    const text = el.innerText.trim();

                    if (!text) return null;

                    let horizontal_position = "center";
                    if (rect.x < window.innerWidth / 3) {
                        horizontal_position = "left";
                    } else if (rect.x > (window.innerWidth * 2) / 3) {
                        horizontal_position = "right";
                    }

                    return {
                        text: text,
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                        horizontal_position: horizontal_position
                    };
                })
                .filter(el => el !== null);
        }
        """)


        # Extract header menu links (fallback if nav empty)
        if not nav_links:
            nav_links = await page.evaluate("""
                () => {
                    const links = Array.from(document.querySelectorAll("header a"));
                    return links.map(link => link.innerText.trim())
                                .filter(text => text.length > 0);
                }
            """)

        # Extract main clickable buttons
        buttons = await page.evaluate("""
            () => {
                const selectors = [
                    'button', 
                    'a[role="button"]', 
                    '[type="button"]', 
                    '[type="submit"]',
                    '.btn', 
                    '.button'
                ];
                const elements = Array.from(document.querySelectorAll(selectors.join(',')));
                
                return elements
                    .filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && 
                               style.visibility !== 'hidden' && 
                               el.offsetWidth > 0;
                    })
                    .map(el => el.innerText.trim())
                    .filter(text => text.length > 0);
            }
        """)

        cookie_button = page.locator('#onetrust-accept-btn-handler, .cookie-accept, [id*="cookie"] button');
        if await cookie_button.is_visible():
            await cookie_button.click()
            print("Accepted cookies.")


        # Extract section headings
        headings = await page.evaluate("""
            () => {
                const heads = Array.from(document.querySelectorAll("h1, h2, h3"));
                return heads.map(h => h.innerText.trim())
                            .filter(text => text.length > 0);
            }
        """)

        await browser.close()
    unique_nav = {}
    for item in nav_links:
        unique_nav[item["text"]] = item 

    nav_links = list(unique_nav.values())
    return {
        "navigation_links": nav_links,
        "buttons": list(set(buttons)),
        "headings": list(set(headings))
    }


# ==========================================================
# LLM WALKTHROUGH GENERATOR (CONSTRAINED)
# ==========================================================

async def generate_walkthrough(ui_data: dict, goal: str) -> str:
    """
    Generate step-by-step instructions using ONLY extracted UI data.
    """

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0
    )

    structured_json = json.dumps(ui_data, indent=2)

    prompt = f"""
You are a website walkthrough generator.

CRITICAL RULES:
- Use ONLY the provided UI structure.
- Do NOT invent menu names.
- If the goal cannot be achieved from the UI structure, return: FAILED.

UI STRUCTURE:
{structured_json}

GOAL:
{goal}

Produce a clear, numbered, step-by-step guide for a user.
Use exact labels from the UI structure.
"""

    response = await llm.ainvoke(prompt)
    return response.content


async def generate_human_walkthrough(plan: dict, ui_data: dict, goal: str) -> str:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    prompt = f"""
You are a professional website walkthrough assistant.

Your job is to convert a structured execution plan into a clear,
detailed, user-friendly step-by-step guide.

RULES:
- Use natural language.
- Mention element position if available (left, center, right).
- Explain what the user should expect.
- Be precise but readable.
- Number the steps.

PLAN:
{json.dumps(plan, indent=2)}

UI DATA:
{json.dumps(ui_data, indent=2)}

GOAL:
{goal}

Produce a final walkthrough.
"""

    response = await llm.ainvoke(prompt)
    return response.content


# class WebsiteWalkthroughEngine:

#     def __init__(self, url: str):
#         self.url = url
#         self.max_rounds = 2

#     async def run(self, goal: str):
#         ui_data = await extract_ui_structure(self.url)

#         for round_number in range(self.max_rounds):
#             print(f"\n===== ROUND {round_number + 1} =====")

#             plan = await generate_plan(ui_data, goal)
#             print("Generated Plan:", json.dumps(plan, indent=2))

#             page_content = await execute_plan(self.url, plan)

#             if validate_execution(page_content, plan.get("success_criteria", "")):
#                 print("Validation successful")
#                 return plan

#             print("Validation failed — replanning...\n")

#         return "FAILED after 2 rounds."

class WebsiteWalkthroughEngine:

    def __init__(self, url: str):
        self.url = url
        self.max_rounds = 2

    async def run(self, goal: str):

        for round_number in range(self.max_rounds):
            print(f"\n===== ROUND {round_number + 1} =====")

            ui_data = await extract_ui_structure(self.url)

            plan = await generate_plan(ui_data, goal)
            print("Generated Plan:", json.dumps(plan, indent=2))

            page_content = await execute_plan(self.url, plan)

            if validate_execution(page_content, plan.get("success_criteria", "")):
                print("Validation successful")

                final_walkthrough = await generate_human_walkthrough(
                    plan, ui_data, goal
                )

                return final_walkthrough

            print("Validation failed — replanning...\n")

        return "FAILED after 2 rounds."




async def main(url, goal):

    # url = "https://www.nowsecure.com/"
    # goal = "How do I locate the Mobile Pen Testing as a Service (PTaaS) details?"

    engine = WebsiteWalkthroughEngine(url)

    walkthrough = await engine.run(goal)

    print("\n" + "=" * 60)
    print("FINAL WALKTHROUGH\n")
    print(walkthrough)
    print("=" * 60)
    return walkthrough


if __name__ == "__main__":
    url = "https://www.nowsecure.com/"
    goal = "How do I locate the Mobile Pen Testing as a Service (PTaaS) details?"
    asyncio.run(main(url=url, goal=goal))
