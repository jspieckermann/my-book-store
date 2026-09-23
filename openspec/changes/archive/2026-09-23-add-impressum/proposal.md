## Why

The app doesn't have a legal notice (Impressum) page yet. German-language commercial-looking web apps conventionally carry one, reachable from the footer; this app's footer currently shows only the version number with no way to reach anything else.

## What Changes

- New `/impressum` route and page rendering a legal notice with fictional operator data (a solo-operator framing: "Max Mustermann", a placeholder address/email/phone, and a placeholder VAT ID), the EU ODR platform link (a real, factual link — not fictional data), a VSBG consumer-dispute-resolution statement, and a customary liability disclaimer for own content and linked external content.
- The Impressum's content is rendered in German only, regardless of the currently selected UI language — it does not go through the `Language`/`translations.ts` mechanism the rest of the app uses, matching the real-world convention that a legal notice isn't translated along with the site.
- The footer gains a link to the Impressum page — its first real content beyond the version number.

## Capabilities

### New Capabilities
- `impressum`: the legal notice page itself — its content sections (operator identity, contact details, VAT ID, EU ODR link, VSBG statement, liability disclaimer), its route, and the requirement that its content stays in German regardless of the selected UI language.

### Modified Capabilities
- `app-footer`: the footer content requirement gains a link to the Impressum page, alongside the existing version text.

## Impact

- Affected files: new `src/app/impressum/` (component, template, styles), `app.routes.ts` (new route), `footer.html`/`.css` (new link).
- No changes to `src/app/language/language.ts` or `translations.ts` — the Impressum page is a deliberate exception to the app's i18n mechanism.
