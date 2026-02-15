# Specification

## Summary
**Goal:** Build a mobile-first, premium marketing and service booking website for “Ceiling Pro” with a simple admin dashboard (no email notifications).

**Planned changes:**
- Create a responsive, mobile-first homepage with premium white/natural styling, subtle scroll/section reveal animations, and on-page SEO basics.
- Implement hero section with background image, headline/subheadline, and CTAs (scroll-to booking + click-to-call).
- Add Services section with exactly 4 service cards (icon, description, price text) and “Book Now” that preselects the service in the booking form.
- Add “How it works” 3-step section with icons.
- Build booking UI section with the specified fields, fixed daily time slots (10:00 AM, 1:00 PM, 4:00 PM, 7:00 PM), and on-page confirmation after submit.
- Implement live estimate calculator (Area × Service Rate) with special inspection message for Gypsum Repair; rates default to ₹65/₹110/₹100 and are admin-editable.
- Add trust/content sections: Why Choose, Before & After gallery, Customer Reviews, Contact, and footer with phone/email/GST placeholder.
- Add mobile conversion UI: sticky bottom “Book Consultation” CTA (mobile), floating WhatsApp button, and header click-to-call button.
- Create backend persistence + APIs for bookings, service pricing, and global enable/disable for the 4 time slots (single Motoko actor).
- Build admin panel to view bookings (sortable by created date), edit the 4 service rates, enable/disable time slots, and export bookings to CSV.
- Ensure there are no email-sending code paths, UI, or configuration.
- Add and reference generated static images from `frontend/public/assets/generated` (not served via backend).

**User-visible outcome:** Visitors can browse the Ceiling Pro services site, calculate estimates, and submit a booking for one of four services and one of four fixed time slots; admins can manage bookings, pricing, and slot availability, and export bookings to CSV.
