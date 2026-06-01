import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const devices = [
  { name: 'ios-iphone14', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'ios-iphonese', viewport: { width: 375, height: 667 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'ios-iphone14pm', viewport: { width: 430, height: 932 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'android-galaxys9', viewport: { width: 360, height: 740 }, userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-G960F) AppleWebKit/537.36' },
  { name: 'android-pixel7', viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36' },
];

for (const device of devices) {
  test.describe(`Mobile: ${device.name}`, () => {
    test.use({ viewport: device.viewport, userAgent: device.userAgent });

    test('Homepage loads', async ({ page }) => {
      await page.goto(BASE_URL);
      expect(await page.title()).toMatch(/Interview|Alpha/i);
      await page.screenshot({ path: `tests/screenshots/${device.name}-01-homepage.png`, fullPage: true });
    });

    test('No horizontal scroll', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test('Hero section visible', async ({ page }) => {
      await page.goto(BASE_URL);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      await page.screenshot({ path: `tests/screenshots/${device.name}-02-hero.png` });
    });

    test('Feedback preview responsive', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const section = page.locator('section').filter({ hasText: /See it in action/ }).first();
      if (await section.isVisible()) await section.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `tests/screenshots/${device.name}-03-feedback.png` });
    });

    test('CTA buttons visible', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      const buttons = page.locator('button').filter({ hasText: /answer|start|browse/i });
      await expect(buttons.first()).toBeVisible({ timeout: 10000 });
      expect(await buttons.count()).toBeGreaterThan(0);
      await page.screenshot({ path: `tests/screenshots/${device.name}-04-buttons.png` });
    });

    test('Email verification screen shows after signup attempt', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Find and click a CTA button (e.g., "Get Started", "Start Free", etc.)
      // This should trigger the LoginModal to appear
      const allButtons = page.locator('button, a');
      let clicked = false;

      for (let i = 0; i < Math.min(await allButtons.count(), 10); i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent();
        if (text && /answer|practice|start|free/i.test(text)) {
          await btn.click();
          await page.waitForTimeout(1500);
          clicked = true;
          break;
        }
      }

      if (!clicked) {
        // Fallback: click first visible button
        await allButtons.first().click();
        await page.waitForTimeout(1500);
      }

      // Look for the "Sign Up" tab in LoginModal and click it
      const tabs = page.locator('button').filter({ hasText: /Sign Up/i });
      if (await tabs.count() > 0) {
        // Get the tab that's not the page title button
        const signupTab = tabs.last();
        if (await signupTab.isVisible()) {
          await signupTab.click();
          await page.waitForTimeout(500);
        }
      }

      // Fill signup form with exact placeholders from LoginModal.jsx
      const timestamp = Date.now();
      const inputs = page.locator('input');

      // Fill by placeholder text
      const nameField = page.locator('input[placeholder="Enter your full name"]');
      const emailField = page.locator('input[placeholder="you@example.com"]');
      const phoneField = page.locator('input[placeholder="+91 9876543210"]');
      const passwordField = page.locator('input[placeholder="Min. 8 characters"]');
      const confirmField = page.locator('input[placeholder="Repeat password"]');

      // Fill all visible fields
      if (await nameField.isVisible()) await nameField.fill('Test User', { timeout: 3000 });
      if (await emailField.isVisible()) await emailField.fill(`test${timestamp}@mailinator.com`, { timeout: 3000 });
      if (await phoneField.isVisible()) await phoneField.fill('9876543210', { timeout: 3000 });
      if (await passwordField.isVisible()) await passwordField.fill('TestPassword123', { timeout: 3000 });
      if (await confirmField.isVisible()) await confirmField.fill('TestPassword123', { timeout: 3000 });

      // Submit - find and click "Create Account" button
      const submitBtn = page.locator('button:has-text("Create Account")').first();
      if (await submitBtn.isVisible({ timeout: 3000 })) {
        await submitBtn.click();
        await page.waitForTimeout(3500);
      }

      // Take screenshot
      await page.screenshot({ path: `tests/screenshots/email-verification-${device.name}.png` });

      // Verify the verification screen: check for "Check your email" text
      const checkEmailText = page.locator('text=Check your email');
      await expect(checkEmailText).toBeVisible({ timeout: 8000 });
    });
  });
}
