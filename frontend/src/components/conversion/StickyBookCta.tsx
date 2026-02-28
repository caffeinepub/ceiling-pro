import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface StickyBookCtaProps {
  onClick: () => void;
}

export default function StickyBookCta({ onClick }: StickyBookCtaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Button onClick={onClick} className="w-full gap-2" size="lg">
        <Calendar className="h-5 w-5" />
        Book Consultation
      </Button>
    </div>
  );
}
