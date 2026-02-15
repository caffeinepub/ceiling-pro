import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServiceRate } from '../backend';

export function useServiceRates() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceRate>({
    queryKey: ['serviceRates'],
    queryFn: async () => {
      if (!actor) {
        return {
          popGypsum: BigInt(65),
          pvc: BigInt(110),
          wallMolding: BigInt(100),
        };
      }
      return actor.getServiceRates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateServiceRates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rates: { popGypsum: bigint; pvc: bigint; wallMolding: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        return await actor.updateServiceRates(rates.popGypsum, rates.pvc, rates.wallMolding);
      } catch (error: any) {
        console.error('Failed to update service rates:', error);
        // If unauthorized, clear admin session
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Only admins')) {
          localStorage.removeItem('admin_session');
          queryClient.clear();
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRates'] });
    },
  });
}
