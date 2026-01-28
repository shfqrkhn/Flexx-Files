
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 414, "height": 896}) # iPhone 11 Pro size
    page = context.new_page()

    # page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"ERROR: {err}"))

    # 1. Start fresh
    page.goto("http://localhost:8000")
    page.evaluate("localStorage.clear()")
    page.goto("http://localhost:8000") # Reload clean

    # 2. Start Session 1
    page.get_by_text("Green - Full Strength").click()
    page.get_by_role("button", name="Start Lifting").click()

    # 3. Select Alternative
    page.locator("#card-hinge details summary").click()
    page.select_option("#alt-hinge", "Barbell RDL")

    expect(page.locator("#name-hinge")).to_have_text("Barbell RDL")
    expect(page.locator("#last-hinge")).to_contain_text("First Session")

    # 4. Set Weight
    page.evaluate("""
        const el = document.getElementById('w-hinge');
        const current = parseFloat(el.value);
        window.modW('hinge', 135 - current);
    """)
    expect(page.locator("#w-hinge")).to_have_value("135")

    # 5. Complete sets
    page.click("#s-hinge-0")
    page.click("#s-hinge-1")
    page.click("#s-hinge-2")

    # 6. Finish Session
    page.get_by_text("Next: Cardio").click()
    page.get_by_text("Next: Decompress").click()
    page.get_by_text("Save & Finish").click()

    # Wait for modal
    page.wait_for_selector("#modal-layer.active")
    page.click(".btn-confirm") # OK button

    # 7. Start Session 2
    # Navigate to TRAIN
    page.locator(".nav-item[data-view='today']").click()

    # Skip Rest if needed
    if page.get_by_text("Rest Required").is_visible():
        page.get_by_text("Skip Rest (Debug)").click()

    page.get_by_text("Green - Full Strength").click()
    page.get_by_role("button", name="Start Lifting").click()

    # 8. Select Alternative
    page.locator("#card-hinge details summary").click()
    page.select_option("#alt-hinge", "Barbell RDL")

    # 9. Verify Stats
    expect(page.locator("#last-hinge")).to_contain_text("Last: 135 lbs")
    expect(page.locator("#w-hinge")).to_have_value("140")

    page.screenshot(path="verification/verification_alt.png")
    print("Verification Passed!")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
