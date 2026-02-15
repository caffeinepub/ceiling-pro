import { SiWhatsapp } from 'react-icons/si';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';

export default function FloatingWhatsAppButton() {
  // Normalize phone number for WhatsApp (remove spaces, dashes, and ensure it starts with country code)
  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // If it doesn't start with country code, assume India (+91)
    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  };

  const normalizedPhone = normalizePhoneNumber(CEILING_PRO_CONFIG.whatsapp);
  const whatsappUrl = `https://wa.me/${normalizedPhone}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp className="h-7 w-7" />
    </a>
  );
}
