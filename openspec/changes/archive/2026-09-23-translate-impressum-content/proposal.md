## Why

The Impressum page was deliberately built as a German-only exception to the app's EN/DE language switching (see the archived `add-impressum` change's design.md). That was modeled on the real-world convention that a legal notice isn't translated with the rest of a site. The user now wants the Impressum's headlines and body content to follow the selected UI language like every other page, reversing that earlier decision.

## What Changes

- **BREAKING** (behavioral reversal): The Impressum page's section headings and body text (labels, explanatory sentences, the VAT/EU-dispute/consumer-dispute statements, and the liability disclaimer paragraphs) now go through the app's existing `Language`/`translations.ts` mechanism, the same as every other page, instead of being fixed German text.
- The page's own title ("Impressum"/"Imprint") and the footer's link text to it also become language-aware.
- The operator's fixed identity and legal data — the fake name, street address, email, phone number, and VAT identification number, plus the real EU ODR platform URL — remain unchanged regardless of language. These are factual/legal identifiers, not descriptive text, and (per real-world convention this app is otherwise modeling) a postal address or ID number isn't translated even on genuinely bilingual sites. The country name "Deutschland"/"Germany", which reads as ordinary descriptive text rather than a fixed identifier, does become translated.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `impressum`: replaces the "Impressum content is not translated" requirement with a new requirement describing the opposite behavior — content follows the selected UI language, except for the fixed identity/legal data listed above.

## Impact

- Affected files: `src/app/impressum/impressum.ts` (adds `inject(Language)`), `src/app/impressum/impressum.html` (every heading/label/explanatory sentence replaced with `language.translate(...)` calls), `src/app/language/translations.ts` (new `impressum.*` keys), `src/app/footer/footer.html` (link text becomes translated).
- Existing `impressum.spec.ts` unit tests and `e2e/impressum.spec.ts` currently assert fixed German text and explicitly assert language-invariance — both need updating to assert translated behavior instead.
