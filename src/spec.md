# Specification

## Summary
**Goal:** Enable real (persisted) image uploads for the 4 Service section cards so the marketing site can render them via stable URLs/paths instead of base64 data URLs.

**Planned changes:**
- Add a backend image upload method using the existing blob-storage mixin to store uploaded service-card images in canister storage and return a stable, directly usable URL/path for `<img src>`.
- Update the `/riyaz → Website Images → Service Card Images` upload flow to call the backend upload API and store the returned URL/path into the service card image path fields.
- Ensure the public “Our Services” section renders images from the saved service-card image paths and falls back gracefully to default/placeholder imagery if an uploaded image fails to load.

**User-visible outcome:** Admins can upload service-card images in `/riyaz`, save image paths, and visitors will see the updated service images on the public site using stable canister-hosted URLs (with a safe fallback if an image can’t be loaded).
