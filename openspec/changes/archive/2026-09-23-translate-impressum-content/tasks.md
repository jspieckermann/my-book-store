## 1. Translation dictionary

- [x] 1.1 Add the following `impressum.*` keys to `src/app/language/translations.ts` (both `en` and `de` records) — verify every key below exists in both languages:

  | Key | English | German |
  |---|---|---|
  | `impressum.pageTitle` | Imprint | Impressum |
  | `impressum.identityHeading` | Information pursuant to § 5 DDG | Angaben gemäß § 5 DDG |
  | `impressum.country` | Germany | Deutschland |
  | `impressum.contactHeading` | Contact | Kontakt |
  | `impressum.emailLabel` | Email: | E-Mail: |
  | `impressum.phoneLabel` | Phone: | Telefon: |
  | `impressum.vatHeading` | VAT Identification Number | Umsatzsteuer-ID |
  | `impressum.vatExplanation` | VAT identification number pursuant to § 27a of the German VAT Act: | Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: |
  | `impressum.odrHeading` | EU Dispute Resolution | EU-Streitschlichtung |
  | `impressum.odrExplanation` | The European Commission provides a platform for online dispute resolution (ODR): | Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: |
  | `impressum.consumerDisputeHeading` | Consumer Dispute Resolution | Verbraucherstreitbeilegung |
  | `impressum.consumerDisputeStatement` | We are not willing and not obligated to participate in dispute resolution proceedings before a consumer arbitration board. | Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. |
  | `impressum.liabilityHeading` | Disclaimer | Haftungsausschluss |
  | `impressum.liabilityContentSubheading` | Liability for Content | Haftung für Inhalte |
  | `impressum.liabilityContentText` | The content of this page has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. | Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. |
  | `impressum.liabilityLinksSubheading` | Liability for Links | Haftung für Links |
  | `impressum.liabilityLinksText` | This page contains links to external third-party websites over whose content we have no control. The respective provider is always responsible for the content of the linked pages. | Diese Seite enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. |

## 2. Component and template

- [x] 2.1 In `impressum.ts`, `inject(Language)` and expose it (e.g. `protected readonly language = inject(Language);`) for the template to call — verify the component compiles
- [x] 2.2 In `impressum.html`, replace the `<h1>` and every section heading/label/explanatory sentence with the matching `language.translate('impressum.*')` call from the table above — leave the fixed data (name, street address, email address text, phone number, VAT ID number, the ODR URL) as literal, untranslated text — verify by inspecting no hardcoded German or English UI copy remains, while all fixed data values are unchanged
- [x] 2.3 In `footer.html`, replace the literal "Impressum" link text with `language.translate('impressum.pageTitle')` — verify `footer.ts` already injects `Language` or add the injection if it doesn't

## 3. Unit tests

- [x] 3.1 Rewrite `src/app/impressum/impressum.spec.ts`: replace the existing "identical content regardless of language" test (which now asserts the opposite of the required behavior) with tests asserting: the page shows the English heading/label text by default; after `language.setLanguage('de')`, it shows the German heading/label text; the fixed data (name, address, email, phone, VAT ID, ODR URL) is present and unchanged in both cases — verify `npm test` passes
- [x] 3.2 Update `footer.spec.ts`'s Impressum-link test to assert the link's text follows the language (e.g. "Imprint" by default, "Impressum" after switching to German) rather than asserting a fixed literal string, if the existing assertion hardcodes English/German text — verify `npm test` passes
- [x] 3.3 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 103 tests passed, coverage 98.85% stmts / 93.4% branches / 96.29% funcs / 98.94% lines)

## 4. e2e tests

- [x] 4.1 Rewrite `e2e/impressum.spec.ts`'s "content stays German after switching the UI language to German" test (which currently asserts the page is unaffected by language changes) to instead assert: switching the language selector changes the Impressum's headings/labels to match, while the fixed data (operator name, VAT ID) remains visible and unchanged — verify `npm run e2e` passes
- [x] 4.2 Add an e2e assertion that the footer's Impressum link text itself changes with the selected language (e.g. "Imprint" in English, "Impressum" in German) — verify `npm run e2e` passes

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors (DONE: clean build, same pre-existing header.css budget warning, unrelated to this change)
- [x] 5.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 103 tests passed, coverage 98.85% stmts / 93.4% branches / 96.29% funcs / 98.94% lines)
- [x] 5.3 Run `npm run e2e` and confirm the full e2e suite passes (DONE: 47/47 passed)
- [x] 5.4 Manually verify in the browser that: the Impressum page's headings and body text switch fully between English and German when the language selector is used; the fixed data (name, address, email, phone, VAT ID, ODR URL) never changes; the footer's link text also switches ("Imprint" / "Impressum") (DONE: verified via throwaway Playwright script with full-page screenshots — every heading/label/sentence in both languages matches the translation table, all fixed data (name, address, email, phone, VAT ID, ODR link href) confirmed unchanged across the switch, footer link text confirmed "Imprint"/"Impressum"; script and screenshots removed after verification)
