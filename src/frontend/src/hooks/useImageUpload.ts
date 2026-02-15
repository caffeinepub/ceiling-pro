import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { StoredImage } from '../backend';

export function useImageUpload() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (file: File): Promise<StoredImage> => {
      if (!actor) throw new Error('Actor not initialized');

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob from bytes with upload progress tracking
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        console.log(`Upload progress: ${percentage}%`);
      });

      // Generate a unique path for the uploaded image
      const timestamp = Date.now();
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = `/uploads/${timestamp}_${filename}`;

      // Upload to backend blob storage
      const storedImage = await actor.uploadImage(externalBlob, path);
      
      return storedImage;
    },
  });
}

export function useMultipleImageUpload() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (files: File[]): Promise<StoredImage[]> => {
      if (!actor) throw new Error('Actor not initialized');

      const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress for ${file.name}: ${percentage}%`);
        });

        const timestamp = Date.now();
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `/uploads/${timestamp}_${filename}`;

        return actor.uploadImage(externalBlob, path);
      });

      return Promise.all(uploadPromises);
    },
  });
}
