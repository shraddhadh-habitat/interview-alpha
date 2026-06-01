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

      // Look for sign up button and click it
      const signUpBtn = page.locator('button, a').filter({ hasText: /sign up|create account|get started/i }).first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);
      }

      // Fill signup form with test data
      const timestamp = Date.now();
      const nameField = page.locator('input[placeholder*="name" i], input[name="name"]').first();
      const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const phoneField = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
      const passwordField = page.locator('input[type="password"]').first();

      if (await nameField.isVisible()) await nameField.fill('Test User');
      if (await emailField.isVisible()) await emailField.fill(`test${timestamp}@mailinator.com`);
      if (await phoneField.isVisible()) await phoneField.fill('9876543210');
      if (await passwordField.isVisible()) await passwordField.fill('TestPassword123');

      // Submit form
      const submitBtn = page.locator('button').filter({ hasText: /create account|sign up|submit/i }).first();
      if (await submitBtn.isVisible()) await submitBtn.click();
      await page.waitForTimeout(3000);

      // Check verification screen appears
      await page.screenshot({ path: `tests/screenshots/email-verification-${device.name}.png` });

      // Verify the check email screen is shown
      const verifyText = page.locator('text=/check your email|verify|confirmation/i').first();
      await expect(verifyText).toBeVisible({ timeout: 5000 });
    });
  });
}
