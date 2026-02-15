import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Section from './Section';
import { SERVICES } from '../../domain/services';
import { useBookingPrefill } from '../../state/bookingPrefill';

export default function ServicesSection() {
  const { setPreselectedService } = useBookingPrefill();

  const handleBookNow = (serviceId: string) => {
    setPreselectedService(serviceId);
  };

  return (
    <Section variant="white">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Professional ceiling solutions for homes and offices with transparent pricing
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <Card key={service.id} className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/20">
                <img src={service.iconPath} alt={service.name} className="h-10 w-10 object-contain" />
              </div>
              <CardTitle className="text-xl">{service.name}</CardTitle>
              <CardDescription className="text-base font-semibold text-primary">{service.priceText}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleBookNow(service.id)} className="w-full">
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
