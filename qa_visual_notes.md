# Visual QA notes — 2026-07-12

## Homepage desktop

The premium dark-luxury visual system renders correctly after full asset load. The navigation, serif hero typography, gold CTA hierarchy, trust panel and background artwork are visually coherent. Text contrast is sufficient and the service section begins cleanly below the fold.

The cookie banner overlaps the lower middle of the viewport as expected for a consent dialog. Bottom navigation is visible on desktop in the sandbox screenshot; this is redundant because the desktop top navigation is also active. It should be restricted to mobile/tablet widths.

The generated hero PNG was 3.4 MB. A visually equivalent WebP asset was created at 114 KB and the homepage import was updated, cutting hero transfer size by about 97%.

## Follow-up checks

Verify mobile navigation behavior, offer wizard, assistant, FAQ and contact page. Confirm that the cookie banner remains usable on narrow screens. Validate final production build after responsive fix.

## Mobile viewport findings

The homepage, header, gold CTA hierarchy and fixed bottom navigation render correctly at 390 × 844. The offer wizard has a critical responsive defect: the service selector and selected category panel remain in a multi-column desktop layout, causing horizontal overflow and clipping. The offer grid must collapse to one column on mobile, with the selector above the active form panel.

The assistant authentication state and FAQ accordion render cleanly at mobile width. The initial `/kontakt` screenshot intentionally hit the 404 route; the actual contact route must be rechecked from the router definition.

## Mobile recheck

The `/angebot` two-column overflow is resolved at 390 × 844. Service options now form a compact two-column selector with no horizontal clipping, clear gold active state, and the benefits/form content follows in document flow. The `/contact` route renders the intended premium support page correctly, with readable contact cards, restrained gold accents, and a single-column mobile form.
