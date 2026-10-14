import { test, expect } from '@playwright/test';

test('preferences save, survive a reload, and remain isolated between browsers', async ({ page, browser }) => {
  await page.goto('/settings');
  const language = page.getByRole('combobox', { name: 'Learning language', exact: true });
  await language.click();
  await page.getByRole('option', { name: 'Yorùbá', exact: true }).click();
  await expect(page.getByText('Preferences saved.', { exact: true })).toBeVisible();
  await page.getByRole('switch', { name: 'Use less data' }).click();
  await expect(page.getByRole('switch', { name: 'Use less data' })).toBeChecked();
  await expect(page.getByText('Preferences saved.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(language).toHaveValue('Yorùbá');
  await expect(page.getByRole('switch', { name: 'Use less data' })).toBeChecked();
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto('http://127.0.0.1:5187/settings');
  await expect(otherPage.getByRole('combobox', { name: 'Learning language', exact: true })).toHaveValue('English');
  await other.close();
});
