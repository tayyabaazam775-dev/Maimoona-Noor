import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { AtelierView } from './components/AtelierView';
import { CartDrawer } from './components/CartDrawer';
import { CatalogManagerModal } from './components/CatalogManagerModal';
import { CareTabKey, ClientCareModal } from './components/ClientCareModal';
import { ExportPackageModal } from './components/ExportPackageModal';
import { Footer } from './components/Footer';
import { LookbookVideoSection } from './components/LookbookVideoSection';
import { Navbar, PageRoute } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { ResilientImage } from './components/ResilientImage';
import {
  CATEGORY_TABS,
  CLIENT_TESTIMONIALS,
  CategoryKey,
  CurrencyCode,
  DEFAULT_SITE_CONFIG,
  HERO_MEDIA,
  PRODUCTS,
  ProductItem,
  SiteConfig,
} from './data/products';
import { CartItem, CustomMeasurements, DressSize, OrderRecord } from './types';

const STORAGE_PRODUCTS_KEY = 'mnf_karachi_products_v1';
const STORAGE_SITE_KEY = 'mnf_karachi_site_config_v1';

const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'MNF-1042',
    createdAt: 'Nov 10, 2026',
    customerName: 'Hira Salman',
    phone: '+92 300 555 0192',
    city: 'Clifton, Karachi',
    address: 'Block 4, Clifton, Karachi',
    paymentMethod: 'Cash on Delivery (COD)',
    items: [],
    subtotalPKR: 44000,
    shippingPKR: 0,
    totalPKR: 44000,
    statusStep: 2,
  },
];

function loadSavedProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (!raw) return PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

function loadSavedSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_SITE_KEY);
    if (!raw) return DEFAULT_SITE_CONFIG;
    return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export default function App() {
  const [products, setProducts] = useState<ProductItem[]>(loadSavedProducts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(loadSavedSiteConfig);

  const [route, setRoute] = useState<PageRoute>({ page: 'home' });
  const [homeCategory, setHomeCategory] = useState<CategoryKey>('all');
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const [editMode, setEditMode] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [managerEditingId, setManagerEditingId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [careModalOpen, setCareModalOpen] = useState(false);
  const [careTab, setCareTab] = useState<CareTabKey>('track');
  const [trackedOrderQuery, setTrackedOrderQuery] = useState('MNF-1042');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SITE_KEY, JSON.stringify(siteConfig));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [siteConfig]);

  const navigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (route.page === 'collections') {
      setSearchQuery('');
    }
  }, [route.page]);

  const bagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBag = (
    product: ProductItem,
    size: DressSize,
    quantity: number,
    customMeasurements?: CustomMeasurements
  ) => {
    const signature = customMeasurements
      ? `${product.id}-${size}-${JSON.stringify(customMeasurements)}`
      : `${product.id}-${size}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === signature);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === signature
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: signature,
          product,
          size,
          quantity,
          customMeasurements,
        },
      ];
    });
    setBagOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
  };

  const handleOpenCare = (tab: CareTabKey, orderNum?: string) => {
    setCareTab(tab);
    if (orderNum) setTrackedOrderQuery(orderNum);
    setCareModalOpen(true);
  };

  // Catalog CRUD Handlers
  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (route.page === 'product' && route.productId === productId) {
      navigate({ page: 'collections', category: 'all' });
    }
  };

  const handleResetDefaults = () => {
    setProducts(PRODUCTS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
  };

  const openManagerForNewOrList = () => {
    setManagerEditingId(null);
    setManagerOpen(true);
  };

  const openManagerForProduct = (productId: string) => {
    setManagerEditingId(productId);
    setManagerOpen(true);
  };

  const activeCategory: CategoryKey =
    route.page === 'collections' ? route.category : homeCategory;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCat =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.fabric.toLowerCase().includes(q) ||
        product.colorTone.toLowerCase().includes(q) ||
        product.collectionName.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.pricePKR - b.pricePKR);
    }
    if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => b.pricePKR - a.pricePKR);
    }
    return filtered;
  }, [products, activeCategory, searchQuery, sortBy]);

  const selectedProduct =
    route.page === 'product'
      ? products.find((p) => p.id === route.productId) || products[0] || null
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F4] text-[#21171A]">
      <Navbar
        brandName={siteConfig.brandName}
        announcementText={siteConfig.announcementText}
        currentRoute={route}
        onNavigate={navigate}
        bagCount={bagCount}
        onOpenBag={() => setBagOpen(true)}
      />

      <main className="flex-1">
        {route.page === 'home' && (
          <>
            {/* Section 1: Campaign Hero */}
            <section className="relative w-full overflow-hidden bg-[#2B0E18]">
              <div className="relative h-[74vh] min-h-[500px] max-h-[760px] w-full">
                <ResilientImage
                  src={siteConfig.heroImage}
                  alt={`${siteConfig.brandName} — ${siteConfig.heroTitle}`}
                  fallbackTitle={siteConfig.brandName}
                  className="w-full h-full object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#240B14]/88 via-[#240B14]/35 to-black/15"
                />

                <div className="absolute inset-0 max-w-[1320px] mx-auto px-4 sm:px-8 flex flex-col justify-end pb-12 sm:pb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl space-y-4 text-[#FCF9F4]"
                  >
                    <p className="text-xs sm:text-sm tracking-widest uppercase text-[#E5C697]">
                      {siteConfig.heroKicker}
                    </p>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.06] text-balance">
                      {siteConfig.heroTitle}
                    </h1>
                    <p className="text-sm sm:text-base text-[#FCF9F4]/90 max-w-xl leading-relaxed">
                      {siteConfig.heroSubtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ page: 'collections', category: 'all' })
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5C697] text-[#2B0E18] text-sm font-semibold tracking-wide hover:bg-[#F0D8B1] transition-colors rounded"
                      >
                        <span>Explore Collections</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate({ page: 'atelier' })}
                        className="px-6 py-3 border border-[#FCF9F4]/60 text-[#FCF9F4] text-sm font-medium tracking-wide hover:bg-[#FCF9F4]/12 transition-colors rounded"
                      >
                        Visit Karachi Outlet
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Scrolling Luxury Brand Marquee */}
            <div
              aria-label="Maimoona Noor Fashion Highlights"
              className="bg-[#2B0E18] text-[#E5C697] border-y border-[#E5C697]/20 overflow-hidden py-2.5 text-xs tracking-widest uppercase"
            >
              <div className="animate-marquee">
                <span className="px-8 whitespace-nowrap">
                  {siteConfig.brandName} · Karachi Flagship Outlet · Pure Silk &amp; Zardozi · Custom Tailoring · Cash on Delivery Across Pakistan · Worldwide DHL Express
                </span>
                <span className="px-8 whitespace-nowrap" aria-hidden="true">
                  {siteConfig.brandName} · Karachi Flagship Outlet · Pure Silk &amp; Zardozi · Custom Tailoring · Cash on Delivery Across Pakistan · Worldwide DHL Express
                </span>
              </div>
            </div>

            {/* Section 2: Featured Pakistani Ensembles Grid */}
            <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#4A1828]/12 pb-6">
                <div className="space-y-2 max-w-xl">
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#21171A]">
                    Signature Pakistani Ensembles
                  </h2>
                  <p className="text-sm text-[#6A5A5E]">
                    Crafted at our Karachi outlet with pure silk finishings, custom measurements, and nationwide Cash on Delivery.
                  </p>
                </div>

                {/* Search, Currency & Boutique Studio Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#6A5A5E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dresses or fabric..."
                      aria-label="Search Pakistani dresses"
                      className="pl-8 pr-3 py-2 text-xs bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A] placeholder:text-[#6A5A5E] w-44 sm:w-52 focus:outline-none focus:border-[#4A1828]"
                    />
                  </div>

                  <label className="sr-only" htmlFor="currency-select-home">
                    Currency
                  </label>
                  <select
                    id="currency-select-home"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="px-3 py-2 text-xs font-medium bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A]"
                  >
                    <option value="PKR">PKR (Pakistan)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setEditMode((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded border transition-colors ${
                      editMode
                        ? 'bg-[#4A1828] text-[#FCF9F4] border-[#4A1828]'
                        : 'bg-[#FCF9F4] text-[#4A1828] border-[#4A1828]/25 hover:bg-[#F4ECE4]'
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{editMode ? 'Editing On' : 'Edit Store'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={openManagerForNewOrList}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#A67C46] text-[#FCF9F4] rounded hover:bg-[#8E6837] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manage Dresses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#FCF9F4] text-[#4A1828] border border-[#4A1828]/25 rounded hover:bg-[#F4ECE4] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export ZIP / HTML</span>
                  </button>
                </div>
              </div>

              {/* Interactive Category Filter Tabs */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setHomeCategory(tab.key)}
                      className={`px-4 py-2 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                        homeCategory === tab.key
                          ? 'bg-[#4A1828] text-[#FCF9F4]'
                          : 'bg-[#F4ECE4] text-[#6A5A5E] hover:text-[#4A1828]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {editMode && (
                  <p className="text-xs text-[#4A1828] font-medium">
                    Edit Mode active: Use Edit or Delete on any dress card, or click Manage Dresses to add new photos.
                  </p>
                )}
              </div>

              {/* 3-Column Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-14 text-center border border-[#4A1828]/12 bg-[#F4ECE4]/60 rounded space-y-3">
                  <p className="font-serif text-xl text-[#21171A]">
                    No ensembles matched your search
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setHomeCategory('all');
                    }}
                    className="px-5 py-2 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      editMode={editMode}
                      onSelectProduct={(id) =>
                        navigate({ page: 'product', productId: id })
                      }
                      onQuickAdd={(prod) => handleAddToBag(prod, 'M', 1)}
                      onEditProduct={openManagerForProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2.5: Campaign Film Reel & Animated Craftsmanship Progress */}
            <div className="border-t border-[#4A1828]/10">
              <LookbookVideoSection
                products={products}
                siteConfig={siteConfig}
                onExploreCollections={() =>
                  navigate({ page: 'collections', category: 'all' })
                }
              />
            </div>

            {/* Section 3: Craftsmanship Split & Adjacent Client Proof */}
            <section className="bg-[#F4ECE4] border-y border-[#4A1828]/12">
              <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
                  <div className="lg:col-span-6">
                    <div className="h-full min-h-[320px] overflow-hidden border border-[#4A1828]/15 bg-[#FCF9F4]">
                      <ResilientImage
                        src={HERO_MEDIA.atelierImage}
                        alt="Master karigar hands embroidering traditional zardozi and dabka on a wooden adda frame at our Karachi atelier"
                        fallbackTitle="Karachi Zardozi Craftsmanship"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
                    <p className="text-xs font-medium tracking-widest uppercase text-[#A67C46]">
                      DHA Phase 5, Karachi · Artisanal Heritage
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#21171A] leading-tight text-balance">
                      Tailored by Master Karigars, Delivered From Our Karachi Outlet
                    </h2>
                    <p className="text-sm sm:text-base text-[#3B2E32] leading-relaxed">
                      From breathable cotton-net chikankari for Karachi afternoons to heirloom dabka and zardozi on pure velvet for barat evenings, every {siteConfig.brandName} garment preserves authentic Pakistani craft with bespoke sizing.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate({ page: 'atelier' })}
                        className="px-6 py-3 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium rounded hover:bg-[#38111E] transition-colors"
                      >
                        Visit Karachi Outlet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenCare('sizing')}
                        className="px-6 py-3 border border-[#4A1828]/30 text-[#4A1828] text-sm font-medium rounded hover:bg-[#FCF9F4] transition-colors"
                      >
                        Size &amp; Custom Stitching Guide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Adjacent Client Proof */}
                <div className="pt-10 border-t border-[#4A1828]/12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CLIENT_TESTIMONIALS.map((review) => (
                    <div
                      key={review.name}
                      className="p-6 bg-[#FCF9F4] border border-[#4A1828]/10 space-y-3"
                    >
                      <p className="text-sm text-[#3B2E32] leading-relaxed">
                        “{review.quote}”
                      </p>
                      <div className="pt-2 border-t border-[#4A1828]/10 text-xs text-[#6A5A5E]">
                        <span className="font-semibold text-[#4A1828]">
                          {review.name}
                        </span>{' '}
                        · {review.city} · {review.occasion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {route.page === 'collections' && (
          <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#4A1828]/12 pb-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest uppercase text-[#A67C46]">
                  {siteConfig.brandName} · Karachi Catalog
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#21171A]">
                  {CATEGORY_TABS.find((t) => t.key === route.category)?.label ||
                    'All Collections'}
                </h1>
                <p className="text-sm text-[#6A5A5E] max-w-2xl">
                  Authentic Pakistani silhouettes crafted in pure raw silk, crinkle chiffon, organza, cotton-net, and micro-velvet with bespoke sizing options.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditMode((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded border transition-colors ${
                    editMode
                      ? 'bg-[#4A1828] text-[#FCF9F4] border-[#4A1828]'
                      : 'bg-[#FCF9F4] text-[#4A1828] border-[#4A1828]/25 hover:bg-[#F4ECE4]'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{editMode ? 'Editing On' : 'Edit Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={openManagerForNewOrList}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#A67C46] text-[#FCF9F4] rounded hover:bg-[#8E6837] transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Manage Dresses</span>
                </button>
              </div>
            </div>

            {/* Filter & Sort Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      navigate({ page: 'collections', category: tab.key })
                    }
                    className={`px-4 py-2 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                      route.category === tab.key
                        ? 'bg-[#4A1828] text-[#FCF9F4]'
                        : 'bg-[#F4ECE4] text-[#6A5A5E] hover:text-[#4A1828]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#6A5A5E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ensembles..."
                    aria-label="Search ensembles"
                    className="pl-8 pr-3 py-2 text-xs bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A] w-48"
                  />
                </div>

                <select
                  aria-label="Sort ensembles"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as 'featured' | 'price-asc' | 'price-desc'
                    )
                  }
                  className="px-3 py-2 text-xs font-medium bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                <select
                  aria-label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="px-3 py-2 text-xs font-medium bg-[#F4ECE4] border border-[#4A1828]/15 rounded text-[#21171A]"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#F4ECE4] border border-[#4A1828]/12 rounded space-y-3">
                <p className="font-serif text-2xl text-[#21171A]">
                  No ensembles match your current filter
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    navigate({ page: 'collections', category: 'all' });
                  }}
                  className="px-5 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded"
                >
                  Show All Ensembles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    editMode={editMode}
                    onSelectProduct={(id) =>
                      navigate({ page: 'product', productId: id })
                    }
                    onQuickAdd={(prod) => handleAddToBag(prod, 'M', 1)}
                    onEditProduct={openManagerForProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {route.page === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            currency={currency}
            editMode={editMode}
            onBackToCollections={() =>
              navigate({ page: 'collections', category: 'all' })
            }
            onSelectProduct={(id) =>
              navigate({ page: 'product', productId: id })
            }
            onEditProduct={openManagerForProduct}
            onAddToBag={handleAddToBag}
            onOpenCare={(tab) => handleOpenCare(tab)}
          />
        )}

        {route.page === 'atelier' && <AtelierView siteConfig={siteConfig} />}
      </main>

      <Footer
        siteConfig={siteConfig}
        onNavigate={navigate}
        onOpenCare={(tab) => handleOpenCare(tab)}
        onOpenManager={openManagerForNewOrList}
        onDownloadHtml={() => setExportModalOpen(true)}
      />

      <CartDrawer
        isOpen={bagOpen}
        onClose={() => setBagOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onTrackCreatedOrder={(orderNum) => handleOpenCare('track', orderNum)}
      />

      <ClientCareModal
        isOpen={careModalOpen}
        initialTab={careTab}
        initialOrderQuery={trackedOrderQuery}
        orders={orders}
        siteConfig={siteConfig}
        onClose={() => setCareModalOpen(false)}
      />

      <CatalogManagerModal
        isOpen={managerOpen}
        initialEditingProductId={managerEditingId}
        products={products}
        siteConfig={siteConfig}
        currency={currency}
        onClose={() => setManagerOpen(false)}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateSiteConfig={setSiteConfig}
        onResetDefaults={handleResetDefaults}
      />

      <ExportPackageModal
        isOpen={exportModalOpen}
        products={products}
        siteConfig={siteConfig}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
