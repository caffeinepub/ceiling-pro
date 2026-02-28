import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, StoredImage } from '../backend';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is 5MB.`);
  }
}

export function useUploadImage(onProgress?: (percentage: number) => void) {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ file, path }: { file: File; path: string }): Promise<StoredImage> => {
      if (!actor) throw new Error('Actor not available');
      validateFile(file);

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }
      return actor.uploadImage(blob, path);
    },
  });
}

export function useUploadMultipleImages() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (
      files: Array<{ file: File; path: string }>,
    ): Promise<StoredImage[]> => {
      if (!actor) throw new Error('Actor not available');

      const results: StoredImage[] = [];
      for (const { file, path } of files) {
        validateFile(file);
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(bytes);
        const stored = await actor.uploadImage(blob, path);
        results.push(stored);
      }
      return results;
    },
  });
}
