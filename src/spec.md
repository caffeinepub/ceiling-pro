# Specification

## Summary
**Goal:** Fix admin authentication and authorization so correct credentials reliably grant access to the `/admin` dashboard and persist across refreshes.

**Planned changes:**
- Fix backend `adminLogin(username, password)` to establish a reliable per-caller admin session so that `isAdminUser()` returns `true` immediately after successful login and remains valid on subsequent calls (including after refresh).
- Update backend authorization checks on admin-only endpoints (at minimum: `getAllBookings`, `updateServiceRates`, `updateTimeSlotAvailability`, `updateImagePaths`) to use the same admin-auth mechanism as `isAdminUser()`.
- Adjust the frontend admin login flow to confirm session state via `isAdminUser()` after login and on refresh, and to show an error on invalid credentials without rendering admin content.

**User-visible outcome:** Users who enter the correct admin username/password can access and use the admin dashboard (including bookings, service rates, time slots, and images), and remain logged in across page refresh; incorrect credentials keep them on the login screen with an error.
