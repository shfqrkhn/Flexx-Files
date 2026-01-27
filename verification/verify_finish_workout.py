from playwright.sync_api import sync_playwright
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 812})
        page = context.new_page()

        # Capture logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Error: {err}"))

        # Load app
        page.goto("http://localhost:8000/index.html")

        # Wait for recovery options
        page.wait_for_selector("text=How do you feel?")

        # Select Recovery (Green)
        print("Selecting Green recovery...")
        # Use a more specific selector
        page.click("h3:has-text('Green')")

        # Wait for Warmup
        print("Waiting for Warmup...")
        page.wait_for_selector("text=Warmup")

        # Click Start Lifting
        print("Clicking Start Lifting...")
        page.click("button[aria-label='Start lifting phase']")

        # Wait for Lifting
        print("Waiting for Lifting...")
        page.wait_for_selector("text=Lifting")

        # Click Next: Cardio
        print("Clicking Next: Cardio...")
        page.click("button[aria-label='Proceed to cardio phase']")

        # Wait for Cardio
        print("Waiting for Cardio...")
        page.wait_for_selector("text=Cardio")

        # Click Next: Decompress
        print("Clicking Next: Decompress...")
        page.click("button[aria-label='Proceed to decompression phase']")

        # Wait for Decompress
        print("Waiting for Decompress...")
        page.wait_for_selector("text=Decompress")

        # Click Save & Finish
        print("Clicking Save & Finish...")
        page.click("button[aria-label='Save workout and finish session']")

        # Handle Modal "OK"
        print("Confirming Modal...")
        page.click("button[class*='btn-confirm']")

        # Wait for History view to load
        print("Waiting for History...")
        page.wait_for_selector("text=History")

        # Verify the session is listed
        page.wait_for_selector("text=GREEN")

        # Screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/history_success.png")
        print("Verification successful, screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run_verification()
