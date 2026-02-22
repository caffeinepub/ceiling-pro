import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';

const ADMIN_ACTOR_QUERY_KEY = 'adminActor';

/**
 * Admin-specific actor hook for /riyaz dashboard.
 * Initializes access control for anonymous sessions without requiring URL tokens.
 */
export function useAdminActor() {
  const queryClient = useQueryClient();
  
  const actorQuery = useQuery<backendInterface>({
    queryKey: [ADMIN_ACTOR_QUERY_KEY],
    queryFn: async () => {
      // Create anonymous actor (no identity required)
      const actor = await createActorWithConfig();
      
      // Initialize access control with the internal admin token
      // This allows anonymous sessions on /riyaz to have admin access
      const adminToken = 'caffeine';
      await actor._initializeAccessControlWithSecret(adminToken);
      
      return actor;
    },
    staleTime: Infinity,
    enabled: true,
  });

  // When the actor changes, invalidate dependent queries
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ADMIN_ACTOR_QUERY_KEY);
        },
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ADMIN_ACTOR_QUERY_KEY);
        },
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
