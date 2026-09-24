import { test, expect } from '@playwright/test';
import { mockGoogleAuth } from './support/mock-google-auth';

test.describe('google login', () => {
  // covers: google-login > Login icon in header > Icon visible when signed out
  // covers: google-login > Sign-out control > No sign-out control when signed out
  test('the login icon is visible on the right side of the header when signed out', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.logout')).toHaveCount(0);
  });

  // covers: google-login > Signed-in user's name shown in header > Name shown after successful sign-in
  // covers: google-login > Signed-in user's name shown in header > Login icon no longer shown once signed in
  test('a successful sign-in shows the user\'s name and hides the login icon', async ({ page }) => {
    await mockGoogleAuth(page, 'success', 'Ada Lovelace');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.user-name')).toHaveText('Ada Lovelace');
    await expect(page.locator('.login')).toHaveCount(0);
  });

  // covers: google-login > Cancelled or failed sign-in leaves the header signed out > Cancelled sign-in keeps the icon shown
  test('a cancelled sign-in leaves the header signed out', async ({ page }) => {
    await mockGoogleAuth(page, 'cancelled');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.user-name')).toHaveCount(0);
  });

  // covers: google-login > Cancelled or failed sign-in leaves the header signed out > Failed sign-in keeps the icon shown
  test('a failed sign-in leaves the header signed out', async ({ page }) => {
    await mockGoogleAuth(page, 'failed');
    await page.goto('/');

    await page.locator('.login').click();

    await expect(page.locator('.login')).toBeVisible();
    await expect(page.locator('.user-name')).toHaveCount(0);
  });

  // covers: google-login > Sign-out control > Sign-out control visible when signed in
  // covers: google-login > Sign-out control > Activating sign-out returns to the signed-out state
  // covers: google-login > Sign-out control > No sign-out control when signed out
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

  // covers: google-login > No session persistence in this stage > Reloading the page returns to the signed-out state
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
