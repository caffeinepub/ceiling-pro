import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Booking } from '../backend';

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias kept for backward compatibility
export const useBookings = useGetAllBookings;

export function useGetMyBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias kept for backward compatibility
export const useMyBookings = useGetMyBookings;

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      fullName: string;
      mobileNumber: string;
      location: string;
      propertyType: string;
      service: string;
      date: string;
      timeSlot: string;
      area: number | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const areaBigInt = input.area != null ? BigInt(input.area) : null;
      return actor.createBooking(
        input.fullName,
        input.mobileNumber,
        input.location,
        input.propertyType,
        input.service,
        input.date,
        input.timeSlot,
        areaBigInt,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}
