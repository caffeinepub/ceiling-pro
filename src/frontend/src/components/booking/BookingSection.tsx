import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Section from '../marketing/Section';
import { SERVICES } from '../../domain/services';
import { useBookingPrefill } from '../../state/bookingPrefill';
import { useTimeSlotAvailability } from '../../hooks/useTimeSlotAvailability';
import { useCreateBooking } from '../../hooks/useBookings';
import { validateBookingForm } from './bookingValidation';
import { Loader2 } from 'lucide-react';

const TIME_SLOTS = [
  { id: 'slot10am', label: '10:00 AM', value: '10:00 AM' },
  { id: 'slot1pm', label: '1:00 PM', value: '1:00 PM' },
  { id: 'slot4pm', label: '4:00 PM', value: '4:00 PM' },
  { id: 'slot7pm', label: '7:00 PM', value: '7:00 PM' },
];

const PROPERTY_TYPES = ['Flat', 'Office', 'Shop'];

export default function BookingSection() {
  const { preselectedService, clearPrefill } = useBookingPrefill();
  const { data: timeSlotAvailability, isLoading: isLoadingSlots } = useTimeSlotAvailability();
  const createBooking = useCreateBooking();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    location: '',
    propertyType: '',
    service: '',
    date: '',
    timeSlot: '',
    area: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Set preselected service
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
      clearPrefill();
    }
  }, [preselectedService, clearPrefill]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await createBooking.mutateAsync({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        location: formData.location,
        propertyType: formData.propertyType,
        service: formData.service,
        date: formData.date,
        timeSlot: formData.timeSlot,
        area: parseInt(formData.area, 10),
      });

      setShowSuccess(true);
      setFormData({
        fullName: '',
        mobileNumber: '',
        location: '',
        propertyType: '',
        service: '',
        date: '',
        timeSlot: '',
        area: '',
      });
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    }
  };

  const getAvailableSlots = () => {
    if (!timeSlotAvailability) return [];
    return TIME_SLOTS.filter((slot) => timeSlotAvailability[slot.id as keyof typeof timeSlotAvailability]);
  };

  const availableSlots = getAvailableSlots();

  return (
    <Section variant="grey">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Book Your Consultation</CardTitle>
            <CardDescription>Fill in your details and we'll get back to you shortly</CardDescription>
          </CardHeader>
          <CardContent>
            {showSuccess && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <p className="font-semibold">Booking Submitted Successfully!</p>
                <p className="mt-1">We have received your booking request and will contact you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange('mobileNumber', e.target.value)}
                  placeholder="Enter your mobile number"
                />
                {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter your location"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleChange('propertyType', value)}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Select Service *</Label>
                <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
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
                {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Select Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Select Time Slot *</Label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(value) => handleChange('timeSlot', value)}
                  disabled={isLoadingSlots || availableSlots.length === 0}
                >
                  <SelectTrigger id="timeSlot">
                    <SelectValue placeholder={isLoadingSlots ? 'Loading slots...' : 'Choose a time slot'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeSlot && <p className="text-sm text-destructive">{errors.timeSlot}</p>}
                {!isLoadingSlots && availableSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">No time slots available. Please contact us directly.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area in Square Feet *</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="Enter area"
                  min="1"
                />
                {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
              </div>

              {errors.submit && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errors.submit}</div>
              )}

              <Button type="submit" className="w-full" disabled={createBooking.isPending}>
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
