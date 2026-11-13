import { FormEvent, useState } from 'react';
import { CategoryKey, SiteConfig } from '../data/products';
import { PageRoute } from './Navbar';
import { CareTabKey } from './ClientCareModal';

interface FooterProps {
  siteConfig: SiteConfig;
  onNavigate: (route: PageRoute) => void;
  onOpenCare: (tab: CareTabKey) => void;
  onOpenManager: () => void;
  onDownloadHtml: () => void;
}

export function Footer({
  siteConfig,
  onNavigate,
  onOpenCare,
  onOpenManager,
  onDownloadHtml,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const goCategory = (category: CategoryKey) => {
    onNavigate({ page: 'collections', category });
  };

  return (
    <footer className="bg-[#2B0E18] text-[#FCF9F4] border-t border-[#4A1828]/30 mt-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#FCF9F4]">
              {siteConfig.brandName}
            </h2>
            <p className="text-sm text-[#FCF9F4]/80 leading-relaxed max-w-sm">
              Rooted in Karachi’s luxury fashion craft, {siteConfig.brandName} creates pure silk pret, festive chiffons, winter velvet shawls, and bespoke Pakistani bridal couture.
            </p>
            <div className="pt-2 text-xs text-[#FCF9F4]/70 space-y-1">
              <p>Karachi Flagship Outlet: {siteConfig.outletAddress}</p>
              <p>Outlet Hours: {siteConfig.outletHours}</p>
              <p>
                Concierge: {siteConfig.conciergeEmail} · {siteConfig.whatsappPhone}
              </p>
            </div>
          </div>

          {/* Collections Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#E5C697]">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FCF9F4]/80">
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('all')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  All Ensembles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('luxury-pret')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Luxury Pret
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('festive-formals')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Festive Formals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('bridal-couture')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Bridal Couture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('winter-velvet')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Winter Velvet
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#E5C697]">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FCF9F4]/80">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCare('track')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCare('sizing')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Size &amp; Custom Stitching Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCare('shipping')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Shipping &amp; Cash on Delivery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCare('returns')}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Returns &amp; Alterations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'atelier' })}
                  className="hover:text-[#FCF9F4] transition-colors"
                >
                  Book Karachi Bridal Fitting
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenManager}
                  className="text-[#E5C697] hover:text-white transition-colors font-medium"
                >
                  Manage Boutique (Add / Edit Dresses)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onDownloadHtml}
                  className="text-[#E5C697] hover:text-white transition-colors font-medium"
                >
                  Download Website ZIP / HTML
                </button>
              </li>
            </ul>
          </div>

          {/* Private Preview List */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#E5C697]">
              Seasonal Previews
            </h3>
            <p className="text-sm text-[#FCF9F4]/75 leading-relaxed">
              Receive private invitations to new Eid edits, winter velvet drops, and Karachi trunk shows.
            </p>
            {subscribed ? (
              <p className="text-sm text-[#E5C697] py-2">
                Thank you. You are on the {siteConfig.brandName} preview list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for seasonal previews"
                  className="flex-1 px-3.5 py-2.5 text-sm bg-[#FCF9F4]/10 border border-[#FCF9F4]/20 text-[#FCF9F4] placeholder:text-[#FCF9F4]/50 focus:outline-none focus:border-[#E5C697] rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold tracking-wide bg-[#E5C697] text-[#2B0E18] hover:bg-[#F0D8B1] transition-colors rounded whitespace-nowrap"
                >
                  Join List
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FCF9F4]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FCF9F4]/60">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. Karachi, Pakistan.</p>
          <p>Handcrafted in Pakistan · Worldwide DHL Express &amp; Nationwide COD</p>
        </div>
      </div>
    </footer>
  );
}
