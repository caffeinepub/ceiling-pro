import { useActor } from './useActor';

/**
 * Returns the same actor as useActor but intended for admin operations.
 * The backend no longer requires any special token — all admin methods
 * (getAllBookings, updateServiceRates, updateTimeSlotAvailability,
 * updateImagePaths, uploadImage) are open to any caller including anonymous.
 */
export function useAdminActor() {
  return useActor();
}
