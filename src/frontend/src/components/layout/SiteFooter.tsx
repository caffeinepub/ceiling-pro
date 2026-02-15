import { Heart } from 'lucide-react';
import { CEILING_PRO_CONFIG } from '../../config/ceilingPro';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'ceiling-pro';

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Ceiling Pro</h3>
            <p className="text-sm text-muted-foreground">
              Premium false ceiling services for homes and offices. Affordable, professional, and on-time delivery.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Phone: {CEILING_PRO_CONFIG.phone}</p>
              <p>Email: {CEILING_PRO_CONFIG.email}</p>
              <p>GST: {CEILING_PRO_CONFIG.gst}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>POP & Gypsum False Ceiling</li>
              <li>PVC Ceiling Installation</li>
              <li>Wall Molding & Decorative Panels</li>
              <li>Gypsum Ceiling Repairing</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Ceiling Pro. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
