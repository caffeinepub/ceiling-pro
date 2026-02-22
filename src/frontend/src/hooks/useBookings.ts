import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminActor } from './useAdminActor';
import type { Booking } from '../backend';

export function useBookings() {
  const { actor, isFetching } = useAdminActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Pass null for tokenOpt - admin access is already initialized via useAdminActor
      return await actor.getAllBookings(null);
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
      if (!actor) throw new Error('Actor not initialized');
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
