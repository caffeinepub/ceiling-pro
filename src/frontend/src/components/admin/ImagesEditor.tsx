import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useImagePaths, useUpdateImagePaths } from '../../hooks/useImagePaths';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ImagesEditor() {
  const { data: imagePaths, isLoading } = useImagePaths();
  const updateImagePaths = useUpdateImagePaths();

  const [heroImage, setHeroImage] = useState('');
  const [serviceCard1, setServiceCard1] = useState('');
  const [serviceCard2, setServiceCard2] = useState('');
  const [serviceCard3, setServiceCard3] = useState('');
  const [serviceCard4, setServiceCard4] = useState('');
  const [galleryImages, setGalleryImages] = useState('');

  useEffect(() => {
    if (imagePaths) {
      setHeroImage(imagePaths.heroImage || '');
      setServiceCard1(imagePaths.serviceCard1 || '');
      setServiceCard2(imagePaths.serviceCard2 || '');
      setServiceCard3(imagePaths.serviceCard3 || '');
      setServiceCard4(imagePaths.serviceCard4 || '');
      setGalleryImages(imagePaths.beforeAfterGallery.join('\n') || '');
    }
  }, [imagePaths]);

  const handleSave = async () => {
    try {
      const galleryArray = galleryImages
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      await updateImagePaths.mutateAsync({
        heroImage,
        serviceCard1,
        serviceCard2,
        serviceCard3,
        serviceCard4,
        beforeAfterGallery: galleryArray,
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
          Manage image paths for hero section, service cards, and gallery. Use paths like /assets/generated/image.png
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero Background Image</Label>
          <Input
            id="heroImage"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Service Card Images</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serviceCard1">Service 1 (POP & Gypsum)</Label>
              <Input
                id="serviceCard1"
                value={serviceCard1}
                onChange={(e) => setServiceCard1(e.target.value)}
                placeholder="/images/service1.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCard2">Service 2 (PVC)</Label>
              <Input
                id="serviceCard2"
                value={serviceCard2}
                onChange={(e) => setServiceCard2(e.target.value)}
                placeholder="/images/service2.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCard3">Service 3 (Wall Molding)</Label>
              <Input
                id="serviceCard3"
                value={serviceCard3}
                onChange={(e) => setServiceCard3(e.target.value)}
                placeholder="/images/service3.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCard4">Service 4 (Gypsum Repair)</Label>
              <Input
                id="serviceCard4"
                value={serviceCard4}
                onChange={(e) => setServiceCard4(e.target.value)}
                placeholder="/images/service4.jpg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="galleryImages">Gallery Images (one path per line)</Label>
          <textarea
            id="galleryImages"
            value={galleryImages}
            onChange={(e) => setGalleryImages(e.target.value)}
            placeholder="/assets/generated/gallery-before-1.dim_1200x900.png&#10;/assets/generated/gallery-after-1.dim_1200x900.png"
            className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={5}
          />
          <p className="text-xs text-muted-foreground">
            Enter image paths, one per line. Leave empty to use defaults.
          </p>
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
