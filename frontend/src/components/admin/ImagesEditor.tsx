import React, { useState, useRef } from 'react';
import { useGetImagePaths, useUpdateImagePaths } from '../../hooks/useImagePaths';
import { useUploadImage } from '../../hooks/useImageUpload';
import { StoredImage } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, Save, Image as ImageIcon } from 'lucide-react';

type ImageSlot = {
  key: 'serviceCard1' | 'serviceCard2' | 'serviceCard3' | 'serviceCard4';
  label: string;
  path: string;
};

const SERVICE_SLOTS: ImageSlot[] = [
  { key: 'serviceCard1', label: 'Service Card 1 (POP & Gypsum)', path: 'service-card-1' },
  { key: 'serviceCard2', label: 'Service Card 2 (PVC)', path: 'service-card-2' },
  { key: 'serviceCard3', label: 'Service Card 3 (Wall Molding)', path: 'service-card-3' },
  { key: 'serviceCard4', label: 'Service Card 4 (Gypsum Repair)', path: 'service-card-4' },
];

function ImagePreview({ storedImage }: { storedImage?: StoredImage }) {
  if (!storedImage) return (
    <div className="w-20 h-14 rounded border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
      <ImageIcon className="h-5 w-5 text-gray-300" />
    </div>
  );
  const url = storedImage.image.getDirectURL();
  return (
    <img
      src={url}
      alt={storedImage.path}
      className="w-20 h-14 object-cover rounded border border-gray-200"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

export default function ImagesEditor() {
  const { data: imagePaths, isLoading } = useGetImagePaths();
  const updateImagePaths = useUpdateImagePaths();
  const uploadImage = useUploadImage();

  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  React.useEffect(() => {
    if (imagePaths) {
      setHeroImageUrl(imagePaths.heroImage || '');
    }
  }, [imagePaths]);

  const handleFileUpload = async (slot: ImageSlot, file: File) => {
    setUploadErrors(prev => ({ ...prev, [slot.key]: '' }));
    setUploadProgress(prev => ({ ...prev, [slot.key]: 0 }));

    try {
      const { ExternalBlob } = await import('../../backend');
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let blob = ExternalBlob.fromBytes(bytes);
      blob = blob.withUploadProgress((pct) => {
        setUploadProgress(prev => ({ ...prev, [slot.key]: pct }));
      });

      const stored = await uploadImage.mutateAsync({ file, path: slot.path });

      if (!imagePaths) return;
      await updateImagePaths.mutateAsync({
        heroImage: heroImageUrl || imagePaths.heroImage,
        serviceCard1: slot.key === 'serviceCard1' ? stored : imagePaths.serviceCard1,
        serviceCard2: slot.key === 'serviceCard2' ? stored : imagePaths.serviceCard2,
        serviceCard3: slot.key === 'serviceCard3' ? stored : imagePaths.serviceCard3,
        serviceCard4: slot.key === 'serviceCard4' ? stored : imagePaths.serviceCard4,
        beforeAfterGallery: imagePaths.beforeAfterGallery,
      });

      setUploadProgress(prev => ({ ...prev, [slot.key]: 100 }));
      setTimeout(() => setUploadProgress(prev => ({ ...prev, [slot.key]: 0 })), 2000);
    } catch (err: unknown) {
      setUploadErrors(prev => ({ ...prev, [slot.key]: String(err) }));
      setUploadProgress(prev => ({ ...prev, [slot.key]: 0 }));
    }
  };

  const handleSaveHeroUrl = async () => {
    if (!imagePaths) return;
    setSaved(false);
    await updateImagePaths.mutateAsync({
      heroImage: heroImageUrl,
      serviceCard1: imagePaths.serviceCard1,
      serviceCard2: imagePaths.serviceCard2,
      serviceCard3: imagePaths.serviceCard3,
      serviceCard4: imagePaths.serviceCard4,
      beforeAfterGallery: imagePaths.beforeAfterGallery,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Images Editor</h2>
        <p className="text-sm text-gray-500">Manage hero and service card images</p>
      </div>

      <div className="px-6 py-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading images…
          </div>
        ) : (
          <>
            {/* Hero Image URL */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Hero Background Image URL</Label>
              <div className="flex gap-3">
                <Input
                  value={heroImageUrl}
                  onChange={e => setHeroImageUrl(e.target.value)}
                  placeholder="/assets/generated/ceilingpro-hero-bg.dim_1920x1080.png"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveHeroUrl}
                  disabled={updateImagePaths.isPending}
                  size="sm"
                >
                  {updateImagePaths.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {saved && <p className="text-sm text-green-600 font-medium">✓ Hero image URL saved!</p>}
            </div>

            {/* Service Card Images */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Service Card Images</Label>
              <div className="space-y-4">
                {SERVICE_SLOTS.map(slot => (
                  <div key={slot.key} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <ImagePreview storedImage={imagePaths?.[slot.key]} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">{slot.label}</p>
                      {uploadProgress[slot.key] > 0 && uploadProgress[slot.key] < 100 && (
                        <div className="mt-2">
                          <Progress value={uploadProgress[slot.key]} className="h-1.5" />
                          <p className="text-xs text-gray-400 mt-1">{uploadProgress[slot.key]}%</p>
                        </div>
                      )}
                      {uploadErrors[slot.key] && (
                        <p className="text-xs text-red-500 mt-1">{uploadErrors[slot.key]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        ref={el => { fileInputRefs.current[slot.key] = el; }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(slot, file);
                          e.target.value = '';
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[slot.key]?.click()}
                        disabled={uploadProgress[slot.key] > 0 && uploadProgress[slot.key] < 100}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
