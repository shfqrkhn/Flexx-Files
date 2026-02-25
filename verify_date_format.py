
from playwright.sync_api import sync_playwright
import time
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Pre-populate localStorage with a session
    session = {
        "id": "test-session-1",
        "date": "2023-10-27T10:00:00.000Z", # A specific date
        "recoveryStatus": "green",
        "sessionNumber": 1,
        "weekNumber": 1,
        "totalVolume": 1000,
        "exercises": [],
        "warmup": [],
        "cardio": {"type": "Rowing", "completed": True},
        "decompress": []
    }

    # We need to navigate to the domain first to set localStorage
    page.goto("http://localhost:8080")

    # Set localStorage
    page.evaluate(f"""
        localStorage.setItem('flexx_sessions_v3', JSON.stringify([{json.dumps(session)}]));
    """)

    # Reload to pick up the data
    page.reload()

    # Wait for app to initialize
    page.wait_for_selector("nav.bottom-nav")

    # Click on LOGS (History)
    page.click("button[data-view='history']")

    # Wait for history list
    page.wait_for_selector("#history-list")

    # Take screenshot
    page.screenshot(path="verification_date_format.png")

    # Also get the text of the date element to verify programmatically
    # The date is inside an h3 element within the card
    date_text = page.locator(".card h3").first.inner_text()
    print(f"Rendered Date: {date_text}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
