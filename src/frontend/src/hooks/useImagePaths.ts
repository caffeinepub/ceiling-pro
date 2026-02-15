import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { ImagePaths, StoredImage } from '../backend';

// UI-friendly shape for rendering
export interface ImagePathsUI {
  heroImage: string;
  serviceCard1: string;
  serviceCard2: string;
  serviceCard3: string;
  serviceCard4: string;
  beforeAfterGallery: string[];
}

export function useImagePaths() {
  const { actor, isFetching } = useActor();

  return useQuery<ImagePathsUI>({
    queryKey: ['imagePaths'],
    queryFn: async () => {
      if (!actor) {
        // Return defaults when actor is not available
        return {
          heroImage: '/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png',
          serviceCard1: '/assets/generated/service-pop-gypsum.dim_1200x900.png',
          serviceCard2: '/assets/generated/service-pvc.dim_1200x900.png',
          serviceCard3: '/assets/generated/service-wall-molding.dim_1200x900.png',
          serviceCard4: '/assets/generated/service-gypsum-repair.dim_1200x900.png',
          beforeAfterGallery: [],
        };
      }
      const paths = await actor.getImagePaths();
      
      // Convert StoredImage objects to direct URLs for rendering
      return {
        heroImage: paths.heroImage || '/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png',
        serviceCard1: paths.serviceCard1 ? paths.serviceCard1.image.getDirectURL() : '/assets/generated/service-pop-gypsum.dim_1200x900.png',
        serviceCard2: paths.serviceCard2 ? paths.serviceCard2.image.getDirectURL() : '/assets/generated/service-pvc.dim_1200x900.png',
        serviceCard3: paths.serviceCard3 ? paths.serviceCard3.image.getDirectURL() : '/assets/generated/service-wall-molding.dim_1200x900.png',
        serviceCard4: paths.serviceCard4 ? paths.serviceCard4.image.getDirectURL() : '/assets/generated/service-gypsum-repair.dim_1200x900.png',
        beforeAfterGallery: paths.beforeAfterGallery.map(img => img.image.getDirectURL()),
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
      serviceCard1?: StoredImage;
      serviceCard2?: StoredImage;
      serviceCard3?: StoredImage;
      serviceCard4?: StoredImage;
      beforeAfterGallery: StoredImage[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Call backend with single object argument matching the backend signature
      return await actor.updateImagePaths({
        heroImage: data.heroImage,
        serviceCard1: data.serviceCard1,
        serviceCard2: data.serviceCard2,
        serviceCard3: data.serviceCard3,
        serviceCard4: data.serviceCard4,
        beforeAfterGallery: data.beforeAfterGallery,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagePaths'] });
    },
  });
}
