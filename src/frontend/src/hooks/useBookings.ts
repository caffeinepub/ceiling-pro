import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking } from '../backend';

export function useBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      mobileNumber: string;
      location: string;
      propertyType: string;
      service: string;
      date: string;
      timeSlot: string;
      area: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBooking(
        data.fullName,
        data.mobileNumber,
        data.location,
        data.propertyType,
        data.service,
        data.date,
        data.timeSlot,
        BigInt(data.area)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
