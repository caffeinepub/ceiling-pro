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
import type { StoredImage } from '../backend';

function storedImageToUrl(img: StoredImage | undefined): string | undefined {
  if (!img) return undefined;
  return img.image.getDirectURL();
}

export default function HomePage() {
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const { preselectedService } = useBookingPrefill();
  const { data: imagePaths } = useImagePaths();

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

  // Convert StoredImage objects to plain URL strings for child components
  const serviceImagePaths = imagePaths
    ? {
        serviceCard1: storedImageToUrl(imagePaths.serviceCard1),
        serviceCard2: storedImageToUrl(imagePaths.serviceCard2),
        serviceCard3: storedImageToUrl(imagePaths.serviceCard3),
        serviceCard4: storedImageToUrl(imagePaths.serviceCard4),
      }
    : undefined;

  const galleryImageUrls: string[] | undefined =
    imagePaths && imagePaths.beforeAfterGallery.length > 0
      ? imagePaths.beforeAfterGallery.map((img: StoredImage) => img.image.getDirectURL())
      : undefined;

  return (
    <>
      <HeroSection onBookClick={scrollToBooking} heroImagePath={imagePaths?.heroImage} />
      <ServicesSection serviceImagePaths={serviceImagePaths} />
      <HowItWorksSection />
      <EstimateCalculatorSection />
      <div ref={bookingSectionRef}>
        <BookingSection />
      </div>
      <WhyChooseSection />
      <GallerySection galleryImages={galleryImageUrls} />
      <ReviewsSection />
      <ContactSection />
      <StickyBookCta onClick={scrollToBooking} />
      <FloatingWhatsAppButton />
    </>
  );
}
