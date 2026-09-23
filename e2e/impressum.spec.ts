import { test, expect, Page } from '@playwright/test';

async function selectLanguage(page: Page, code: 'EN' | 'DE'): Promise<void> {
  await page.locator('.language-switcher-toggle').click();
  await page.locator('.language-switcher-option', { hasText: code }).click();
}

test.describe('impressum', () => {
  test('the footer Impressum link is visible on the main page and the cart page, and navigates to /impressum', async ({
    page,
  }) => {
    await page.goto('/');
    const mainLink = page.locator('.impressum-link');
    await expect(mainLink).toBeVisible();

    await page.goto('/cart');
    const cartLink = page.locator('.impressum-link');
    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/\/impressum$/);
  });

  test('the Impressum page displays the operator name, the EU ODR link, and the VAT ID', async ({ page }) => {
    await page.goto('/impressum');

    await expect(page.locator('.impressum')).toContainText('Max Mustermann');
    await expect(page.locator('.impressum')).toContainText('DE123456789');
    await expect(page.locator('a[href="https://ec.europa.eu/consumers/odr/"]')).toBeVisible();
  });

  test('the Impressum page content stays German after switching the UI language to German', async ({ page }) => {
    await page.goto('/impressum');
    const impressumText = await page.locator('.impressum').textContent();

    await selectLanguage(page, 'DE');

    await expect(page.locator('.impressum')).toHaveText(impressumText ?? '');
  });
});
