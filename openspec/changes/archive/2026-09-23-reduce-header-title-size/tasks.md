## 1. Tune title size

- [x] 1.1 In `header.css`, reduce `.title`'s `font-size` clamp (currently `clamp(1.125rem, 2.5vw + 0.5rem, var(--text-heading))`, capping at 2.5rem) so its rendered size sits closer to `.logo`'s size (currently `clamp(1.5rem, 3vw, 2rem)`), while keeping the title clearly readable and still the more visually prominent of the two — verify by visual inspection in the browser at a typical desktop width that the title no longer looks disproportionately larger than the logo icon
- [x] 1.2 Re-check the title at a narrow viewport (e.g. 375px) and confirm it's still fully visible, not clipped, and the existing text-overflow ellipsis behavior (for viewports where the title would otherwise overflow) still works correctly — verify by visual inspection

## 2. Verification

- [x] 2.1 Run `npm run e2e` and confirm the full suite passes, including `app-shell.spec.ts`'s header/logo/title and narrow-viewport tests (DONE: 46/46 passed)
- [x] 2.2 Manually verify in the browser at mobile, tablet, and desktop widths that: the title and logo read as visually balanced in scale; the header/brand link still functions; no layout regression (clipping, overflow, misalignment) is introduced (DONE: verified via throwaway Playwright scripts with screenshots at 200px/375px/768px/1440px — title font-size now matches the logo's size exactly at desktop width (32px/32px, was 40px/32px before), stays readable and unclipped down to 375px, ellipsis truncation still correctly engages at very narrow widths (200px), and the brand link still navigates to the main page; scripts and screenshots removed after verification)
