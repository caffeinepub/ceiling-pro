import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TimeSlotAvailability } from '../backend';

export function useTimeSlotAvailability() {
  const { actor, isFetching } = useActor();

  return useQuery<TimeSlotAvailability>({
    queryKey: ['timeSlotAvailability'],
    queryFn: async () => {
      if (!actor) {
        return {
          slot10am: true,
          slot1pm: true,
          slot4pm: true,
          slot7pm: true,
        };
      }
      return actor.getTimeSlotAvailability();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTimeSlotAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availability: TimeSlotAvailability) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        return await actor.updateTimeSlotAvailability(
          availability.slot10am,
          availability.slot1pm,
          availability.slot4pm,
          availability.slot7pm
        );
      } catch (error: any) {
        console.error('Failed to update time slot availability:', error);
        // If unauthorized, clear admin session
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Only admins')) {
          localStorage.removeItem('admin_session');
          queryClient.clear();
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlotAvailability'] });
    },
  });
}
