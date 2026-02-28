import Section from './Section';

const STEPS = [
  {
    number: 1,
    title: 'Book Your Slot Online',
    description: 'Choose your preferred date and time slot from our online booking system',
    iconPath: '/assets/generated/icon-step-book.dim_256x256.png',
  },
  {
    number: 2,
    title: 'Site Visit & Final Estimate',
    description: 'Our expert will visit your location and provide a detailed estimate',
    iconPath: '/assets/generated/icon-step-visit.dim_256x256.png',
  },
  {
    number: 3,
    title: 'Professional Installation & Clean Finish',
    description: 'Skilled team completes the work on time with a clean, premium finish',
    iconPath: '/assets/generated/icon-step-install.dim_256x256.png',
  },
];

export default function HowItWorksSection() {
  return (
    <Section variant="grey">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">Simple 3-step process to get your dream ceiling</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="relative text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-background shadow-sm">
              <img src={step.iconPath} alt={step.title} className="h-12 w-12 object-contain" />
            </div>
            <div className="absolute left-1/2 top-12 -z-10 hidden h-0.5 w-full -translate-x-1/2 bg-border md:block md:last:hidden" />
            <h3 className="mb-2 text-xl font-semibold">
              <span className="mr-2 text-primary">0{step.number}.</span>
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
