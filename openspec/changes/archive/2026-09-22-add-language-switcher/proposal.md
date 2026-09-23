## Why

The app is English-only today. Adding German as a second language, switchable instantly from the header, makes the app usable for German-speaking users without a page reload or separate build.

## What Changes

- New `Language` service: an in-memory, signal-based current language (`en` default, `de`), persisted to `localStorage` so the choice survives a reload, with a small key-based EN/DE translation dictionary and a `translate(key, params?)` lookup (simple `{placeholder}` substitution for the handful of strings that embed a dynamic value — no ICU/i18n library).
- New header control: a `<select>` dropdown, always visible regardless of sign-in state, listing both languages as a flag emoji + language code (🇬🇧 EN, 🇩🇪 DE). Choosing an option switches the application's language immediately and updates `<html lang>`. **Revision**: originally a globe-icon toggle button; replaced with this flag+code select box per follow-up request.
- Every static piece of app UI text — headings, button labels, placeholders, status/empty-state messages, pagination text, book-attribute labels ("Title", "Author(s)", etc.), and accessible names (`aria-label`s) — is replaced with a call into the translation dictionary, so the whole UI (not just a few labels) switches language together.
- Book search results themselves also follow the selected language — not via machine translation, but by asking the Google Books API for that language's listings (its `langRestrict` parameter). A currently displayed search is re-run with the new language whenever the user switches. This means results (title, description, etc.) reflect whatever edition the API has cataloged for that language — potentially different from the English listing, or absent entirely for a given query — rather than a translated version of the same English text. Books already in the cart are unaffected by a later language change (they're snapshots, same as their price already is). The brand name "My-Book-Store" and "PayPal" are left untranslated (proper nouns).
- The cart's price/currency formatting (currently hardcoded to `de-DE` regardless of language) becomes locale-aware, following the selected language, since it's directly part of making the UI consistently read in one language or the other.

## Capabilities

### New Capabilities
- `localization`: the language-switching mechanism itself — the header control, the current-language state, persistence, and the requirement that the application's static UI text is displayed in the currently selected language.

### Modified Capabilities
- `book-search`: three requirements currently hardcode exact English text as normative ("Read more"/"Read less" in "Search results list", the literal "Book not found" message, and the "Search" page title) — these become "the localized text for X" instead of a fixed English string. "Search triggers Google Books API request" is also modified: every request now includes a language-restriction parameter, and a currently displayed search is re-sent when the language changes. Everything else in this capability (button/control presence, layout) is unaffected and needs no spec change, even though its rendered *labels* also become localized in the implementation.
- `shopping-cart`: the "Your Cart" page title requirement is similarly hardcoded and needs the same treatment.

Note: `app-header`, `app-footer`, and `google-login` are **not** listed as modified — their existing requirements either don't pin exact rendered text (they describe controls generically, e.g. "a login icon", "a control to sign out") or the only exact text they pin is a proper noun that stays untranslated ("My-Book-Store", "v1.0", "PayPal"). Their aria-labels and other implementation-level text still get localized (see design.md/tasks.md) — that's implementation work covered by the new `localization` capability's general requirement, not a change to those capabilities' own behavior contracts.

## Impact

- Affected files: new `src/app/language/` (service + translation dictionary), `header.html`/`.ts`/`.css`, `footer.html`, `book-search.html`/`.ts`, `book-card.html`/`.ts`, `cart-page.html`/`.ts`, `google-books.ts` (adds `langRestrict`), `src/index.html` (dynamic `lang` attribute is set at runtime, the static attribute becomes a neutral default).
- Existing unit tests across `header.spec.ts`, `book-search.spec.ts`, `book-card.spec.ts`, `cart-page.spec.ts`, `google-books.spec.ts` will need a `Language` provider (or mock) and updated text/param assertions; e2e tests asserting specific English strings will need either a language-reset step or updated expectations.
