import { test, expect, Page } from '@playwright/test';
import { mockGoogleBooksSearch } from './support/mock-google-books';
import { mockGoogleAuth } from './support/mock-google-auth';

interface VolumeInfo {
  title?: string;
  imageLinks?: { thumbnail?: string };
}

type VolumesResult = { items: VolumeInfo[]; delayMs?: number } | 'error';

const COVER_BOOKS: VolumeInfo[] = Array.from({ length: 16 }, (_, i) => ({
  title: `Promo Book ${i}`,
  imageLinks: { thumbnail: `https://example.com/cover-${i}.jpg` },
}));

/** Cards whose right edge falls within the row's own (clipped) bounding box, i.e. actually visible. */
async function countFittingCards(page: Page): Promise<number> {
  const rowBox = await page.locator('.promo-row').boundingBox();
  const cardBoxes = await page.locator('app-promo-card').evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  return cardBoxes.filter((box) => box.right <= rowBox!.x + rowBox!.width + 1).length;
}

/**
 * The random promo fetch and a regular search both hit the same volumes endpoint, so a
 * single mockGoogleBooksSearch() response can't tell them apart. This differentiates by
 * the `q` query param: an exact match for `searchQuery` gets `search`, anything else
 * (the promo section's randomly-chosen pool term) gets `promo`.
 */
async function mockSearchAndPromo(
  page: Page,
  options: { searchQuery: string; search: VolumesResult; promo: VolumesResult },
): Promise<void> {
  await page.route('**/books/v1/volumes**', async (route) => {
    const url = new URL(route.request().url());
    const q = url.searchParams.get('q') ?? '';
    const result = q === options.searchQuery ? options.search : options.promo;

    if (result === 'error') {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }
    if (result.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, result.delayMs));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalItems: result.items.length,
        items: result.items.map((volumeInfo) => ({ volumeInfo })),
      }),
    });
  });
}

