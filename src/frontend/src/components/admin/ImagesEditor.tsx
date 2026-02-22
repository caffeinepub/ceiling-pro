import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useImagePaths, useUpdateImagePaths } from '../../hooks/useImagePaths';
import { useImageUpload, useMultipleImageUpload } from '../../hooks/useImageUpload';
import { Loader2, Save, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { StoredImage } from '../../backend';
import { useActor } from '../../hooks/useActor';

export default function ImagesEditor() {
  const { data: imagePathsUI, isLoading: isLoadingUI } = useImagePaths();
  const { actor, isFetching: actorFetching } = useActor();
  const updateImagePaths = useUpdateImagePaths();
  const uploadImage = useImageUpload();
  const uploadMultipleImages = useMultipleImageUpload();

  const [heroImage, setHeroImage] = useState('');
  const [serviceCard1, setServiceCard1] = useState<StoredImage | undefined>();
  const [serviceCard2, setServiceCard2] = useState<StoredImage | undefined>();
  const [serviceCard3, setServiceCard3] = useState<StoredImage | undefined>();
  const [serviceCard4, setServiceCard4] = useState<StoredImage | undefined>();
  const [galleryImages, setGalleryImages] = useState<StoredImage[]>([]);

  // Display values for inputs (showing paths)
  const [serviceCard1Display, setServiceCard1Display] = useState('');
  const [serviceCard2Display, setServiceCard2Display] = useState('');
  const [serviceCard3Display, setServiceCard3Display] = useState('');
  const [serviceCard4Display, setServiceCard4Display] = useState('');

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Load initial data from backend
  useEffect(() => {
    const loadBackendData = async () => {
      if (!actor || actorFetching) return;
      
      try {
        const backendPaths = await actor.getImagePaths();
        
        setHeroImage(backendPaths.heroImage || '');
        
        // Load StoredImage objects and their display URLs
        if (backendPaths.serviceCard1) {
          setServiceCard1(backendPaths.serviceCard1);
          setServiceCard1Display(backendPaths.serviceCard1.image.getDirectURL());
        }
        if (backendPaths.serviceCard2) {
          setServiceCard2(backendPaths.serviceCard2);
          setServiceCard2Display(backendPaths.serviceCard2.image.getDirectURL());
        }
        if (backendPaths.serviceCard3) {
          setServiceCard3(backendPaths.serviceCard3);
          setServiceCard3Display(backendPaths.serviceCard3.image.getDirectURL());
        }
        if (backendPaths.serviceCard4) {
          setServiceCard4(backendPaths.serviceCard4);
          setServiceCard4Display(backendPaths.serviceCard4.image.getDirectURL());
        }
        if (backendPaths.beforeAfterGallery) {
          setGalleryImages(backendPaths.beforeAfterGallery);
        }
      } catch (error) {
        console.error('Failed to load image paths from backend:', error);
      }
    };

    loadBackendData();
  }, [actor, actorFetching]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or WebP images only.';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size exceeds 5MB. Please upload a smaller image.';
    }

    return null;
  };

  const handleFileUpload = async (
    file: File,
    setter: (value: StoredImage) => void,
    displaySetter: (value: string) => void,
    fieldName: string,
    progressKey: string
  ) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
      
      const storedImage = await uploadImage.mutateAsync(file);
      
      setter(storedImage);
      displaySetter(storedImage.image.getDirectURL());
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
      
      toast.success(`${fieldName} uploaded successfully`);
      
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[progressKey];
          return newProgress;
        });
      }, 1000);
    } catch (error: any) {
      console.error(`Failed to upload ${fieldName}:`, error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to upload ${fieldName}: ${errorMessage}`);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[progressKey];
        return newProgress;
      });
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate all files first
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        return;
      }
    }

    try {
      const uploadedImages = await uploadMultipleImages.mutateAsync(fileArray);
      
      // Append new images to existing gallery
      setGalleryImages([...galleryImages, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Failed to upload gallery images:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to upload gallery images: ${errorMessage}`);
    }
  };

  const handleSave = async () => {
    try {
      await updateImagePaths.mutateAsync({
        heroImage,
        serviceCard1,
        serviceCard2,
        serviceCard3,
        serviceCard4,
        beforeAfterGallery: galleryImages,
      });

      toast.success('Image paths updated successfully');
    } catch (error: any) {
      console.error('Failed to update image paths:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to update image paths: ${errorMessage}`);
    }
  };

  const isLoading = isLoadingUI || actorFetching;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isSaving = updateImagePaths.isPending;
  const isUploading = uploadImage.isPending || uploadMultipleImages.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <CardTitle>Website Images</CardTitle>
        </div>
        <CardDescription>
          Upload images for hero section, service cards, and gallery. Max file size: 5MB. Supported formats: JPEG, PNG, WebP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero Background Image</Label>
          <div className="flex gap-2">
            <Input
              id="heroImage"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isUploading}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const validationError = validateFile(file);
                    if (validationError) {
                      toast.error(validationError);
                      return;
                    }
                    uploadImage.mutateAsync(file).then((storedImage) => {
                      setHeroImage(storedImage.image.getDirectURL());
                      toast.success('Hero image uploaded successfully');
                    }).catch((error: any) => {
                      console.error('Failed to upload hero image:', error);
                      const errorMessage = error?.message || 'Unknown error occurred';
                      toast.error(`Failed to upload hero image: ${errorMessage}`);
                    });
                  }
                };
                input.click();
              }}
            >
              {uploadImage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Service Card Images</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Service Card 1 */}
            <div className="space-y-2">
              <Label htmlFor="serviceCard1">Service 1 (POP & Gypsum)</Label>
              <div className="flex gap-2">
                <Input
                  id="serviceCard1"
                  value={serviceCard1Display}
                  readOnly
                  placeholder="Click upload to add image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard1, setServiceCard1Display, 'Service 1 image', 'service1');
                    };
                    input.click();
                  }}
                >
                  {uploadProgress['service1'] !== undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {serviceCard1Display && (
                <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded border">
                  <img 
                    src={serviceCard1Display} 
                    alt="Service 1 preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Service Card 2 */}
            <div className="space-y-2">
              <Label htmlFor="serviceCard2">Service 2 (PVC)</Label>
              <div className="flex gap-2">
                <Input
                  id="serviceCard2"
                  value={serviceCard2Display}
                  readOnly
                  placeholder="Click upload to add image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard2, setServiceCard2Display, 'Service 2 image', 'service2');
                    };
                    input.click();
                  }}
                >
                  {uploadProgress['service2'] !== undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {serviceCard2Display && (
                <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded border">
                  <img 
                    src={serviceCard2Display} 
                    alt="Service 2 preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Service Card 3 */}
            <div className="space-y-2">
              <Label htmlFor="serviceCard3">Service 3 (Wall Molding)</Label>
              <div className="flex gap-2">
                <Input
                  id="serviceCard3"
                  value={serviceCard3Display}
                  readOnly
                  placeholder="Click upload to add image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard3, setServiceCard3Display, 'Service 3 image', 'service3');
                    };
                    input.click();
                  }}
                >
                  {uploadProgress['service3'] !== undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {serviceCard3Display && (
                <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded border">
                  <img 
                    src={serviceCard3Display} 
                    alt="Service 3 preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Service Card 4 */}
            <div className="space-y-2">
              <Label htmlFor="serviceCard4">Service 4 (Gypsum Repair)</Label>
              <div className="flex gap-2">
                <Input
                  id="serviceCard4"
                  value={serviceCard4Display}
                  readOnly
                  placeholder="Click upload to add image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard4, setServiceCard4Display, 'Service 4 image', 'service4');
                    };
                    input.click();
                  }}
                >
                  {uploadProgress['service4'] !== undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {serviceCard4Display && (
                <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded border">
                  <img 
                    src={serviceCard4Display} 
                    alt="Service 4 preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="galleryImages">Gallery Images (Before/After)</Label>
          <div className="space-y-2">
            {galleryImages.length > 0 && (
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {galleryImages.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded border">
                      <img 
                        src={img.image.getDirectURL()} 
                        alt={`Gallery ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => {
                          setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                          toast.success('Image removed from gallery');
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) {
                    handleMultipleFileUpload(files);
                  }
                };
                input.click();
              }}
              className="w-full"
            >
              {uploadMultipleImages.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Gallery Images
                </>
              )}
            </Button>
          </div>
        </div>

        {(uploadImage.isError || uploadMultipleImages.isError || updateImagePaths.isError) && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error occurred</p>
              <p className="text-xs mt-1">
                {uploadImage.error?.message || uploadMultipleImages.error?.message || updateImagePaths.error?.message || 'An unknown error occurred'}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isUploading}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
