import { test, expect, Page } from '@playwright/test';
import { mockGoogleBooksSearch } from './support/mock-google-books';
import { mockGoogleAuth } from './support/mock-google-auth';

async function mockGoogleBooksSearchByLanguage(page: Page): Promise<void> {
  await page.route('**/books/v1/volumes**', async (route) => {
    const langRestrict = new URL(route.request().url()).searchParams.get('langRestrict');
    const volumeInfo =
      langRestrict === 'de'
        ? { title: 'Der Wüstenplanet', authors: ['Frank Herbert'] }
        : { title: 'Dune', authors: ['Frank Herbert'] };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalItems: 1, items: [{ volumeInfo }] }),
    });
  });
}

async function selectLanguage(page: Page, code: 'EN' | 'DE'): Promise<void> {
  await page.locator('.language-switcher-toggle').click();
  await page.locator('.language-switcher-option', { hasText: code }).click();
}

test.describe('language switcher', () => {
  // covers: localization > Language switcher control > Control visible when signed out
  // covers: localization > Language switcher control > Control visible when signed in
  test('the selector is visible signed out and signed in', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await page.goto('/');
    await expect(page.locator('.language-switcher')).toBeVisible();

    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();
    await expect(page.locator('.language-switcher')).toBeVisible();
  });

  // covers: localization > Language switcher control > Control lists both languages as flag + code
  // covers: localization > Default language > First visit defaults to English
  test('shows a flag + code option for each language, English selected by default, and closes on outside click', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.locator('.language-switcher-toggle');
    await expect(toggle).toContainText('EN');
    await expect(page.locator('.language-switcher-menu')).toBeHidden();

    await toggle.click();

    const options = page.locator('.language-switcher-option');
    await expect(options).toHaveCount(2);
    await expect(options.nth(0)).toHaveText('🇬🇧 EN');
    await expect(options.nth(1)).toHaveText('🇩🇪 DE');

    await page.locator('.page-title').click();

    await expect(page.locator('.language-switcher-menu')).toBeHidden();
  });

  // covers: localization > Switching the language > Selecting German switches the language
  // covers: localization > Switching the language > Selecting English switches back
  test('switching to German translates the header, search page, a result card, and the cart page, then switches back', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksSearch(page, { items: [{ title: 'Dune', authors: ['Frank Herbert'] }] });
    await page.goto('/');
    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();
    await page.locator('.add-to-cart-button').click();

    const toggle = page.locator('.language-switcher-toggle');
    await expect(toggle).toContainText('EN');

    await selectLanguage(page, 'DE');

    await expect(toggle).toContainText('DE');
    await expect(page.locator('.page-title')).toHaveText('Suche');
    await expect(page.locator('.search-button')).toHaveText('Suchen');
    await expect(page.locator('.book-attribute dt').first()).toHaveText('Titel');
    // Book data itself is not translated.
    await expect(page.locator('.book-card')).toContainText('Dune');
    await expect(page.locator('.book-card')).toContainText('Frank Herbert');

    await page.locator('.cart').click();
    await expect(page.locator('.page-title')).toHaveText('Ihr Warenkorb');
    await expect(page.locator('.breadcrumb-current')).toHaveText('Ihr Warenkorb');
    await expect(page.locator('.payment-summary')).toContainText('Artikel');

    await selectLanguage(page, 'EN');

    await expect(toggle).toContainText('EN');
    await expect(page.locator('.page-title')).toHaveText('Your Cart');
    await expect(page.locator('.breadcrumb-current')).toHaveText('Your Cart');
  });

  // covers: localization > Book search results reflect the selected language via the API, not machine translation > A search performed in German requests German-language results
  // covers: localization > Book search results reflect the selected language via the API, not machine translation > Changing the language while viewing results re-fetches them
  test('changing the language while results are displayed re-sends the request restricted to the new language and updates the displayed results', async ({
    page,
  }) => {
    await mockGoogleBooksSearchByLanguage(page);
    await page.goto('/');

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();
    await expect(page.locator('.book-card')).toContainText('Dune');

    await selectLanguage(page, 'DE');

    await expect(page.locator('.book-card')).toContainText('Der Wüstenplanet');

    await selectLanguage(page, 'EN');

    await expect(page.locator('.book-card')).toContainText('Dune');
  });

  // covers: localization > Language persists across reloads > Selected language survives a reload
  test('the selected language survives a page reload', async ({ page }) => {
    await page.goto('/');
    await selectLanguage(page, 'DE');
    await expect(page.locator('.page-title')).toHaveText('Suche');

    await page.reload();

    await expect(page.locator('.page-title')).toHaveText('Suche');
    await expect(page.locator('.language-switcher-toggle')).toContainText('DE');
  });
});
