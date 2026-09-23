## Context

The current implementation (from `truncate-book-description`, later adjusted to 250 chars) has `book-card.ts` expose a `DESCRIPTION_TRUNCATE_LENGTH` constant, `expanded`/`descriptionTruncated`/`displayDescription` state, and `book-card.html` renders a boxed icon-only `.expand-button` (matching `.add-to-cart-button`/`.delete-button`'s chrome) inline right after the description text, with a rotating chevron `<svg class="action-icon">`. See proposal.md for why this needs to change. This change keeps the state/logic shape but changes the number and the control's markup, styling, and position.

## Goals / Non-Goals

**Goals:**
- Truncation threshold raised from 250 to 350 characters, same word-boundary + ellipsis logic.
- The expand control renders as a text link ("Read more" / "Read less") with a chevron icon, not a boxed icon-only button.
- The control sits on its own line below the (truncated or full) description text, not inline immediately after it.
- The control still meets the `theming` capability's "Interactive control feedback" requirement (visible hover and press feedback, reduced-motion-safe).

**Non-Goals:**
- No change to the expand/collapse toggle logic itself, or to any other book-card control (add-to-cart, delete).
- No change to how title, authors, publisher, or published date are rendered.

## Decisions

- **Threshold**: bump `DESCRIPTION_TRUNCATE_LENGTH` from `250` to `350`; the truncation algorithm (slice, trim to last whitespace, append `…`) is unchanged.
- **Markup**: move the button out of the `<dd>`'s inline text flow and onto its own line below it — e.g. a `<div class="description-expand">` (or a second `<dd>`-adjacent element) containing the `<button>`, rendered only when `descriptionTruncated()` is true, so it naturally sits below the (possibly multi-line) description text in normal document flow.
- **Visual style**: drop the shared icon-button chrome (border/background/padding box) for this control — style it like the existing `.back-link` text link: `color: var(--color-accent)`, no border/background, `text-decoration: none` at rest with `text-decoration: underline` on hover (matching `.back-link`'s established link pattern), plus the chevron icon inline before or after the text. Chosen order: text first, chevron after — reads naturally as "Read more ⌄" / "Read less ⌃".
- **Text label**: the button's visible text is bound to `expanded() ? 'Read less' : 'Read more'`; the `aria-label`s are dropped in favor of the visible text itself serving as the accessible name (a link-style text button doesn't need a redundant `aria-label` when its own text already says what it does).
- **Chevron**: keep the existing rotating-chevron SVG and `.action-icon`/`.action-icon.expanded` rotation approach — reused as-is, just re-parented under the new link-style control instead of the old boxed button.
- **Hover/press feedback**: keep `filter: brightness()` + `scale()` on `:active` (consistent with the theming capability's cross-cutting interactive-feedback requirement) layered on top of the new link-style resting appearance, exactly as `.back-link` already does (underline-on-hover plus brightness/scale-on-press together).

## Risks / Trade-offs

- [Moving the control out of the `<dd>`'s inline flow changes its DOM position, which could break any test currently asserting the button is a *descendant* of the description `<dd>` specifically] → None of the existing tests assert DOM nesting that specifically (checked: they query `.expand-button` from the card root), so no fallout expected, but tests should still be re-run.
- [Existing tests assert the old `aria-label`s ("Show full description" / "Show less")] → Update `book-card.spec.ts` to assert the visible text ("Read more" / "Read less") instead.
- [The e2e regression test and any other e2e fixtures use a description sized against the previous 250-char threshold] → Re-check `e2e/book-search.spec.ts`'s long-description fixture still exceeds 350 characters (it currently uses a ~1040-character fixture, so it remains valid, but this must be verified, not assumed).
