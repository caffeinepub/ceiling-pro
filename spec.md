# Specification

## Summary
**Goal:** Remove all access restrictions from the `/riyaz` admin route so the full admin dashboard is always accessible without any login, token, or authorization check.

**Planned changes:**
- Remove any access gate, access-denied screen, or authorization check on the `/riyaz` frontend route so `AdminPage.tsx` renders all four admin sections (Images Editor, Service Rates, Time Slots, Bookings Table) unconditionally.
- Update the `useAdminActor` hook to initialize a working actor for anonymous sessions on `/riyaz`, enabling all admin API calls without Internet Identity login or URL token parameters.
- Update the backend Motoko actor to allow anonymous callers to invoke admin-only methods (`listAllBookings`, `updateServiceRates`, `setTimeSlotAvailability`, `setImagePaths`, `uploadImage`) without authorization errors.

**User-visible outcome:** Visiting `/riyaz` in any browser immediately shows the full admin dashboard with all sections functional — no login prompt, no "access denied" message, and all admin operations (view bookings, update rates, manage time slots, edit images) work without authentication.
