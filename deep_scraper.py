import json
import asyncio
import os
import shutil
from playwright.async_api import async_playwright

async def build_hierarchical_map():
    # 1. CLEANUP: Ensure a fresh data directory exists
    if os.path.exists("data"):
        shutil.rmtree("data")
    os.makedirs("data", exist_ok=True)

    async with async_playwright() as p:
        # Increase launch timeout for slower environments
        browser = await p.chromium.launch(headless=True, timeout=60000)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()
        
        # Set a 60s global timeout to handle slow enterprise pages
        page.set_default_navigation_timeout(60000)

        print("🚀 Starting Hierarchical Scrape...")
        try:
            # Switch to 'domcontentloaded' to avoid strict networkidle timeouts
            await page.goto("https://www.nowsecure.com/", wait_until="domcontentloaded")
            
            # Wait for main nav specifically instead of waiting for the whole network
            await page.wait_for_selector("nav", timeout=15000)

            # Clear Privacy Disclosure
            cookie_button = page.get_by_role("button", name="Accept All")
            if await cookie_button.count() > 0:
                await cookie_button.click()
                await asyncio.sleep(1)

            # Extract Primary Categories
            categories = await page.evaluate("""
                () => {
                    const items = [];
                    document.querySelectorAll('header nav ul > li > a').forEach(a => {
                        if (a.innerText.trim()) {
                            items.push({ label: a.innerText.trim(), url: a.href });
                        }
                    });
                    return items;
                }
            """)

            final_map = {}

            # Visit each category individually
            for cat in categories:
                label = cat['label']
                print(f"Mapping: {label}...")
                final_map[label] = { "url": cat['url'], "sub_items": [] }
                
                try:
                    # Navigate using the faster DOM strategy
                    await page.goto(cat['url'], wait_until="domcontentloaded")
                    
                    sub_items = await page.evaluate("""
                        () => {
                            const found = [];
                            // Target links in the main content only
                            const container = document.querySelector('main') || document.body;
                            container.querySelectorAll('a').forEach(el => {
                                const text = el.innerText.trim();
                                if (text && text.length > 3) {
                                    found.push({ label: text, url: el.href });
                                }
                            });
                            return found;
                        }
                    """)
                    final_map[label]["sub_items"] = sub_items
                except Exception as e:
                    print(f"⚠️ Skipping sub-items for {label} due to error: {e}")

            # 2. SAVE: This line must be inside the try/finally block to ensure it runs
            with open("nowsecure_map.json", "w") as f:
                json.dump(final_map, f, indent=4)
                
            print(f"✅ Success! Created nowsecure_map.json in {os.getcwd()}")

        except Exception as e:
            print(f"❌ Critical error during scrape: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(build_hierarchical_map())