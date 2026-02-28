import React, { useState, useEffect } from 'react';
import { useGetTimeSlotAvailability, useUpdateTimeSlotAvailability } from '../../hooks/useTimeSlotAvailability';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

const SLOT_LABELS: { key: keyof import('../../backend').TimeSlotAvailability; label: string }[] = [
  { key: 'slot10am', label: '10:00 AM' },
  { key: 'slot1pm', label: '1:00 PM' },
  { key: 'slot4pm', label: '4:00 PM' },
  { key: 'slot7pm', label: '7:00 PM' },
];

export default function TimeSlotsEditor() {
  const { data: availability, isLoading } = useGetTimeSlotAvailability();
  const updateAvailability = useUpdateTimeSlotAvailability();

  const [slots, setSlots] = useState({
    slot10am: true,
    slot1pm: true,
    slot4pm: true,
    slot7pm: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (availability) {
      setSlots({
        slot10am: availability.slot10am,
        slot1pm: availability.slot1pm,
        slot4pm: availability.slot4pm,
        slot7pm: availability.slot7pm,
      });
    }
  }, [availability]);

  const handleToggle = (key: keyof typeof slots) => {
    setSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaved(false);
    await updateAvailability.mutateAsync(slots);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Time Slot Availability</h2>
        <p className="text-sm text-gray-500">Enable or disable booking time slots for customers</p>
      </div>

      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading slots…
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {SLOT_LABELS.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50">
                <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {label}
                </Label>
                <Switch
                  id={key}
                  checked={slots[key]}
                  onCheckedChange={() => handleToggle(key)}
                />
                <span className={`text-xs font-medium ${slots[key] ? 'text-green-600' : 'text-gray-400'}`}>
                  {slots[key] ? 'Available' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        )}

        {updateAvailability.error && (
          <p className="mt-4 text-sm text-red-600">
            Error: {String(updateAvailability.error)}
          </p>
        )}

        {saved && (
          <p className="mt-4 text-sm text-green-600 font-medium">✓ Time slots saved successfully!</p>
        )}

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={updateAvailability.isPending || isLoading}
          >
            {updateAvailability.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Slots
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
