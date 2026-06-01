# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.js >> android-pixel7 >> Resume tools page loads
- Location: tests\mobile.spec.js:72:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:5173';
  4   | 
  5   | const devices = [
  6   |   { name: 'ios-iphone14', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  7   |   { name: 'ios-iphonese', viewport: { width: 375, height: 667 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  8   |   { name: 'ios-iphone14pm', viewport: { width: 430, height: 932 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  9   |   { name: 'android-galaxys9', viewport: { width: 360, height: 740 }, userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-G960F) AppleWebKit/537.36' },
  10  |   { name: 'android-pixel7', viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36' },
  11  |   // Desktop and Laptop viewports
  12  |   { name: 'desktop-1920x1080', viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  13  |   { name: 'laptop-1366x768', viewport: { width: 1366, height: 768 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  14  |   { name: 'laptop-macbook-pro-14', viewport: { width: 1512, height: 982 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  15  |   { name: 'tablet-ipad-pro', viewport: { width: 1024, height: 1366 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' },
  16  | ];
  17  | 
  18  | for (const device of devices) {
  19  |   test.describe(`${device.name}`, () => {
  20  |     test.use({ viewport: device.viewport, userAgent: device.userAgent });
  21  | 
  22  |     test('Homepage loads', async ({ page }) => {
  23  |       await page.goto(BASE_URL);
  24  |       expect(await page.title()).toMatch(/Interview|Alpha/i);
  25  |       await page.screenshot({ path: `tests/screenshots/${device.name}-01-homepage.png`, fullPage: true });
  26  |     });
  27  | 
  28  |     test('No horizontal scroll', async ({ page }) => {
  29  |       await page.goto(BASE_URL);
  30  |       await page.waitForLoadState('networkidle');
  31  |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  32  |       const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  33  |       expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  34  |     });
  35  | 
  36  |     test('Hero section visible', async ({ page }) => {
  37  |       await page.goto(BASE_URL);
  38  |       const h1 = page.locator('h1').first();
  39  |       await expect(h1).toBeVisible();
  40  |       await page.screenshot({ path: `tests/screenshots/${device.name}-02-hero.png` });
  41  |     });
  42  | 
  43  |     test('Feedback preview responsive', async ({ page }) => {
  44  |       await page.goto(BASE_URL);
  45  |       await page.waitForLoadState('networkidle');
  46  |       const section = page.locator('section').filter({ hasText: /See it in action/ }).first();
  47  |       if (await section.isVisible()) await section.scrollIntoViewIfNeeded();
  48  |       await page.screenshot({ path: `tests/screenshots/${device.name}-03-feedback.png` });
  49  |     });
  50  | 
  51  |     test('CTA buttons visible', async ({ page }) => {
  52  |       await page.goto(BASE_URL);
  53  |       await page.waitForLoadState('networkidle');
  54  |       await page.waitForTimeout(1000);
  55  |       const buttons = page.locator('button').filter({ hasText: /answer|start|browse/i });
  56  |       await expect(buttons.first()).toBeVisible({ timeout: 10000 });
  57  |       expect(await buttons.count()).toBeGreaterThan(0);
  58  |       await page.screenshot({ path: `tests/screenshots/${device.name}-04-buttons.png` });
  59  |     });
  60  | 
  61  |     test('Pricing page loads with all 3 cards', async ({ page }) => {
  62  |       await page.goto(`${BASE_URL}/upgrade`);
  63  |       await page.waitForLoadState('networkidle');
  64  | 
  65  |       await expect(page.locator('text=Monthly')).toBeVisible();
  66  |       await expect(page.locator('text=Quarterly')).toBeVisible();
  67  |       await expect(page.locator('text=Yearly')).toBeVisible();
  68  | 
  69  |       await page.screenshot({ path: `tests/screenshots/${device.name}-05-pricing.png`, fullPage: true });
  70  |     });
  71  | 
  72  |     test('Resume tools page loads', async ({ page }) => {
> 73  |       await page.goto(BASE_URL);
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  74  |       await page.waitForLoadState('networkidle');
  75  | 
  76  |       const resumeTab = page.locator('text=Resume Tools').first();
  77  |       if (await resumeTab.isVisible()) {
  78  |         await resumeTab.click();
  79  |         await page.waitForTimeout(1000);
  80  |         await page.screenshot({ path: `tests/screenshots/${device.name}-06-resume-tools.png`, fullPage: true });
  81  |       }
  82  |     });
  83  | 
  84  |     test('No console errors on homepage', async ({ page }) => {
  85  |       const errors = [];
  86  |       page.on('console', msg => {
  87  |         if (msg.type() === 'error') errors.push(msg.text());
  88  |       });
  89  | 
  90  |       await page.goto(BASE_URL);
  91  |       await page.waitForLoadState('networkidle');
  92  |       await page.waitForTimeout(2000);
  93  | 
  94  |       // Filter out known non-critical errors
  95  |       const criticalErrors = errors.filter(e =>
  96  |         !e.includes('favicon') &&
  97  |         !e.includes('404') &&
  98  |         !e.includes('analytics') &&
  99  |         !e.includes('Uncaught SyntaxError: Unexpected token')
  100 |       );
  101 | 
  102 |       if (criticalErrors.length > 0) {
  103 |         console.log(`[${device.name}] Console errors found:`, criticalErrors);
  104 |       }
  105 |       expect(criticalErrors.length).toBe(0);
  106 |     });
  107 | 
  108 |     test('Practice page loads correctly', async ({ page }) => {
  109 |       await page.goto(`${BASE_URL}`);
  110 |       await page.waitForLoadState('networkidle');
  111 | 
  112 |       // Click on practice section
  113 |       const practiceLink = page.locator('text=/Practice|Answer/i').first();
  114 |       if (await practiceLink.isVisible()) {
  115 |         await practiceLink.click();
  116 |         await page.waitForLoadState('networkidle');
  117 |         await page.screenshot({ path: `tests/screenshots/${device.name}-07-practice.png`, fullPage: true });
  118 |       }
  119 |     });
  120 | 
  121 |     test('Text input form responsive', async ({ page }) => {
  122 |       await page.goto(`${BASE_URL}`);
  123 |       await page.waitForLoadState('networkidle');
  124 | 
  125 |       const textarea = page.locator('textarea').first();
  126 |       if (await textarea.isVisible()) {
  127 |         await textarea.fill('This is a test answer with enough words to meet the minimum requirement for testing purposes.');
  128 |         await page.screenshot({ path: `tests/screenshots/${device.name}-08-textarea.png` });
  129 | 
  130 |         // Check submit button state
  131 |         const submitBtn = page.locator('button').filter({ hasText: /Submit/i }).first();
  132 |         if (await submitBtn.isVisible()) {
  133 |           const isEnabled = await submitBtn.isEnabled();
  134 |           console.log(`[${device.name}] Submit button enabled:`, isEnabled);
  135 |         }
  136 |       }
  137 |     });
  138 |   });
  139 | }
  140 | 
  141 | /*
  142 |   MANUAL TEST: Email Verification Flow
  143 | 
  144 |   The email verification feature requires Supabase email configuration to test end-to-end.
  145 |   To test manually across all devices:
  146 | 
  147 |   1. Start dev server: npm run dev
  148 |   2. Open each device in browser DevTools mobile emulation:
  149 | 
  150 |      MOBILE:
  151 |      - iPhone 14 (390x844)
  152 |      - iPhone SE (375x667)
  153 |      - iPhone 14 Pro Max (430x932)
  154 |      - Galaxy S9 (360x740)
  155 |      - Pixel 7 (412x915)
  156 | 
  157 |      TABLET:
  158 |      - iPad Pro (1024x1366)
  159 | 
  160 |      DESKTOP/LAPTOP:
  161 |      - 1920x1080 (Windows Desktop)
  162 |      - 1366x768 (Windows Laptop)
  163 |      - MacBook Pro 14" (1512x982)
  164 | 
  165 |   3. For each device, perform signup flow:
  166 |      a. Click "Get Started" or similar CTA button
  167 |      b. Click "Sign Up" tab
  168 |      c. Fill form:
  169 |         - Full Name: "Test User"
  170 |         - Email: any test email
  171 |         - Phone: "9876543210"
  172 |         - Password: "TestPassword123"
  173 |         - Confirm Password: "TestPassword123"
```