import { test, expect } from '@playwright/test';

for (const width of [320, 360, 768, 1280]) {
  test(`shell fits ${width}px and navigation works`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page).toHaveTitle(/òye/);
    await expect(page.getByRole('heading', { name: /What would you like/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 360 || width === 1280) await page.screenshot({ path: `.data/screenshots/foundation-${width}.png`, fullPage: true });
    const nav = page.getByRole('navigation', { name: width <= 640 ? 'Mobile navigation' : 'Main navigation', exact: true });
    await nav.getByRole('link', { name: 'Tutor', exact: true }).click();
    await expect(page).toHaveURL(/\/tutor$/);
    await page.reload();
    await expect(page.getByRole('heading', { name: /A little help/ })).toBeVisible();
    await page.getByRole('link', { name: 'Learning preferences' }).click();
    await expect(page.getByRole('heading', { name: /Make learning yours/ })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('client proxies the Hono API', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', name: 'òye.' });
});
