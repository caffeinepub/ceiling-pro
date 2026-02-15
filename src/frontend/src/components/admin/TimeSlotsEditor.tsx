import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTimeSlotAvailability, useUpdateTimeSlotAvailability } from '../../hooks/useTimeSlotAvailability';
import { Loader2 } from 'lucide-react';

const TIME_SLOTS = [
  { id: 'slot10am', label: '10:00 AM' },
  { id: 'slot1pm', label: '1:00 PM' },
  { id: 'slot4pm', label: '4:00 PM' },
  { id: 'slot7pm', label: '7:00 PM' },
];

export default function TimeSlotsEditor() {
  const { data: availability, isLoading } = useTimeSlotAvailability();
  const updateAvailability = useUpdateTimeSlotAvailability();

  const [slots, setSlots] = useState({
    slot10am: true,
    slot1pm: true,
    slot4pm: true,
    slot7pm: true,
  });

  useEffect(() => {
    if (availability) {
      setSlots(availability);
    }
  }, [availability]);

  const handleToggle = (slotId: string) => {
    setSlots((prev) => ({ ...prev, [slotId]: !prev[slotId as keyof typeof prev] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAvailability.mutateAsync(slots);
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading time slots...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Time Slot Availability</CardTitle>
        <CardDescription>Enable or disable booking time slots</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {TIME_SLOTS.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor={slot.id} className="cursor-pointer">
                  {slot.label}
                </Label>
                <Switch
                  id={slot.id}
                  checked={slots[slot.id as keyof typeof slots]}
                  onCheckedChange={() => handleToggle(slot.id)}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={updateAvailability.isPending}>
            {updateAvailability.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Availability'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
