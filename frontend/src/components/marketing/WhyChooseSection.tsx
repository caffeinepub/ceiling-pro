import { CheckCircle2 } from 'lucide-react';
import Section from './Section';

const REASONS = [
  {
    title: 'Affordable',
    description: 'Competitive pricing starting at ₹65 per sq.ft with transparent quotes',
  },
  {
    title: 'Skilled Experts',
    description: 'Experienced professionals with years of expertise in ceiling installations',
  },
  {
    title: 'On-Time Delivery',
    description: 'We value your time and ensure timely project completion',
  },
];

export default function WhyChooseSection() {
  return (
    <Section variant="white">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Why Choose Ceiling Pro</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Your trusted partner for premium ceiling solutions
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
            <p className="text-sm text-muted-foreground">{reason.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
