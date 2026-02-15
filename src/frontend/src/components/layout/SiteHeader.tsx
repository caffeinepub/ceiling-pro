import { Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';
import { Link, useNavigate } from '@tanstack/react-router';

export default function SiteHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">Ceiling Pro</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/account' })}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Account
            </Button>
          </nav>
          <Button asChild size="sm" className="gap-2">
            <a href={`tel:${CEILING_PRO_CONFIG.phone}`} aria-label="Call Ceiling Pro">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{CEILING_PRO_CONFIG.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
