import { Page } from '@playwright/test';

interface VolumeInfo {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  averageRating?: number;
  ratingsCount?: number;
}

export interface MockBooksSuccess {
  items: VolumeInfo[];
  totalItems?: number;
  /** Optional artificial delay (ms) before responding, to make a loading state observable. */
  delayMs?: number;
}

/**
 * Intercepts the Google Books `volumes` API and responds with either a controlled
 * success payload or a 500 error, so book-search tests are deterministic and don't
 * depend on the live API. See design.md's "mock-google-books.ts" decision.
 */
export async function mockGoogleBooksSearch(page: Page, response: MockBooksSuccess | 'error'): Promise<void> {
  await page.route('**/books/v1/volumes**', async (route) => {
    if (response === 'error') {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }

    if (response.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, response.delayMs));
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalItems: response.totalItems ?? response.items.length,
        items: response.items.map((volumeInfo) => ({ volumeInfo })),
      }),
    });
  });
}
