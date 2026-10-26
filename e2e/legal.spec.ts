import { test, expect, Page } from '@playwright/test';

async function selectLanguage(page: Page, code: 'EN' | 'DE'): Promise<void> {
  await page.locator('.language-switcher-toggle').click();
  await page.locator('.language-switcher-option', { hasText: code }).click();
}

test.describe('legal', () => {
  // covers: app-footer > Footer content > Footer link navigates to the Legal page
  test('the footer Legal link is visible on the main page and the cart page, and navigates to /legal', async ({
    page,
  }) => {
    await page.goto('/');
    const mainLink = page.locator('.legal-link');
    await expect(mainLink).toBeVisible();

    await page.goto('/cart');
    const cartLink = page.locator('.legal-link');
    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/\/legal$/);
  });

  // covers: legal > Legal page content > Legal page is reachable
  // covers: legal > Legal page content > Each dependency shows name, version, and license
  test('the Legal page lists a known production dependency with its version and license', async ({ page }) => {
    await page.goto('/legal');

    const row = page.locator('.legal-row', { hasText: '@angular/core' });
    await expect(row).toBeVisible();
    await expect(row.locator('.legal-version')).not.toHaveText('');
    await expect(row.locator('.legal-license')).not.toHaveText('');
  });

  // covers: legal > Legal content follows the selected UI language > Legal page heading and labels are shown in German
  // covers: legal > Legal content follows the selected UI language > Legal page heading and labels are shown in English
  // covers: legal > Legal content follows the selected UI language > Switching the language while viewing the Legal page updates its labels
  // covers: legal > Legal content follows the selected UI language > Dependency data is unaffected by the selected language
  test('switching the UI language translates the Legal page heading and labels, while a listed dependency stays unchanged', async ({
    page,
  }) => {
    await page.goto('/legal');
    await expect(page.locator('.page-title')).toHaveText('Legal');

    const firstRow = page.locator('.legal-row').first();
    const nameBefore = await firstRow.locator('.legal-name').textContent();
    const versionBefore = await firstRow.locator('.legal-version').textContent();
    const licenseBefore = await firstRow.locator('.legal-license').textContent();

    await selectLanguage(page, 'DE');

    await expect(page.locator('.page-title')).toHaveText('Rechtliches');
    await expect(firstRow.locator('.legal-name')).toHaveText(nameBefore ?? '');
    await expect(firstRow.locator('.legal-version')).toHaveText(versionBefore ?? '');
    await expect(firstRow.locator('.legal-license')).toHaveText(licenseBefore ?? '');
  });

  // covers: legal > Return to the main page from the Legal page > Back control returns to the main page
  test('the breadcrumb on the Legal page navigates back to the main page', async ({ page }) => {
    await page.goto('/legal');
    const breadcrumbLink = page.locator('.breadcrumb-link');
    await expect(breadcrumbLink).toBeVisible();

    await breadcrumbLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.page-title')).toHaveText('Search');
  });
});
