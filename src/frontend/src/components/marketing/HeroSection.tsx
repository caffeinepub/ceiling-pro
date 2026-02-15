import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';

interface HeroSectionProps {
  onBookClick: () => void;
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 to-background md:min-h-[700px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url(/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png)' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />

      {/* Content */}
      <div className="container relative z-10 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Affordable & Premium False Ceiling Services
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Starting at ₹65 per sq.ft – Book Expert Consultation Online
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={onBookClick} className="w-full sm:w-auto">
            Book Consultation
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
            <a href={`tel:${CEILING_PRO_CONFIG.phone}`}>
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
