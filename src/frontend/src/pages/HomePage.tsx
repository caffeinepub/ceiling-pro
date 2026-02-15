import { useEffect, useRef } from 'react';
import HeroSection from '../components/marketing/HeroSection';
import ServicesSection from '../components/marketing/ServicesSection';
import HowItWorksSection from '../components/marketing/HowItWorksSection';
import EstimateCalculatorSection from '../components/estimate/EstimateCalculatorSection';
import BookingSection from '../components/booking/BookingSection';
import WhyChooseSection from '../components/marketing/WhyChooseSection';
import GallerySection from '../components/marketing/GallerySection';
import ReviewsSection from '../components/marketing/ReviewsSection';
import ContactSection from '../components/marketing/ContactSection';
import StickyBookCta from '../components/conversion/StickyBookCta';
import FloatingWhatsAppButton from '../components/conversion/FloatingWhatsAppButton';
import { useBookingPrefill } from '../state/bookingPrefill';

export default function HomePage() {
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const { preselectedService, clearPrefill } = useBookingPrefill();

  // Scroll to booking section when service is preselected
  useEffect(() => {
    if (preselectedService && bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [preselectedService]);

  const scrollToBooking = () => {
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <HeroSection onBookClick={scrollToBooking} />
      <ServicesSection />
      <HowItWorksSection />
      <EstimateCalculatorSection />
      <div ref={bookingSectionRef}>
        <BookingSection />
      </div>
      <WhyChooseSection />
      <GallerySection />
      <ReviewsSection />
      <ContactSection />
      <StickyBookCta onClick={scrollToBooking} />
      <FloatingWhatsAppButton />
    </>
  );
}
