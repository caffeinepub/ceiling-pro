import { SiWhatsapp } from 'react-icons/si';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';

export default function FloatingWhatsAppButton() {
  const whatsappUrl = `https://wa.me/${CEILING_PRO_CONFIG.whatsapp}`;

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
