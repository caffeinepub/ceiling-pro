import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ImagePaths } from '../backend';

export function useImagePaths() {
  const { actor, isFetching } = useActor();

  return useQuery<ImagePaths>({
    queryKey: ['imagePaths'],
    queryFn: async () => {
      if (!actor) {
        // Return defaults when actor is not available
        return {
          heroImage: '/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png',
          serviceCard1: '/images/service1.jpg',
          serviceCard2: '/images/service2.jpg',
          serviceCard3: '/images/service3.jpg',
          serviceCard4: '/images/service4.jpg',
          beforeAfterGallery: [],
        };
      }
      const paths = await actor.getImagePaths();
      // Apply defaults for empty values
      return {
        heroImage: paths.heroImage || '/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png',
        serviceCard1: paths.serviceCard1 || '/images/service1.jpg',
        serviceCard2: paths.serviceCard2 || '/images/service2.jpg',
        serviceCard3: paths.serviceCard3 || '/images/service3.jpg',
        serviceCard4: paths.serviceCard4 || '/images/service4.jpg',
        beforeAfterGallery: paths.beforeAfterGallery.length > 0 ? paths.beforeAfterGallery : [],
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateImagePaths() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      heroImage: string;
      serviceCard1: string;
      serviceCard2: string;
      serviceCard3: string;
      serviceCard4: string;
      beforeAfterGallery: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        return await actor.updateImagePaths(
          data.heroImage,
          data.serviceCard1,
          data.serviceCard2,
          data.serviceCard3,
          data.serviceCard4,
          data.beforeAfterGallery
        );
      } catch (error: any) {
        console.error('Failed to update image paths:', error);
        // If unauthorized, clear admin session
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Only admins')) {
          localStorage.removeItem('admin_session');
          queryClient.clear();
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagePaths'] });
    },
  });
}
