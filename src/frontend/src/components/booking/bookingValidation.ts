interface BookingFormData {
  fullName: string;
  mobileNumber: string;
  location: string;
  propertyType: string;
  service: string;
  date: string;
  timeSlot: string;
  area: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateBookingForm(data: BookingFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Full Name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  // Mobile Number
  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(data.mobileNumber.trim())) {
    errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
  }

  // Location
  if (!data.location.trim()) {
    errors.location = 'Location is required';
  }

  // Property Type
  if (!data.propertyType) {
    errors.propertyType = 'Property type is required';
  }

  // Service
  if (!data.service) {
    errors.service = 'Service selection is required';
  }

  // Date
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = 'Please select a future date';
    }
  }

  // Time Slot
  if (!data.timeSlot) {
    errors.timeSlot = 'Time slot is required';
  }

  // Area
  if (!data.area.trim()) {
    errors.area = 'Area is required';
  } else {
    const areaNum = parseFloat(data.area);
    if (isNaN(areaNum) || areaNum <= 0) {
      errors.area = 'Please enter a valid area greater than 0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
