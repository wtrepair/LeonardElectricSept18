# AGENTS.md

## Repo Overview
This is the Leonard Electric Sept18 static HTML site.
- Pages are root-level `*.html` files.
- Shared scripts/styles live in `assets/`.
- Tracking changes should be made in shared assets first, not duplicated per page.

## Tracking Stack (Google)
Use and preserve this stack:
- GTM container: `GTM-WD7TFGW6`
- Google Ads account tag: `AW-11310801752`
- Call conversion label: `FX9yCMr93PwbENjGtJEq`
- Lead conversion label: `ua7HCK342vwbENjGtJEq`

## Tracking Rules (must follow)
1. No duplicate call conversion firing.
   - Avoid combining inline `gtag_report_conversion(...)` handlers with global tel-click conversion logic.
2. Keep global tracking centralized in:
   - `assets/js/leonard-tracking.js`
3. Fire lead conversion only on confirmed successful form submit response.
4. Include context fields on key events:
   - `page_path`, `page_type`, `service_name`
   - `cta_text`, `destination` for service CTA clicks
5. Service pages should emit:
   - `service_page_view`
   - `service_cta_click` for high-intent CTAs (contact/get quote/new request/book)

## Change Workflow
1. Edit shared JS (`assets/js/leonard-tracking.js`) and required page markup.
2. Validate by opening key pages and checking browser `dataLayer`:
   - `le_page_view`
   - `service_page_view` on service pages
   - `service_cta_click` on CTA links
   - single `phone_click` + single call conversion per click
3. Commit and push.
4. Verify production in GTM preview / Ads diagnostics.
