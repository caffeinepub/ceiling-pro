import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminActor } from './useAdminActor';
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
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rates: { popGypsum: bigint; pvc: bigint; wallMolding: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      // Pass null for tokenOpt - admin access is already initialized via useAdminActor
      return await actor.updateServiceRates(rates.popGypsum, rates.pvc, rates.wallMolding, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRates'] });
    },
  });
}
