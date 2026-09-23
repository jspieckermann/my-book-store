## Context

The app has a `Language` service (`src/app/language/language.ts`) and a flat `translations.ts` dictionary that every other piece of UI text goes through via `language.translate(key)`. See proposal.md for why the Impressum is a deliberate exception to that.

## Goals / Non-Goals

**Goals:**
- A reachable `/impressum` route with a static page containing the required legal-notice content, using fake/placeholder data throughout.
- The page's text is fixed German, independent of `Language.current()`.
- A footer link to the page, consistent with the app's existing icon-free text-link style (e.g. the cart page's "← Back to search" link).

**Non-Goals:**
- No real legal review or jurisdiction-accurate completeness — this is a demo project using placeholder data, not a real business's compliance page.
- No German/English toggle for this page's content, and no new `translations.ts` keys for it.
- No dynamic data (all content is static markup).

## Decisions

- **Bypass the translation dictionary entirely, rather than adding `impressum.*` keys**: every other page's text is a `language.translate('some.key')` call resolving through `TRANSLATIONS`. Adding German-only keys there would work mechanically, but it would misrepresent the dictionary as a place where "the German value is the only value that's ever shown" for a whole page — a special case baked into a general mechanism. Instead, `ImpressumPage`'s template just contains literal German text directly, with no `Language` injection at all. This makes the "not translated" behavior structurally guaranteed (there's no code path that could vary it) rather than something a future edit to `translations.ts` could accidentally break.
- **New standalone `ImpressumPage` component** (`src/app/impressum/`), following the existing per-page component pattern (`BookSearch`, `CartPage`) and reusing the same page-title styling convention (`.page-title`, referenced by the `app-footer`/`theming` capabilities elsewhere) so it looks consistent with the rest of the app despite being content-only.
- **New route `{ path: 'impressum', component: ImpressumPage }`** added to `app.routes.ts` alongside the existing `''` and `'cart'` routes.
- **Footer link as a plain `routerLink`**, styled like existing text links in the app (e.g. `cart-page.html`'s back-link), added next to the existing version `<span>`.
- **Fake data conventions**: German placeholder-name/address conventions ("Max Mustermann", "Musterstraße", "Musterstadt") and the IANA-reserved `.example` email domain are used specifically because they read as obviously fake to anyone familiar with them, avoiding an appearance of a real business or person.

## Risks / Trade-offs

- [A German-only page inside an app that otherwise supports English] → Accepted and intentional; matches real-world convention that legal notices aren't translated with the rest of a site. Documented here and in the `impressum` capability's own requirement so it isn't mistaken for a missed translation later.
- [Fake VAT ID / address format might not match every reader's expectations for "what a real one looks like"] → Not a concern since the whole page is explicitly placeholder content for a demo project, not a real filing.
