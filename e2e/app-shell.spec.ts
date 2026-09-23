import { test, expect } from '@playwright/test';

test.describe('app shell (header, footer, theming, page titles)', () => {
  test('header renders the book logo and title on load', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('.title')).toHaveText('My-Book-Store');
  });

  test('the header logo and title are a single link that navigates to the main page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('.page-title')).toHaveText('Your Cart');

    const brand = page.locator('.brand');
    await expect(brand).toHaveAttribute('href', '/');
    await expect(brand.locator('.logo')).toBeVisible();
    await expect(brand.locator('.title')).toHaveText('My-Book-Store');

    await brand.click();

    await expect(page.locator('.page-title')).toHaveText('Search');
  });

  test('footer renders "v1.0" and is not sticky/fixed', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('.footer');
    await expect(footer).toContainText('v1.0');
    const position = await footer.evaluate((el) => getComputedStyle(el).position);
    expect(['fixed', 'sticky']).not.toContain(position);
  });

  test('page loads in a dark theme with no theme-toggle control', async ({ page }) => {
    await page.goto('/');

    const backgroundColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    await expect(page.locator('[aria-label*="theme" i]')).toHaveCount(0);
  });

  test('shows the "Search" page title on the main page and "Your Cart" on the cart page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.page-title')).toHaveText('Search');

    await page.goto('/cart');
    await expect(page.locator('.page-title')).toHaveText('Your Cart');
  });

  test('remains fully visible with no horizontal scroll at a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.filter-form')).toBeVisible();

    const [scrollWidth, clientWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('shows visible hover and press feedback on an interactive control', async ({ page }) => {
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    const button = page.locator('.search-button');

    const restingFilter = await button.evaluate((el) => getComputedStyle(el).filter);

    await button.hover();
    const hoverFilter = await button.evaluate((el) => getComputedStyle(el).filter);
    expect(hoverFilter).not.toBe(restingFilter);

    const box = (await button.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const activeFilter = await button.evaluate((el) => getComputedStyle(el).filter);
    const activeTransform = await button.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.up();

    expect(activeFilter).not.toBe(hoverFilter);
    expect(activeTransform).not.toBe('none');
  });

  test('respects reduced motion: no transform on press, but still shows a filter change', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('.search-input').fill('Dune');
    const button = page.locator('.search-button');

    const restingFilter = await button.evaluate((el) => getComputedStyle(el).filter);

    const box = (await button.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const activeFilter = await button.evaluate((el) => getComputedStyle(el).filter);
    const activeTransform = await button.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.up();

    expect(activeTransform).toBe('none');
    expect(activeFilter).not.toBe(restingFilter);
  });
});
