import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Section from './Section';
import { SERVICES } from '../../domain/services';
import { useBookingPrefill } from '../../state/bookingPrefill';

interface ServicesSectionProps {
  serviceImagePaths?: {
    serviceCard1?: string;
    serviceCard2?: string;
    serviceCard3?: string;
    serviceCard4?: string;
  };
}

export default function ServicesSection({ serviceImagePaths }: ServicesSectionProps) {
  const { setPreselectedService } = useBookingPrefill();

  const handleBookNow = (serviceId: string) => {
    setPreselectedService(serviceId);
  };

  const getServiceImage = (index: number, defaultPath: string): string => {
    if (!serviceImagePaths) return defaultPath;
    const key = `serviceCard${index + 1}` as keyof typeof serviceImagePaths;
    return serviceImagePaths[key] || defaultPath;
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
        {SERVICES.map((service, index) => (
          <Card key={service.id} className="flex flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img 
                src={getServiceImage(index, service.imagePath)} 
                alt={service.imageAlt} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                <img src={service.iconPath} alt="" className="h-8 w-8 object-contain" />
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
