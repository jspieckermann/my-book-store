import { test, expect, Page } from '@playwright/test';

async function selectLanguage(page: Page, code: 'EN' | 'DE'): Promise<void> {
  await page.locator('.language-switcher-toggle').click();
  await page.locator('.language-switcher-option', { hasText: code }).click();
}

test.describe('impressum', () => {
  // covers: app-footer > Footer content > Footer link navigates to the Impressum page
  // covers: impressum > Impressum page content > Impressum page is reachable
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

  // covers: impressum > Impressum page content > Operator identity and contact details are shown
  // covers: impressum > Impressum page content > VAT identification number is shown
  // covers: impressum > Impressum page content > EU dispute resolution link is shown
  test('the Impressum page displays the operator name, the EU ODR link, and the VAT ID', async ({ page }) => {
    await page.goto('/impressum');

    await expect(page.locator('.impressum')).toContainText('Max Mustermann');
    await expect(page.locator('.impressum')).toContainText('DE123456789');
    await expect(page.locator('a[href="https://ec.europa.eu/consumers/odr/"]')).toBeVisible();
  });

  // covers: impressum > Impressum content follows the selected UI language > Impressum content is shown in English
  // covers: impressum > Impressum content follows the selected UI language > Impressum content is shown in German
  // covers: impressum > Impressum content follows the selected UI language > Switching the language while viewing the Impressum updates its content
  // covers: impressum > Impressum content follows the selected UI language > Fixed identity and legal data are unaffected by the selected language
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

  // covers: localization > Switching the language > Selecting German switches the language
  test("the footer's Impressum link text follows the selected UI language", async ({ page }) => {
    await page.goto('/');
    const link = page.locator('.impressum-link');
    await expect(link).toHaveText('Imprint');

    await selectLanguage(page, 'DE');

    await expect(link).toHaveText('Impressum');
  });

  // covers: impressum > Return to the main page from the Impressum page > Back control returns to the main page
  test('the breadcrumb on the Impressum page navigates to the main page', async ({ page }) => {
    await page.goto('/impressum');
    const breadcrumbLink = page.locator('.breadcrumb-link');
    await expect(breadcrumbLink).toBeVisible();

    await breadcrumbLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.page-title')).toHaveText('Search');
  });
});
