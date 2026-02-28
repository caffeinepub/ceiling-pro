import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Section from '../marketing/Section';
import { SERVICES, getServiceRate } from '../../domain/services';
import { useServiceRates } from '../../hooks/useServiceRates';

export default function EstimateCalculatorSection() {
  const [area, setArea] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [estimate, setEstimate] = useState<number | null>(null);
  const [showInspectionMessage, setShowInspectionMessage] = useState(false);

  const { data: serviceRates } = useServiceRates();

  useEffect(() => {
    if (!area || !selectedService) {
      setEstimate(null);
      setShowInspectionMessage(false);
      return;
    }

    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      setEstimate(null);
      setShowInspectionMessage(false);
      return;
    }

    const service = SERVICES.find((s) => s.id === selectedService);
    if (!service) return;

    if (service.isInspectionBased) {
      setShowInspectionMessage(true);
      setEstimate(null);
    } else {
      setShowInspectionMessage(false);
      const rate = getServiceRate(service.id, serviceRates);
      if (rate !== null) {
        setEstimate(areaNum * rate);
      }
    }
  }, [area, selectedService, serviceRates]);

  return (
    <Section variant="white">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Live Estimate Calculator</CardTitle>
            <CardDescription>Get an instant cost estimate for your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="area">Area in Square Feet</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Select Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estimate !== null && (
              <div className="rounded-lg bg-accent/20 p-6 text-center">
                <p className="mb-2 text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-3xl font-bold text-primary">₹{estimate.toLocaleString('en-IN')}</p>
                <p className="mt-2 text-xs text-muted-foreground">*Final price may vary after site inspection</p>
              </div>
            )}

            {showInspectionMessage && (
              <div className="rounded-lg bg-muted/50 p-6 text-center">
                <p className="text-sm font-medium text-foreground">Final estimate after inspection</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Our expert will assess the damage and provide an accurate quote
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
