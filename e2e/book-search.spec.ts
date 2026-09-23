import { test, expect } from '@playwright/test';
import { mockGoogleBooksSearch } from './support/mock-google-books';
import { mockGoogleAuth } from './support/mock-google-auth';

test.describe('book search', () => {
  test('the filter section is visible on load', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.search-input')).toBeVisible();
    await expect(page.locator('.search-button')).toBeVisible();
  });

  test('the search button is disabled for empty/whitespace input, enabled once text is entered', async ({
    page,
  }) => {
    await page.goto('/');
    const button = page.locator('.search-button');

    await expect(button).toBeDisabled();

    await page.locator('.search-input').fill('   ');
    await expect(button).toBeDisabled();

    await page.locator('.search-input').fill('Dune');
    await expect(button).toBeEnabled();
  });

  test('an ISBN-formatted query sends an isbn: prefixed request; non-ISBN text sends the raw text', async ({
    page,
  }) => {
    let capturedUrl = '';
    await page.route('**/books/v1/volumes**', async (route) => {
      capturedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalItems: 0 }),
      });
    });
    await page.goto('/');

    await page.locator('.search-input').fill('9783140225915');
    await page.locator('.search-button').click();
    await expect.poll(() => new URL(capturedUrl).searchParams.get('q')).toBe('isbn:9783140225915');

    await page.locator('.search-input').fill('Faust Goethe');
    await page.locator('.search-button').click();
    await expect.poll(() => new URL(capturedUrl).searchParams.get('q')).toBe('Faust Goethe');
  });

  test('shows a loading indicator and disables the button while a request is in flight', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: [{ title: 'Dune' }], delayMs: 500 });
    await page.goto('/');

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-loading')).toBeVisible();
    await expect(page.locator('.search-button')).toBeDisabled();
  });

  test('renders one card per result, omitting missing attributes with no placeholder', async ({ page }) => {
    await mockGoogleBooksSearch(page, {
      items: [
        { title: 'Dune', authors: ['Frank Herbert'], publisher: 'Ace', publishedDate: '1965' },
        { title: 'Untitled Draft' },
      ],
    });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    const cards = page.locator('.book-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText('Dune');
    await expect(cards.nth(0)).toContainText('Frank Herbert');
    await expect(cards.nth(1)).toContainText('Untitled Draft');
    await expect(cards.nth(1).locator('.book-attribute')).toHaveCount(1);
  });

  test('shows a cover image when present, no image element when absent', async ({ page }) => {
    await mockGoogleBooksSearch(page, {
      items: [
        { title: 'Dune', imageLinks: { thumbnail: 'http://example.com/dune.jpg' } },
        { title: 'No Cover' },
      ],
    });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    const cards = page.locator('.book-card');
    await expect(cards.nth(0).locator('.book-cover')).toBeVisible();
    await expect(cards.nth(1).locator('.book-cover')).toHaveCount(0);
  });

  test('shows the star rating and ratings count when present, nothing when absent', async ({ page }) => {
    await mockGoogleBooksSearch(page, {
      items: [
        { title: 'Dune', averageRating: 4.5, ratingsCount: 128 },
        { title: 'Unrated' },
      ],
    });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    const cards = page.locator('.book-card');
    const ratedRating = cards.nth(0).locator('.rating');
    await expect(ratedRating).toBeVisible();
    await expect(ratedRating.locator('.rating-star.filled')).toHaveCount(5);
    await expect(ratedRating.locator('.rating-count')).toHaveText('(128)');
    await expect(cards.nth(1).locator('.rating')).toHaveCount(0);
  });

  test('preserves the cover image\'s aspect ratio even next to a long description (regression: no stretch/crop)', async ({
    page,
  }) => {
    // A 2:3 portrait cover (40x60), as an inline SVG data URI so the test is fully offline
    // and the natural size is known exactly.
    const coverDataUri =
      'data:image/svg+xml,' +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><rect width="40" height="60" fill="blue"/></svg>');
    const longDescription = 'A very long description. '.repeat(40);

    await mockGoogleBooksSearch(page, {
      items: [{ title: 'Dune', description: longDescription, imageLinks: { thumbnail: coverDataUri } }],
    });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    const cover = page.locator('.book-cover');
    await expect(cover).toBeVisible();

    // The long description is truncated by default, so expand it to get a
    // genuinely tall .book-details sibling — the condition that previously
    // caused the flex row's default `align-items: stretch` to distort the image.
    await page.locator('.expand-button').click();

    const detailsHeight = await page.locator('.book-details').evaluate((el) => el.getBoundingClientRect().height);
    const coverBox = await cover.evaluate((el) => el.getBoundingClientRect());
    expect(detailsHeight).toBeGreaterThan(coverBox.height);

    const renderedRatio = coverBox.width / coverBox.height;
    const naturalRatio = 40 / 60;
    expect(renderedRatio).toBeCloseTo(naturalRatio, 1);
  });

  test('shows pagination controls only when there are more than 10 results, and Next/Previous work', async ({
    page,
  }) => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({ title: `Book ${i + 1}` }));
    await mockGoogleBooksSearch(page, { items: manyItems, totalItems: 11 });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    const pagination = page.locator('.pagination');
    await expect(pagination).toBeVisible();
    await expect(page.locator('.pagination-page')).toHaveText('Page 1 of 2');
    await expect(page.locator('.pagination-button').nth(0)).toBeDisabled();
    await expect(page.locator('.pagination-button').nth(1)).toBeEnabled();

    await mockGoogleBooksSearch(page, { items: [{ title: 'Book 11' }], totalItems: 11 });
    await page.locator('.pagination-button').nth(1).click();
    await expect(page.locator('.pagination-page')).toHaveText('Page 2 of 2');
    await expect(page.locator('.pagination-button').nth(0)).toBeEnabled();
    await expect(page.locator('.pagination-button').nth(1)).toBeDisabled();
  });

  test('shows no pagination controls when 10 or fewer results match', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: [{ title: 'Dune' }], totalItems: 1 });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    await expect(page.locator('.book-card')).toHaveCount(1);
    await expect(page.locator('.pagination')).toHaveCount(0);
  });

  test('shows "Book not found" with no attribute data when no volumes match', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: [] });
    await page.goto('/');
    await page.locator('.search-input').fill('zzzzz');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-not-found')).toHaveText('Book not found');
    await expect(page.locator('.book-card')).toHaveCount(0);
  });

  test('shows a visible error message when the request fails', async ({ page }) => {
    await mockGoogleBooksSearch(page, 'error');
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-error')).toBeVisible();
  });

  test('the "Add to cart" button is absent when signed out and present when signed in', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: [{ title: 'Dune' }] });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();
    await expect(page.locator('.book-card')).toHaveCount(1);
    await expect(page.locator('.add-to-cart-button')).toHaveCount(0);

    await mockGoogleAuth(page, 'success');
    await page.goto('/');
    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();
    await expect(page.locator('.add-to-cart-button')).toBeVisible();
  });
});
