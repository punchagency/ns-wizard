import json
import asyncio
from playwright.async_api import async_playwright

async def build_mega_menu_map():
    async with async_playwright() as p:
        # We must use a headed browser or a very specific user agent for menus
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("🚀 Starting Interaction-Based Hierarchical Scrape...")
        try:
            await page.goto("https://www.nowsecure.com/", wait_until="networkidle")
            
            # 1. Clear Privacy Popup to ensure menus aren't blocked
            cookie_button = page.get_by_role("button", name="Accept All")
            if await cookie_button.count() > 0:
                await cookie_button.click()
                await asyncio.sleep(1)

            final_map = {}

            # 2. Get all top-level navigation items
            # These are the "Parent" buckets like Products, Solutions, etc.
            nav_locators = page.locator("header nav ul > li")
            count = await nav_locators.count()

            for i in range(count):
                li = nav_locators.nth(i)
                parent_link = li.locator("a").first
                parent_name = await parent_link.inner_text()
                parent_name = parent_name.strip()

                if not parent_name:
                    continue

                print(f"Mapping Category: {parent_name}...")
                
                # 3. INTERACT: Click/Hover the parent to reveal sub-items
                await parent_link.click() 
                await asyncio.sleep(1) # Wait for the menu to expand

                # 4. SCRAPE: Find links that are now visible within this <li> container
                # This ensures the children are DIRECTLY connected to the parent
                children_links = li.locator("ul a, .sub-menu a, .dropdown a")
                child_count = await children_links.count()
                
                sub_items = []
                for j in range(child_count):
                    child = children_links.nth(j)
                    text = await child.inner_text()
                    href = await child.get_attribute("href")
                    if text.strip() and text.strip() != parent_name:
                        sub_items.append({
                            "label": text.strip(),
                            "url": href
                        })
                
                final_map[parent_name] = {
                    "label": parent_name,
                    "sub_items": sub_items
                }

            # 5. Save the structured "Codebase"
            with open("nowsecure_map.json", "w") as f:
                json.dump(final_map, f, indent=4)
                
            print(f"✅ Created hierarchical map with {len(final_map)} categories.")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(build_mega_menu_map())