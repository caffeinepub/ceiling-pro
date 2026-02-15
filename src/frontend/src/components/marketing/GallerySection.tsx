import Section from './Section';

const GALLERY_ITEMS = [
  {
    id: 'before-1',
    type: 'before',
    imagePath: '/assets/generated/gallery-before-1.dim_1200x900.png',
    label: 'Before',
  },
  {
    id: 'after-1',
    type: 'after',
    imagePath: '/assets/generated/gallery-after-1.dim_1200x900.png',
    label: 'After',
  },
];

export default function GallerySection() {
  return (
    <Section variant="grey">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Before & After Gallery</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          See the transformation we bring to your spaces
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {GALLERY_ITEMS.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg bg-background shadow-md">
            <div className="relative aspect-[4/3]">
              <img src={item.imagePath} alt={item.label} className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <span className="text-lg font-semibold text-white">{item.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
