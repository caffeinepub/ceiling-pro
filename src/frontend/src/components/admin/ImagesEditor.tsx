import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useImagePaths, useUpdateImagePaths } from '../../hooks/useImagePaths';
import { useImageUpload, useMultipleImageUpload } from '../../hooks/useImageUpload';
import { Loader2, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { StoredImage } from '../../backend';

export default function ImagesEditor() {
  const { data: imagePaths, isLoading } = useImagePaths();
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

  useEffect(() => {
    if (imagePaths) {
      setHeroImage(imagePaths.heroImage || '');
      setServiceCard1Display(imagePaths.serviceCard1 || '');
      setServiceCard2Display(imagePaths.serviceCard2 || '');
      setServiceCard3Display(imagePaths.serviceCard3 || '');
      setServiceCard4Display(imagePaths.serviceCard4 || '');
    }
  }, [imagePaths]);

  const handleFileUpload = async (
    file: File,
    setter: (value: StoredImage) => void,
    displaySetter: (value: string) => void,
    fieldName: string
  ) => {
    try {
      const storedImage = await uploadImage.mutateAsync(file);
      setter(storedImage);
      displaySetter(storedImage.image.getDirectURL());
      toast.success(`${fieldName} uploaded successfully`);
    } catch (error) {
      console.error(`Failed to upload ${fieldName}:`, error);
      toast.error(`Failed to upload ${fieldName}`);
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    try {
      const fileArray = Array.from(files);
      const uploadedImages = await uploadMultipleImages.mutateAsync(fileArray);
      
      // Append new images to existing gallery
      setGalleryImages([...galleryImages, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload gallery images:', error);
      toast.error('Failed to upload gallery images');
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
    } catch (error) {
      console.error('Failed to update image paths:', error);
      toast.error('Failed to update image paths');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <CardTitle>Website Images</CardTitle>
        </div>
        <CardDescription>
          Upload images for hero section, service cards, and gallery
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
              disabled={uploadImage.isPending}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    uploadImage.mutateAsync(file).then((storedImage) => {
                      setHeroImage(storedImage.image.getDirectURL());
                      toast.success('Hero image uploaded successfully');
                    }).catch((error) => {
                      console.error('Failed to upload hero image:', error);
                      toast.error('Failed to upload hero image');
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
                  disabled={uploadImage.isPending}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard1, setServiceCard1Display, 'Service 1 image');
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
                  disabled={uploadImage.isPending}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard2, setServiceCard2Display, 'Service 2 image');
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
                  disabled={uploadImage.isPending}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard3, setServiceCard3Display, 'Service 3 image');
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
                  disabled={uploadImage.isPending}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, setServiceCard4, setServiceCard4Display, 'Service 4 image');
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
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="galleryImages">Gallery Images</Label>
          <div className="space-y-2">
            {galleryImages.length > 0 && (
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {galleryImages.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded border">
                      <img 
                        src={img.image.getDirectURL()} 
                        alt={`Gallery ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadMultipleImages.isPending}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) handleMultipleFileUpload(files);
                };
                input.click();
              }}
              className="w-full gap-2"
            >
              {uploadMultipleImages.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Gallery Images
                </>
              )}
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} disabled={updateImagePaths.isPending} className="w-full gap-2">
          {updateImagePaths.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Image Paths
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
