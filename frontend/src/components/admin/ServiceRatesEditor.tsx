import React, { useState, useEffect } from 'react';
import { useGetServiceRates, useUpdateServiceRates } from '../../hooks/useServiceRates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export default function ServiceRatesEditor() {
  const { data: rates, isLoading } = useGetServiceRates();
  const updateRates = useUpdateServiceRates();

  const [popGypsum, setPopGypsum] = useState('');
  const [pvc, setPvc] = useState('');
  const [wallMolding, setWallMolding] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (rates) {
      setPopGypsum(String(rates.popGypsum));
      setPvc(String(rates.pvc));
      setWallMolding(String(rates.wallMolding));
    }
  }, [rates]);

  const handleSave = async () => {
    setSaved(false);
    await updateRates.mutateAsync({
      popGypsum: parseInt(popGypsum, 10),
      pvc: parseInt(pvc, 10),
      wallMolding: parseInt(wallMolding, 10),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Service Rates</h2>
        <p className="text-sm text-gray-500">Set per sq. ft. pricing for each service (₹)</p>
      </div>

      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading rates…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="popGypsum">POP &amp; Gypsum (₹/sq.ft)</Label>
              <Input
                id="popGypsum"
                type="number"
                min="1"
                value={popGypsum}
                onChange={e => setPopGypsum(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pvc">PVC (₹/sq.ft)</Label>
              <Input
                id="pvc"
                type="number"
                min="1"
                value={pvc}
                onChange={e => setPvc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallMolding">Wall Molding (₹/sq.ft)</Label>
              <Input
                id="wallMolding"
                type="number"
                min="1"
                value={wallMolding}
                onChange={e => setWallMolding(e.target.value)}
              />
            </div>
          </div>
        )}

        {updateRates.error && (
          <p className="mt-4 text-sm text-red-600">
            Error: {String(updateRates.error)}
          </p>
        )}

        {saved && (
          <p className="mt-4 text-sm text-green-600 font-medium">✓ Rates saved successfully!</p>
        )}

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={updateRates.isPending || isLoading}
          >
            {updateRates.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Rates
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
