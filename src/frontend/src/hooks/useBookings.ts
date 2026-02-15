import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking } from '../backend';

export function useBookings() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllBookings();
      } catch (error: any) {
        console.error('Failed to fetch bookings:', error);
        // If unauthorized, clear admin session
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Only admins')) {
          localStorage.removeItem('admin_session');
          queryClient.clear();
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useMyBookings() {
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
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}
