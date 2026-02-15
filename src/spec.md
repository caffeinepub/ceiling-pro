# Specification

## Summary
**Goal:** Update admin login credentials, change the sitewide public contact email, and restore the prior default images used in the “Our Services” section.

**Planned changes:**
- Update backend admin credentials to username `Sirajahmad` and password `S1i2r3`, replacing the previous defaults and ensuring upgrades migrate any persisted credentials to the new values.
- Update shared frontend contact configuration so the Contact section and Footer display and link to `ceilingpro9@gmail.com`.
- Switch the 4 “Our Services” service-card default image paths back to the project’s previous image set (e.g., `/images/service*.jpg` style paths) while keeping per-card image paths controllable via the existing admin image-path mechanism.

**User-visible outcome:** Admin login only works with the new credentials, the website shows `ceilingpro9@gmail.com` everywhere email is displayed (including Contact and Footer), and the Services section displays the prior service images instead of the newer generated ones.
