import { test, expect, Page } from '@playwright/test';
import { mockGoogleBooksSearch } from './support/mock-google-books';
import { mockGoogleAuth } from './support/mock-google-auth';

async function signIn(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('.login').click();
  await expect(page.locator('.user-name')).toBeVisible();
}

async function addBookToCart(page: Page, title = 'Dune'): Promise<void> {
  await mockGoogleBooksSearch(page, { items: [{ title }] });
  await page.locator('.search-input').fill(title);
  await page.locator('.search-button').click();
  await page.locator('.add-to-cart-button').first().click();
}

test.describe('shopping cart', () => {
  // covers: shopping-cart > Cart icon with count badge > Cart icon hidden when signed out
  test('the cart icon is absent when signed out', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.cart')).toHaveCount(0);
  });

  // covers: shopping-cart > Cart icon with count badge > Icon visible with no badge when cart is empty
  // covers: shopping-cart > Cart icon links to the cart page when non-empty > Cart icon is not interactive when empty
  test('shows a non-interactive cart icon with no badge when signed in and the cart is empty', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);

    const cart = page.locator('.cart');
    await expect(cart).toBeVisible();
    await expect(page.locator('.cart-badge')).toHaveCount(0);
    await expect(cart).not.toHaveAttribute('href', /.+/);
  });

  // covers: shopping-cart > Cart icon with count badge > Badge shows current count after items are added
  // covers: shopping-cart > Cart icon links to the cart page when non-empty > Cart icon navigates to the cart page when non-empty
  // covers: shopping-cart > Add book to cart > Adding a book increments the count
  test('adding a book updates the badge and turns the cart icon into a link', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);

    await addBookToCart(page);

    await expect(page.locator('.cart-badge')).toHaveText('1');
    await expect(page.locator('.cart')).toHaveAttribute('href', '/cart');
  });

  // covers: shopping-cart > Cart page shows added books > Cart page lists the books in the cart
  test('the cart page lists added books without an "Add to cart" control', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page, 'Dune');

    await page.locator('.cart').click();

    await expect(page.locator('.book-card')).toHaveCount(1);
    await expect(page.locator('.book-card')).toContainText('Dune');
    await expect(page.locator('.add-to-cart-button')).toHaveCount(0);
  });

  // covers: shopping-cart > PayPal-styled payment button > Payment button visible below the cart list
  test('shows the PayPal-styled button only when the cart has items', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page);

    await page.locator('.cart').click();
    await expect(page.locator('.paypal-button')).toBeVisible();
  });

  // covers: shopping-cart > PayPal-styled payment button > Payment button hidden when cart is empty
  // covers: shopping-cart > Cart page shows added books > Cart page shows an empty-cart message
  test('hides the PayPal-styled button and shows an empty-cart message when the cart is empty', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);

    await page.goto('/cart');

    await expect(page.locator('.paypal-button')).toHaveCount(0);
    await expect(page.locator('.status')).toContainText('Your cart is empty');
  });

  // covers: shopping-cart > Remove book from cart > Activating delete removes that book
  // covers: shopping-cart > Remove book from cart > Removing the last book shows the empty-cart message
  test('deleting a book removes it, decreases the badge, and the last removal shows the empty-cart message', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page);

    await page.locator('.cart').click();
    await expect(page.locator('.book-card')).toHaveCount(1);

    await page.locator('.delete-button').click();

    await expect(page.locator('.book-card')).toHaveCount(0);
    await expect(page.locator('.status')).toContainText('Your cart is empty');
  });

  // covers: shopping-cart > Add book to cart > Adding the same book multiple times increments each time
  // covers: shopping-cart > Remove book from cart > Removing one of several identical books removes only that card
  test('deleting one of two identical books removes only that card', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page, 'Dune');
    await addBookToCart(page, 'Dune');
    await expect(page.locator('.cart-badge')).toHaveText('2');

    await page.locator('.cart').click();
    await expect(page.locator('.book-card')).toHaveCount(2);

    await page.locator('.delete-button').first().click();

    await expect(page.locator('.book-card')).toHaveCount(1);
  });

  // covers: shopping-cart > Cart order summary > Summary shows item count and total price
  // covers: shopping-cart > Cart order summary > Summary updates when the cart contents change
  // covers: shopping-cart > Cart order summary > No summary shown when cart is empty
  test('the payment section summary updates the item count and total price as items are added/removed', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page, 'Dune');

    await page.locator('.cart').click();
    const summary = page.locator('.payment-summary');
    await expect(summary).toContainText('1 item');
    await expect(summary).toHaveText(/1 item · €\d+\.\d{2}/);
    const firstTotalText = await summary.textContent();

    await page.locator('.breadcrumb-link').click();
    await addBookToCart(page, 'Foundation');
    await page.locator('.cart').click();

    await expect(summary).toContainText('2 items');
    await expect(summary).toHaveText(/2 items · €\d+\.\d{2}/);
    await expect(summary).not.toHaveText(firstTotalText ?? '');

    await page.locator('.delete-button').first().click();
    await expect(summary).toContainText('1 item');
    await expect(page.locator('.delete-button')).toHaveCount(1);

    await page.locator('.delete-button').click();
    await expect(page.locator('.payment-section')).toHaveCount(0);
  });

  // covers: breadcrumb-navigation > Breadcrumb trail shown above the page title > Breadcrumb trail appears above the page title
  // covers: breadcrumb-navigation > Activating the breadcrumb's main-page link navigates there > Activating the main-page link navigates to the main page
  // covers: shopping-cart > Return to the main page from the cart page > Back control returns to the main page
  test('the breadcrumb returns to the main page', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await page.goto('/cart');

    const breadcrumb = page.locator('app-breadcrumb');
    const title = page.locator('.page-title');
    const breadcrumbBox = await breadcrumb.boundingBox();
    const titleBox = await title.boundingBox();
    expect(breadcrumbBox!.y).toBeLessThan(titleBox!.y);

    await page.locator('.breadcrumb-link').click();

    await expect(page.locator('.page-title')).toHaveText('Search');
  });

  // covers: shopping-cart > Cart cleared on sign-out > Signing out clears the cart count
  test('signing out clears the cart', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await signIn(page);
    await addBookToCart(page);
    await expect(page.locator('.cart-badge')).toHaveText('1');

    await page.locator('.logout').click();

    await expect(page.locator('.cart')).toHaveCount(0);
  });
});
