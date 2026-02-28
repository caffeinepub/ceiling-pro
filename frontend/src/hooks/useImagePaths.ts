import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ImagePaths, StoredImage } from '../backend';

export function useGetImagePaths() {
  const { actor, isFetching } = useActor();

  return useQuery<ImagePaths>({
    queryKey: ['imagePaths'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getImagePaths();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias kept for backward compatibility — consumers that call useImagePaths()
// and access .heroImage, .serviceCard1…4, .beforeAfterGallery still work
// because the raw ImagePaths shape matches what they expect.
export const useImagePaths = useGetImagePaths;

export function useUpdateImagePaths() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imagePathsInput: {
      heroImage: string;
      serviceCard1?: StoredImage;
      serviceCard2?: StoredImage;
      serviceCard3?: StoredImage;
      serviceCard4?: StoredImage;
      beforeAfterGallery: StoredImage[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateImagePaths(imagePathsInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagePaths'] });
    },
  });
}
