import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { CategoryKey } from '../data/products';

export type PageRoute =
  | { page: 'home' }
  | { page: 'collections'; category: CategoryKey }
  | { page: 'product'; productId: string }
  | { page: 'atelier' };

interface NavbarProps {
  brandName: string;
  announcementText: string;
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  bagCount: number;
  onOpenBag: () => void;
}

export function Navbar({
  brandName,
  announcementText,
  currentRoute,
  onNavigate,
  bagCount,
  onOpenBag,
}: NavbarProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNavActive = (key: string) => {
    if (key === 'home' && currentRoute.page === 'home') return true;
    if (
      key === 'collections' &&
      currentRoute.page === 'collections' &&
      currentRoute.category === 'all'
    ) {
      return true;
    }
    if (
      key === 'luxury-pret' &&
      currentRoute.page === 'collections' &&
      currentRoute.category === 'luxury-pret'
    ) {
      return true;
    }
    if (
      key === 'bridal-formal' &&
      currentRoute.page === 'collections' &&
      (currentRoute.category === 'bridal-couture' ||
        currentRoute.category === 'festive-formals')
    ) {
      return true;
    }
    if (key === 'atelier' && currentRoute.page === 'atelier') return true;
    return false;
  };

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {bannerVisible && (
        <div className="bg-[#4A1828] text-[#FCF9F4] text-xs py-2 px-4 flex items-center justify-center relative">
          <p className="text-center tracking-wide pr-6 truncate">
            {announcementText}
          </p>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FCF9F4]/75 hover:text-[#FCF9F4] p-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FCF9F4]/95 backdrop-blur-md border-b border-[#4A1828]/12">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-14 md:h-[68px] flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 -ml-2 text-[#4A1828] hover:bg-[#4A1828]/5 rounded transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'home' })}
              className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#4A1828] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67C46] rounded"
            >
              {brandName}
            </button>
          </div>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6A5A5E]"
          >
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'home' })}
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                isNavActive('home')
                  ? 'text-[#4A1828] border-[#4A1828]'
                  : 'border-transparent hover:text-[#4A1828] hover:border-[#4A1828]/35'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'collections', category: 'all' })}
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                isNavActive('collections')
                  ? 'text-[#4A1828] border-[#4A1828]'
                  : 'border-transparent hover:text-[#4A1828] hover:border-[#4A1828]/35'
              }`}
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'luxury-pret' })
              }
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                isNavActive('luxury-pret')
                  ? 'text-[#4A1828] border-[#4A1828]'
                  : 'border-transparent hover:text-[#4A1828] hover:border-[#4A1828]/35'
              }`}
            >
              Luxury Pret
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'bridal-couture' })
              }
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                isNavActive('bridal-formal')
                  ? 'text-[#4A1828] border-[#4A1828]'
                  : 'border-transparent hover:text-[#4A1828] hover:border-[#4A1828]/35'
              }`}
            >
              Bridal &amp; Formal
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'atelier' })}
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                isNavActive('atelier')
                  ? 'text-[#4A1828] border-[#4A1828]'
                  : 'border-transparent hover:text-[#4A1828] hover:border-[#4A1828]/35'
              }`}
            >
              Karachi Outlet
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenBag}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide bg-[#4A1828] text-[#FCF9F4] hover:bg-[#38111E] transition-colors rounded whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67C46]"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-[#4A1828]/12 bg-[#FCF9F4] px-4 py-4 flex flex-col gap-1"
          >
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'home' })}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'collections', category: 'all' })}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              All Collections
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'luxury-pret' })
              }
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Luxury Pret
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'festive-formals' })
              }
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Festive Formals
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'bridal-couture' })
              }
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Bridal Couture
            </button>
            <button
              type="button"
              onClick={() =>
                handleLinkClick({ page: 'collections', category: 'winter-velvet' })
              }
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Winter Velvet
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick({ page: 'atelier' })}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] rounded"
            >
              Karachi Outlet &amp; Appointments
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
