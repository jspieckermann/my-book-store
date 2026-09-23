## 1. HTTP client setup

- [x] 1.1 Add `provideHttpClient()` to `src/app/app.config.ts`'s providers array — verify `ng build` succeeds and `HttpClient` can be injected without a runtime provider error

## 2. Google Books service

- [x] 2.1 Create a `GoogleBooksService` (e.g. `src/app/isbn-search/google-books.service.ts`) with a method that calls `GET https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}` via `HttpClient` and returns an observable — verify the method builds the correct URL for a given ISBN string (unit test or manual inspection)
- [x] 2.2 Ensure the service does not expose or retain parsed response body content beyond what's needed to signal success/failure to the caller — verify by inspecting the service's public API surface contains no result-data-shaped return type

## 3. Filter section component

- [x] 3.1 Generate a standalone `IsbnSearch` component at `src/app/isbn-search/` (e.g. `isbn-search.ts`, `isbn-search.html`, `isbn-search.css`) — verify the files exist and `ng build` still succeeds with the component unreferenced
- [x] 3.2 Add a freetext ISBN input and a search button to the component template — verify by inspecting the rendered DOM contains an `<input>` and a `<button>`
- [x] 3.3 Wire the search button (and Enter-key submission on the input) to call `GoogleBooksService` with the trimmed input value — verify by triggering both the button click and Enter keypress and confirming the service method is called with the entered ISBN in each case
- [x] 3.4 Disable the search button when the input is empty/whitespace-only, and while a request is in flight — verify by checking the button's disabled state in each of: empty input, non-empty input, and during an in-flight request

## 4. Request status feedback

- [x] 4.1 Add a `status: 'idle' | 'loading' | 'error'` state to the component, set to `'loading'` when a search starts and `'idle'` on success — verify by inspecting the state transitions across a full request lifecycle (start → success, and start → error)
- [x] 4.2 Render a loading indicator when `status` is `'loading'`, and a visible error message near the filter section when `status` is `'error'` — verify by inspecting the rendered DOM shows the loading indicator during an in-flight request and an error message after a simulated failed request
- [x] 4.3 Confirm no book title, author, cover, or other response data is rendered anywhere on a successful search — verify by inspecting the component's template and state for the absence of any result-data bindings

## 5. Styling: responsive layout and theme consistency

- [x] 5.1 Style the filter section (container, input, button, loading indicator, error message) using `theming` tokens only (e.g. `--color-surface`/`--color-background`, `--color-text`, `--color-accent`, `--color-error`, `--font-sans`, `--text-*`) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors in the component's own CSS
- [x] 5.2 Implement fluid responsive sizing/layout (e.g. `clamp()` for padding, flex-wrap for input+button on narrow widths) so the filter section does not overflow, clip, or cause horizontal scroll — verify by resizing the browser viewport from 320px to 1920px wide with no horizontal scrollbar appearing and no visual clipping of the input or button

## 6. Wire into app shell

- [x] 6.1 Register the `IsbnSearch` component in `src/app/app.ts` and reference it in `src/app/app.html` between `<app-header />` and `<router-outlet />` — verify `ng build` succeeds and the filter section renders on app load

## 7. Verification

- [x] 7.1 Run `npm run build` and confirm it completes without errors
- [x] 7.2 Run `npm test` and confirm existing tests still pass
- [x] 7.3 Manually load the app in a browser, enter a real ISBN (e.g. `9780143127550`), and confirm: the search button is disabled until input is non-empty, clicking search shows a loading indicator, and the request completes without any book data being rendered — verify a network request to `googleapis.com/books/v1/volumes` was made (e.g. via browser devtools network tab)
- [x] 7.4 Manually trigger an error case (e.g. disconnect network or use an invalid endpoint temporarily) and confirm the error message renders near the filter section
- [x] 7.5 Manually load the app at mobile (~375px), tablet (~768px), and desktop (~1440px) widths and confirm the filter section renders correctly (input + button usable, no overflow) at each width
