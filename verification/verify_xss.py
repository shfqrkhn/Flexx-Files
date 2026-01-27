from playwright.sync_api import sync_playwright
import json
import sys

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Capture console errors to detect XSS execution
        xss_triggered = False
        def handle_console(msg):
            nonlocal xss_triggered
            if "XSS_SUCCESS" in msg.text:
                xss_triggered = True
                print("XSS_SUCCESS detected in console!")

        page.on("console", handle_console)

        # 1. Load the app
        print("Loading app...")
        page.goto("http://localhost:8000/index.html")

        # 2. Inject Malicious Draft into LocalStorage
        malicious_draft = {
            "id": "malicious-session-id",
            "date": "2023-10-27T10:00:00.000Z",
            "recoveryStatus": "green",
            "exercises": [
                {
                    "id": "hinge",
                    "name": "Trap Bar Deadlift",
                    "weight": 100,
                    "setsCompleted": 0,
                    "completed": False,
                    "usingAlternative": True,
                    "altName": "<img src=x onerror=console.error('XSS_SUCCESS') id='xss-img'>",
                    "skipped": False
                }
            ]
        }

        print("Injecting malicious draft...")
        page.evaluate("([key, value]) => localStorage.setItem(key, value)", ['flexx_draft_session', json.dumps(malicious_draft)])

        # 3. Reload to trigger restore prompt
        print("Reloading to trigger restore...")
        page.reload()

        # 4. Handle Restore Modal
        print("Waiting for Restore Modal...")
        try:
            # Wait for modal content
            page.wait_for_selector("#modal-layer.active", timeout=5000)
            page.click("#modal-actions .btn-confirm") # Click 'OK'
        except Exception as e:
            print(f"Modal not found or error: {e}")
            # Debug: print html
            # print(page.content())
            browser.close()
            sys.exit(1)

        # 5. Check for XSS
        print("Waiting for Lifting view...")
        try:
            page.wait_for_selector("text=Lifting", timeout=5000)
        except:
             print("Lifting view did not load.")
             browser.close()
             sys.exit(1)

        # Check if the image element exists (Vulnerable)
        # If sanitized, it should be text content, not an element
        xss_element_count = page.locator("#xss-img").count()

        if xss_element_count > 0:
            print("VULNERABILITY CONFIRMED: #xss-img element found in DOM.")
        else:
            print("App appears safe: #xss-img element NOT found in DOM.")

        if xss_triggered:
             print("VULNERABILITY CONFIRMED: Console error triggered.")

        # Also check for text content to verify it rendered at all (as text)
        content = page.content()
        if "&lt;img" in content:
            print("Sanitization verified: escaped HTML found.")

        browser.close()

if __name__ == "__main__":
    run_verification()
