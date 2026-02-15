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
import { useImagePaths } from '../hooks/useImagePaths';

export default function HomePage() {
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const { preselectedService } = useBookingPrefill();
  const { data: imagePaths } = useImagePaths();

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
      <HeroSection onBookClick={scrollToBooking} heroImagePath={imagePaths?.heroImage} />
      <ServicesSection
        serviceImagePaths={
          imagePaths
            ? {
                serviceCard1: imagePaths.serviceCard1,
                serviceCard2: imagePaths.serviceCard2,
                serviceCard3: imagePaths.serviceCard3,
                serviceCard4: imagePaths.serviceCard4,
              }
            : undefined
        }
      />
      <HowItWorksSection />
      <EstimateCalculatorSection />
      <div ref={bookingSectionRef}>
        <BookingSection />
      </div>
      <WhyChooseSection />
      <GallerySection galleryImages={imagePaths?.beforeAfterGallery} />
      <ReviewsSection />
      <ContactSection />
      <StickyBookCta onClick={scrollToBooking} />
      <FloatingWhatsAppButton />
    </>
  );
}
