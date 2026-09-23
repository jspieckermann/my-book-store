import { test, expect, Page } from '@playwright/test';
import { mockGoogleAuth } from './support/mock-google-auth';

interface VolumeInfo {
  title: string;
  authors: string[];
}

async function mockGoogleBooksWithRecommendations(
  page: Page,
  searchItem: VolumeInfo,
  recommendationItems: VolumeInfo[],
): Promise<void> {
  await page.route('**/books/v1/volumes**', async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q') ?? '';
    const items = q.startsWith('inauthor:') ? recommendationItems : [searchItem];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalItems: items.length, items: items.map((volumeInfo) => ({ volumeInfo })) }),
    });
  });
}

async function signInAndAddToCart(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('.login').click();
  await expect(page.locator('.user-name')).toBeVisible();
  await page.locator('.search-input').fill('Dune');
  await page.locator('.search-button').click();
  await page.locator('.add-to-cart-button').first().click();
}

/**
 * Mocks each `inauthor:"<author>"` query independently, and each general (non-author) search
 * query independently, keyed by exact `q` value — for tests exercising more than one author,
 * where a single shared response (as `mockGoogleBooksWithRecommendations` returns) can't
 * distinguish which author a request is for.
 */
async function mockGoogleBooksByExactQuery(page: Page, responses: Record<string, VolumeInfo[]>): Promise<void> {
  await page.route('**/books/v1/volumes**', async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q') ?? '';
    const items = responses[q] ?? [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalItems: items.length, items: items.map((volumeInfo) => ({ volumeInfo })) }),
    });
  });
}

test.describe('book recommendations', () => {
  test('the section is absent on an empty cart', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.locator('.book-recommendations')).toHaveCount(0);
  });

  test('the section appears with recommended books after adding a book to the cart', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksWithRecommendations(
      page,
      { title: 'Dune', authors: ['Frank Herbert'] },
      [{ title: 'Dune Messiah', authors: ['Frank Herbert'] }],
    );
    await signInAndAddToCart(page);

    await page.locator('.cart').click();

    await expect(page.locator('.book-recommendations')).toBeVisible();
    await expect(page.locator('.book-recommendations')).toContainText('Dune Messiah');
  });

  test("activating a recommendation's add-to-cart control increases the cart count", async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksWithRecommendations(
      page,
      { title: 'Dune', authors: ['Frank Herbert'] },
      [{ title: 'Dune Messiah', authors: ['Frank Herbert'] }],
    );
    await signInAndAddToCart(page);
    await page.locator('.cart').click();
    await expect(page.locator('.book-recommendations')).toBeVisible();

    await page.locator('.book-recommendations .add-to-cart-button').first().click();

    await expect(page.locator('.payment-summary')).toContainText('2 items');
  });

  test('Previous/Next controls page through recommendations and disable correctly at the ends', async ({ page }) => {
    const recommendationItems = Array.from({ length: 6 }, (_, i) => ({
      title: `Recommendation ${i + 1}`,
      authors: ['Frank Herbert'],
    }));
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksWithRecommendations(page, { title: 'Dune', authors: ['Frank Herbert'] }, recommendationItems);
    await signInAndAddToCart(page);
    await page.locator('.cart').click();

    const section = page.locator('.book-recommendations');
    await expect(section).toBeVisible();
    await expect(section.locator('app-recommendation-card')).toHaveCount(3);
    const [previousButton, nextButton] = await section.locator('.pagination-arrow').all();
    await expect(previousButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    await nextButton.click();

    await expect(section.locator('app-recommendation-card')).toHaveCount(3);
    await expect(previousButton).toBeEnabled();
    await expect(nextButton).toBeDisabled();

    await previousButton.click();

    await expect(section.locator('app-recommendation-card')).toHaveCount(3);
    await expect(previousButton).toBeDisabled();
  });

  test('shows recommendations from every author when the cart has books by two different authors', async ({ page }) => {
    // Regression test: Google Books does not support OR-combining `inauthor:` clauses in a
    // single query (see design.md), so a cart with two distinct authors previously produced
    // an empty/irrelevant recommendations result. searchByAuthors now issues one request per
    // author and merges the results, which this test verifies end to end.
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksByExactQuery(page, {
      Dune: [{ title: 'Dune', authors: ['Frank Herbert'] }],
      Foundation: [{ title: 'Foundation', authors: ['Isaac Asimov'] }],
      'inauthor:"Frank Herbert"': [{ title: 'Dune Messiah', authors: ['Frank Herbert'] }],
      'inauthor:"Isaac Asimov"': [{ title: 'Second Foundation', authors: ['Isaac Asimov'] }],
    });

    await page.goto('/');
    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();
    await page.locator('.add-to-cart-button').first().click();
    await page.locator('.search-input').fill('Foundation');
    await page.locator('.search-button').click();
    await page.locator('.add-to-cart-button').first().click();

    await page.locator('.cart').click();

    const section = page.locator('.book-recommendations');
    await expect(section).toBeVisible();
    await expect(section).toContainText('Dune Messiah');
    await expect(section).toContainText('Second Foundation');
  });
});
