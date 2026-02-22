import { useMutation } from '@tanstack/react-query';
import { useAdminActor } from './useAdminActor';
import { ExternalBlob } from '../backend';
import type { StoredImage } from '../backend';

export function useImageUpload() {
  const { actor } = useAdminActor();

  return useMutation({
    mutationFn: async (file: File): Promise<StoredImage> => {
      if (!actor) throw new Error('Actor not initialized');

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images only.');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB. Please upload a smaller image.');
      }

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
      // Pass null for tokenOpt - admin access is already initialized via useAdminActor
      const storedImage = await actor.uploadImage(externalBlob, path, null);
      
      return storedImage;
    },
  });
}

export function useMultipleImageUpload() {
  const { actor } = useAdminActor();

  return useMutation({
    mutationFn: async (files: File[]): Promise<StoredImage[]> => {
      if (!actor) throw new Error('Actor not initialized');

      // Validate all files first
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          throw new Error(`Invalid file type for ${file.name}. Please upload JPEG, PNG, or WebP images only.`);
        }
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds 5MB. Please upload smaller images.`);
        }
      }

      const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress for ${file.name}: ${percentage}%`);
        });

        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `/uploads/${timestamp}_${random}_${filename}`;

        // Pass null for tokenOpt - admin access is already initialized via useAdminActor
        return actor.uploadImage(externalBlob, path, null);
      });

      return Promise.all(uploadPromises);
    },
  });
}
