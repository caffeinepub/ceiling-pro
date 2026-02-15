import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';
import { Link } from '@tanstack/react-router';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">Ceiling Pro</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="gap-2">
            <a href={`tel:${CEILING_PRO_CONFIG.phone}`} aria-label="Call Ceiling Pro">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </Button>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