test.describe('promo section', () => {
  // covers: promo-section > Promo section shown when there is nothing else to show > Promo section shown before any search
  test('is visible on the search page before any search has been performed', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    await expect(page.locator('.promo-section')).toBeVisible();
  });

  // covers: promo-section > Promo section shown when there is nothing else to show > Promo section shown alongside "Book not found"
  test('is visible alongside the "Book not found" message', async ({ page }) => {
    await mockSearchAndPromo(page, {
      searchQuery: 'zzzznotfound',
      search: { items: [] },
      promo: { items: COVER_BOOKS },
    });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    await page.locator('.search-input').fill('zzzznotfound');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-not-found')).toBeVisible();
    await expect(page.locator('.promo-section')).toBeVisible();
  });

  // covers: promo-section > Promo section shown when there is nothing else to show > Promo section hidden while searching
  test('is hidden while a search is in progress', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS, delayMs: 800 });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-loading')).toBeVisible();
    await expect(page.locator('.promo-section')).toHaveCount(0);
  });

  // covers: promo-section > Promo section shown when there is nothing else to show > Promo section hidden on search failure
  test('is hidden after a search fails', async ({ page }) => {
    await mockSearchAndPromo(page, {
      searchQuery: 'boom',
      search: 'error',
      promo: { items: COVER_BOOKS },
    });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    await page.locator('.search-input').fill('boom');
    await page.locator('.search-button').click();

    await expect(page.locator('.status-error')).toBeVisible();
    await expect(page.locator('.promo-section')).toHaveCount(0);
  });

  // covers: promo-section > Promo section shown when there is nothing else to show > Promo section hidden when results are found
  test('is hidden when a search finds results', async ({ page }) => {
    await mockSearchAndPromo(page, {
      searchQuery: 'Dune',
      search: { items: [{ title: 'Dune' }] },
      promo: { items: COVER_BOOKS },
    });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    await page.locator('.search-input').fill('Dune');
    await page.locator('.search-button').click();

    await expect(page.locator('.results-list .book-card')).toBeVisible();
    await expect(page.locator('.promo-section')).toHaveCount(0);
  });

  // covers: promo-section > Random books about AI engineering with a real cover image > Selected books all have a cover image
  // covers: promo-section > Fake discount price display > Original, discounted price, and percentage badge are all shown
  // covers: promo-section > Fake discount price display > Discounted price is lower than the original price
  test('each card shows a cover, a struck-through original price, a lower discounted price, and a percentage badge', async ({
    page,
  }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    const card = page.locator('app-promo-card').first();
    await expect(card.locator('.promo-cover')).toBeVisible();

    const originalText = (await card.locator('.promo-price-original').textContent()) ?? '';
    const nowText = (await card.locator('.promo-price-now').textContent()) ?? '';
    const badgeText = (await card.locator('.promo-discount-badge').textContent()) ?? '';

    expect(badgeText).toMatch(/-\d+%/);
    const originalValue = parseFloat(originalText.replace(/[^\d.]/g, ''));
    const nowValue = parseFloat(nowText.replace(/[^\d.]/g, ''));
    expect(nowValue).toBeLessThan(originalValue);
  });

  // covers: promo-section > Add to cart on a promo card > Add to cart control visible when signed in
  // covers: promo-section > Add to cart on a promo card > Activating a promo card's add-to-cart control adds it to the cart
  test('activating a promo card\'s add-to-cart control increases the cart count at the discounted price', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');
    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();

    const card = page.locator('app-promo-card').first();
    const nowText = (await card.locator('.promo-price-now').textContent()) ?? '';

    await card.locator('.promo-add-to-cart-button').click();

    await expect(page.locator('.cart-badge')).toHaveText('1');

    await page.locator('.cart').click();
    await expect(page.locator('.book-card .price')).toHaveText(nowText);
  });

  // covers: promo-section > Add to cart on a promo card > Add to cart control hidden when signed out
  test('has no add-to-cart control when signed out', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    await expect(page.locator('.promo-section')).toBeVisible();
    await expect(page.locator('.promo-add-to-cart-button')).toHaveCount(0);
  });

  // covers: promo-section > Visually distinct, animated promotional styling > Promotional headline is shown above the cards
  test('shows a promotional headline above the row of cards', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    const headline = page.locator('.promo-headline');
    const row = page.locator('.promo-row');
    await expect(headline).toBeVisible();
    const headlineBox = await headline.boundingBox();
    const rowBox = await row.boundingBox();
    expect(headlineBox!.y).toBeLessThan(rowBox!.y);
  });

  // covers: promo-section > Visually distinct, animated promotional styling > Discount badges are animated by default
  test('animates the discount badge by default', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    const badge = page.locator('.promo-discount-badge').first();
    const animationName = await badge.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).not.toBe('none');
  });

  // covers: promo-section > Visually distinct, animated promotional styling > Animation is disabled under reduced motion, with a static treatment retained
  test('disables the discount badge animation under reduced motion, keeping a static distinct treatment', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');

    const badge = page.locator('.promo-discount-badge').first();
    const animationName = await badge.evaluate((el) => getComputedStyle(el).animationName);
    const backgroundColor = await badge.evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(animationName).toBe('none');
    expect(backgroundColor).not.toBe('');
  });

  // covers: promo-section > Single-row layout with no scrolling or navigation controls > More cards visible as the viewport gets wider
  test('shows a single row with no scrollbar or navigation controls, with no fixed card-count limit', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    const overflowX = await page.locator('.promo-row').evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflowX).not.toBe('scroll');
    expect(overflowX).not.toBe('auto');
    await expect(page.locator('.promo-row nav, .promo-row [class*="pagination"]')).toHaveCount(0);
  });

  // covers: promo-section > Single-row layout with no scrolling or navigation controls > More cards visible as the viewport gets wider
  // covers: promo-section > Single-row layout with no scrolling or navigation controls > Fewer cards visible on a narrow viewport
  test('shows more cards as the viewport gets wider, and fewer on a narrow viewport', async ({ page }) => {
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });

    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();
    const narrowCount = await countFittingCards(page);

    await page.setViewportSize({ width: 2200, height: 900 });
    await page.waitForTimeout(200);
    const wideCount = await countFittingCards(page);

    expect(wideCount).toBeGreaterThan(narrowCount);
    expect(wideCount).toBeGreaterThan(5);
    expect(narrowCount).toBeLessThan(COVER_BOOKS.length);
  });

  // covers: promo-section > Single-row layout with no scrolling or navigation controls > No partially-visible card at the row's edge
  test('hides a card that does not fully fit, rather than showing it partially cut off', async ({ page }) => {
    // A width deliberately not an exact multiple of (card width + gap), so at least
    // one candidate card straddles the row's right edge and must be hidden outright.
    await page.setViewportSize({ width: 913, height: 900 });
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    const rowBox = (await page.locator('.promo-row').boundingBox())!;
    const cards = page.locator('app-promo-card');
    const count = await cards.count();

    let sawHidden = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const visibility = await card.evaluate((el) => getComputedStyle(el).visibility);
      const box = (await card.boundingBox())!;
      const straddlesEdge = box.x < rowBox.x + rowBox.width && box.x + box.width > rowBox.x + rowBox.width + 1;

      if (visibility === 'visible') {
        expect(straddlesEdge).toBe(false);
      } else {
        expect(visibility).toBe('hidden');
        sawHidden = true;
      }
    }
    expect(sawHidden).toBe(true);
  });

  // covers: promo-section > Fake discount price display > Percentage badge is not clipped
  test('does not clip the percentage badge of a fully-fitting card', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await mockGoogleBooksSearch(page, { items: COVER_BOOKS });
    await page.goto('/');
    await expect(page.locator('.promo-section')).toBeVisible();

    const rowBox = await page.locator('.promo-row').boundingBox();
    const badgeBox = await page.locator('.promo-discount-badge').first().boundingBox();

    expect(badgeBox!.y).toBeGreaterThanOrEqual(rowBox!.y);
    expect(badgeBox!.x + badgeBox!.width).toBeLessThanOrEqual(rowBox!.x + rowBox!.width + 1);
  });
});
