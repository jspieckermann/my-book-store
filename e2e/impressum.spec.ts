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

  test('switching the UI language to German translates the Impressum headings and labels, while the fixed data stays unchanged', async ({
    page,
  }) => {
    await page.goto('/impressum');
    await expect(page.locator('.impressum')).toContainText('Imprint');
    await expect(page.locator('.impressum')).toContainText('Contact');

    await selectLanguage(page, 'DE');

    await expect(page.locator('.impressum')).toContainText('Impressum');
    await expect(page.locator('.impressum')).toContainText('Kontakt');
    await expect(page.locator('.impressum')).toContainText('Max Mustermann');
    await expect(page.locator('.impressum')).toContainText('DE123456789');
    await expect(page.locator('a[href="https://ec.europa.eu/consumers/odr/"]')).toBeVisible();
  });

  test("the footer's Impressum link text follows the selected UI language", async ({ page }) => {
    await page.goto('/');
    const link = page.locator('.impressum-link');
    await expect(link).toHaveText('Imprint');

    await selectLanguage(page, 'DE');

    await expect(link).toHaveText('Impressum');
  });

  test('the back-link on the Impressum page navigates to the main page', async ({ page }) => {
    await page.goto('/impressum');
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();

    await backLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.page-title')).toHaveText('Search');
  });
});
