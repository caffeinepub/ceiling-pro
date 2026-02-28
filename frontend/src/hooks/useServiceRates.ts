import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceRate } from '../backend';

const DEFAULT_RATES: ServiceRate = {
  popGypsum: BigInt(65),
  pvc: BigInt(110),
  wallMolding: BigInt(100),
};

export function useGetServiceRates() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceRate>({
    queryKey: ['serviceRates'],
    queryFn: async () => {
      if (!actor) return DEFAULT_RATES;
      return actor.getServiceRates();
    },
    enabled: !!actor && !isFetching,
    placeholderData: DEFAULT_RATES,
  });
}

// Alias kept for backward compatibility
export const useServiceRates = useGetServiceRates;

export function useUpdateServiceRates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rates: { popGypsum: number; pvc: number; wallMolding: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateServiceRates(
        BigInt(rates.popGypsum),
        BigInt(rates.pvc),
        BigInt(rates.wallMolding),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRates'] });
    },
  });
}
