# Specification

## Summary
**Goal:** Update the Google Ads tracking tag to use the new conversion ID AW-17969512168.

**Planned changes:**
- Replace the existing Google Ads tracking code in frontend/index.html with the new tracking script that uses conversion ID AW-17969512168 instead of AW-17968689708
- Update both the gtag.js script source URL and the gtag config call to reference the new conversion ID
- Maintain the async loading and placement in the <head> section

**User-visible outcome:** The website will track conversions using the updated Google Ads account, enabling accurate advertising performance measurement with the new conversion ID.
