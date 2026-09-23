import { test, expect } from '@playwright/test';
import { mockGoogleAuth } from './support/mock-google-auth';

test.describe('google login', () => {
  test('the login icon is visible on the right side of the header when signed out', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.logout')).toHaveCount(0);
  });

  test('a successful sign-in shows the user\'s name and hides the login icon', async ({ page }) => {
    await mockGoogleAuth(page, 'success', 'Ada Lovelace');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.user-name')).toHaveText('Ada Lovelace');
    await expect(page.locator('.login')).toHaveCount(0);
  });

  test('a cancelled sign-in leaves the header signed out', async ({ page }) => {
    await mockGoogleAuth(page, 'cancelled');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.user-name')).toHaveCount(0);
  });

  test('a failed sign-in leaves the header signed out', async ({ page }) => {
    await mockGoogleAuth(page, 'failed');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.user-name')).toHaveCount(0);
  });

  test('a sign-out control is visible only when signed in, and returns the header to signed-out', async ({
    page,
  }) => {
    await mockGoogleAuth(page, 'success');
    await page.goto('/');
    await expect(page.locator('.logout')).toHaveCount(0);

    await page.locator('.login').click();
    await expect(page.locator('.logout')).toBeVisible();

    await page.locator('.logout').click();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.logout')).toHaveCount(0);
    await expect(page.locator('.user-name')).toHaveCount(0);
  });

  test('reloading the page after signing in returns to the signed-out state', async ({ page }) => {
    await mockGoogleAuth(page, 'success');
    await page.goto('/');
    await page.locator('.login').click();
    await expect(page.locator('.user-name')).toBeVisible();

    await page.reload();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.user-name')).toHaveCount(0);
  });
});
