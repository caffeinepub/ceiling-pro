import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TimeSlotAvailability } from '../backend';

const DEFAULT_AVAILABILITY: TimeSlotAvailability = {
  slot10am: true,
  slot1pm: true,
  slot4pm: true,
  slot7pm: true,
};

export function useGetTimeSlotAvailability() {
  const { actor, isFetching } = useActor();

  return useQuery<TimeSlotAvailability>({
    queryKey: ['timeSlotAvailability'],
    queryFn: async () => {
      if (!actor) return DEFAULT_AVAILABILITY;
      return actor.getTimeSlotAvailability();
    },
    enabled: !!actor && !isFetching,
    placeholderData: DEFAULT_AVAILABILITY,
  });
}

// Alias kept for backward compatibility
export const useTimeSlotAvailability = useGetTimeSlotAvailability;

export function useUpdateTimeSlotAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availability: TimeSlotAvailability) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimeSlotAvailability(
        availability.slot10am,
        availability.slot1pm,
        availability.slot4pm,
        availability.slot7pm,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlotAvailability'] });
    },
  });
}
