import { Mail, MapPin, Phone } from 'lucide-react';
import Section from './Section';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';

export default function ContactSection() {
  return (
    <Section variant="grey">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Get in touch with us for any queries or consultation
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Phone</h3>
          <a href={`tel:${CEILING_PRO_CONFIG.phone}`} className="text-sm text-muted-foreground hover:text-primary">
            {CEILING_PRO_CONFIG.phone}
          </a>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Email</h3>
          <a
            href={`mailto:${CEILING_PRO_CONFIG.email}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {CEILING_PRO_CONFIG.email}
          </a>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Service Areas</h3>
          <p className="text-sm text-muted-foreground">Available across major cities</p>
        </div>
      </div>
    </Section>
  );
}
