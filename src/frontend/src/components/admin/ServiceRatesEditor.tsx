import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServiceRates, useUpdateServiceRates } from '../../hooks/useServiceRates';
import { Loader2 } from 'lucide-react';

export default function ServiceRatesEditor() {
  const { data: serviceRates, isLoading } = useServiceRates();
  const updateRates = useUpdateServiceRates();

  const [rates, setRates] = useState({
    popGypsum: '',
    pvc: '',
    wallMolding: '',
  });

  useEffect(() => {
    if (serviceRates) {
      setRates({
        popGypsum: serviceRates.popGypsum.toString(),
        pvc: serviceRates.pvc.toString(),
        wallMolding: serviceRates.wallMolding.toString(),
      });
    }
  }, [serviceRates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRates.mutateAsync({
      popGypsum: BigInt(rates.popGypsum),
      pvc: BigInt(rates.pvc),
      wallMolding: BigInt(rates.wallMolding),
    });
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading rates...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Service Rates</CardTitle>
        <CardDescription>Update the per square foot pricing for each service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="popGypsum">POP & Gypsum (₹/sq.ft)</Label>
              <Input
                id="popGypsum"
                type="number"
                value={rates.popGypsum}
                onChange={(e) => setRates({ ...rates, popGypsum: e.target.value })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pvc">PVC Ceiling (₹/sq.ft)</Label>
              <Input
                id="pvc"
                type="number"
                value={rates.pvc}
                onChange={(e) => setRates({ ...rates, pvc: e.target.value })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallMolding">Wall Molding (₹/sq.ft)</Label>
              <Input
                id="wallMolding"
                type="number"
                value={rates.wallMolding}
                onChange={(e) => setRates({ ...rates, wallMolding: e.target.value })}
                min="1"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={updateRates.isPending}>
            {updateRates.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Rates'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
