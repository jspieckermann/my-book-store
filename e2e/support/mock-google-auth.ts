// These tests require `src/environments/environment.ts`'s `googleOAuthClientId` to be a
// non-empty placeholder string (any value works). `GoogleAuth.login()` no-ops when it's
// empty, before ever reaching the mocked `window.google` below — see design.md's Risks.
// The value is never actually sent to or validated by Google since `window.google` is
// fully stubbed and the real Google Identity Services script is blocked from loading.

import { Page } from '@playwright/test';

export type GoogleAuthOutcome = 'success' | 'cancelled' | 'failed';

/**
 * Mocks both points where GoogleAuth leaves the browser for Google:
 * 1. `window.google.accounts.oauth2` (stubbed via an init script; the real GIS script
 *    is blocked from loading so it can never overwrite the stub).
 * 2. The real `userinfo` HTTP call GoogleAuth's own code makes after a successful
 *    token grant (intercepted via page.route()).
 *
 * The app's own GoogleAuth/HttpClient code runs unmodified — see design.md.
 */
export async function mockGoogleAuth(
  page: Page,
  outcome: GoogleAuthOutcome,
  name = 'E2E Test User',
): Promise<void> {
  // Prevent the real Google Identity Services script from loading and overwriting the stub.
  await page.route('https://accounts.google.com/gsi/client**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });

  await page.addInitScript((outcome) => {
    (window as unknown as { google: unknown }).google = {
      accounts: {
        oauth2: {
          initTokenClient: (config: { callback: (response: { access_token?: string }) => void }) => ({
            requestAccessToken: () => {
              if (outcome === 'cancelled') {
                return;
              }
              if (outcome === 'failed') {
                config.callback({});
                return;
              }
              config.callback({ access_token: 'e2e-fake-access-token' });
            },
          }),
        },
      },
    };
  }, outcome);

  await page.route('**/oauth2/v3/userinfo**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ name }) });
  });
}
