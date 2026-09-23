## Context

`ImpressumPage` (`src/app/impressum/`) currently has zero injected services and a template of literal German text — a deliberate exception to the `Language`/`translations.ts` mechanism every other page uses (see the archived `add-impressum` change's design.md: "Bypass the translation dictionary entirely... This makes the 'not translated' behavior structurally guaranteed"). See proposal.md for why that decision is now being reversed.

## Goals / Non-Goals

**Goals:**
- Bring `ImpressumPage` in line with every other page: inject `Language`, replace literal text with `language.translate('impressum.*')` calls.
- Add the new `impressum.*` keys to `translations.ts` with both English and German values.
- Keep fixed identity/legal data (name, address, email, phone, VAT ID, ODR URL) as literal, non-translated values — these are data, not UI copy.

**Non-Goals:**
- No change to *which* six content sections are required (that requirement is untouched).
- No change to the footer's routing to `/impressum`.
- No re-litigation of the fake-data values themselves (name, address, etc.) — only whether surrounding labels/text are translated.

## Decisions

- **Translation boundary: labels/explanatory text vs. fixed data.** Everything that reads as a heading, label, or explanatory sentence goes through `translate()`. Everything that reads as a specific fact about this fictional operator (name, street address, email, phone, VAT ID) or an external reference (the ODR URL) stays a literal string. The one judgment call inside "data": the country name "Deutschland"/"Germany" is address *text*, not an identifier — worded like the city/street around it — so it's translated too (`impressum.country`), unlike the street address itself.
- **English page-title wording: "Imprint".** German sites conventionally label the English version of this page "Imprint" (a direct cognate) rather than "Legal Notice" — this is the term most commonly seen on bilingual DACH sites and keeps the connection to "Impressum" obvious. Used both for the page's own `<h1>` and the footer's link text (one key, `impressum.pageTitle`, reused in both places — the same pattern `cartPage.pageTitle` already establishes for a page's own heading, extended here to also drive the footer's link label since both should always read identically).
- **New `translations.ts` keys** (full table in tasks.md), namespaced `impressum.*` following the existing `bookSearch.*`/`bookCard.*`/`cartPage.*` convention. No new mechanism — this reuses the existing flat dictionary and `{placeholder}`-free plain lookups.
- **`ImpressumPage` gains `protected readonly language = inject(Language);`**, same pattern as `Header`/`BookSearch`/`BookCard`/`CartPage`. No new re-fetch/reactive effect is needed (unlike `BookSearch`'s language-triggered API re-fetch) — the whole page is static markup driven directly by signal reads in the template, which already re-render on language change like any other `language.translate(...)` call in this app.

## Risks / Trade-offs

- [This reverses a documented real-world-convention-based decision (legal notices conventionally aren't translated) for what is, per this app's own established framing, a demo project using fake data throughout] → Accepted per explicit user request; the earlier convention-based reasoning was itself contingent on this looking like a genuinely bilingual real filing, which doesn't apply here.
- [Existing `impressum.spec.ts` unit tests assert fixed German text and *explicitly* assert content is identical regardless of `Language`'s value — the opposite of the new requirement] → These tests must be rewritten, not just extended; flagged as its own task rather than silently reusing/adapting the old assertions.
- [`e2e/impressum.spec.ts`'s "content stays German after switching to German" test is now testing the wrong thing entirely] → Same as above — rewritten to assert the opposite (content changes with language), while still asserting the fixed data does NOT change.
