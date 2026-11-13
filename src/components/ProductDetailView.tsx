import { useState } from 'react';
import { ArrowLeft, Check, Pencil, Ruler, ShieldCheck, Truck } from 'lucide-react';
import {
  CurrencyCode,
  ProductItem,
  formatPrice,
} from '../data/products';
import { CustomMeasurements, DressSize } from '../types';
import { CareTabKey } from './ClientCareModal';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: ProductItem;
  allProducts: ProductItem[];
  currency: CurrencyCode;
  editMode?: boolean;
  onBackToCollections: () => void;
  onSelectProduct: (productId: string) => void;
  onEditProduct?: (productId: string) => void;
  onAddToBag: (
    product: ProductItem,
    size: DressSize,
    quantity: number,
    customMeasurements?: CustomMeasurements
  ) => void;
  onOpenCare: (tab: CareTabKey) => void;
}

const SIZES: DressSize[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom Size'];

export function ProductDetailView({
  product,
  allProducts,
  currency,
  editMode = false,
  onBackToCollections,
  onSelectProduct,
  onEditProduct,
  onAddToBag,
  onOpenCare,
}: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<DressSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    shirtLength: '44"',
    chest: '36"',
    waist: '30"',
    hip: '40"',
    sleeves: '22"',
    notes: '',
  });

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 3);

  const handleAdd = () => {
    onAddToBag(
      product,
      selectedSize,
      quantity,
      selectedSize === 'Custom Size' ? measurements : undefined
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Breadcrumb Back Navigation */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#4A1828]/12 pb-4">
        <button
          type="button"
          onClick={onBackToCollections}
          className="inline-flex items-center gap-2 text-sm text-[#6A5A5E] hover:text-[#4A1828] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </button>

        <div className="flex items-center gap-4">
          {editMode && onEditProduct && (
            <button
              type="button"
              onClick={() => onEditProduct(product.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E]"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit This Dress</span>
            </button>
          )}
          <span className="text-xs text-[#6A5A5E] hidden sm:inline">
            {product.collectionName} / {product.categoryLabel} / {product.name}
          </span>
        </div>
      </div>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Sticky Editorial Image Column */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <div className="aspect-[3/4] w-full overflow-hidden bg-[#F4ECE4] border border-[#4A1828]/10">
            <ResilientImage
              src={product.image}
              alt={`${product.name} — ${product.pieces}`}
              fallbackTitle={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Sticky Purchase Module Right */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#4A1828]/12 pb-6">
            <div className="flex items-center gap-2 text-xs text-[#6A5A5E]">
              <span>{product.collectionName}</span>
              <span aria-hidden="true">·</span>
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#A67C46] font-medium">{product.availability}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#21171A] text-balance">
              {product.name}
            </h1>

            <p className="text-sm text-[#6A5A5E]">{product.pieces}</p>

            <div className="pt-2 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-[#4A1828] tabular-nums">
                {formatPrice(product.pricePKR, currency)}
              </span>
              <span className="text-xs text-[#6A5A5E]">
                Inclusive of Karachi atelier stitching
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-[15px] text-[#3B2E32] leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs */}
          <dl className="grid grid-cols-2 gap-y-3 gap-x-6 py-4 border-y border-[#4A1828]/12 text-sm">
            <div>
              <dt className="text-xs text-[#6A5A5E]">Fabric Base</dt>
              <dd className="font-medium text-[#21171A] mt-0.5">{product.fabric}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#6A5A5E]">Handwork</dt>
              <dd className="font-medium text-[#21171A] mt-0.5">{product.embroidery}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#6A5A5E]">Shade</dt>
              <dd className="font-medium text-[#21171A] mt-0.5">{product.colorTone}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#6A5A5E]">Dispatch</dt>
              <dd className="font-medium text-[#21171A] mt-0.5">{product.dispatchDays}</dd>
            </div>
          </dl>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#21171A]">Select Size</span>
              <button
                type="button"
                onClick={() => onOpenCare('sizing')}
                className="inline-flex items-center gap-1.5 text-xs text-[#A67C46] hover:text-[#4A1828] transition-colors underline underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Pakistani Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 px-2 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                    selectedSize === size
                      ? 'bg-[#4A1828] text-[#FCF9F4] border-[#4A1828]'
                      : 'bg-transparent text-[#21171A] border-[#4A1828]/25 hover:border-[#4A1828]'
                  }`}
                >
                  {size === 'Custom Size' ? 'Custom' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tailoring Measurements Panel */}
          {selectedSize === 'Custom Size' && (
            <div className="p-4 bg-[#F4ECE4] border border-[#4A1828]/15 rounded space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#21171A]">
                  Bespoke Tailoring Measurements (Inches)
                </h2>
                <span className="text-xs text-[#A67C46] font-medium">Complimentary</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Kameez Length
                  <input
                    type="text"
                    value={measurements.shirtLength}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, shirtLength: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Chest
                  <input
                    type="text"
                    value={measurements.chest}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, chest: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Waist
                  <input
                    type="text"
                    value={measurements.waist}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, waist: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Hip
                  <input
                    type="text"
                    value={measurements.hip}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, hip: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Sleeves
                  <input
                    type="text"
                    value={measurements.sleeves}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, sleeves: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
                <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                  Neck / Trouser Note
                  <input
                    type="text"
                    placeholder="e.g. Gharara 41"
                    value={measurements.notes}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, notes: e.target.value })
                    }
                    className="px-2.5 py-2 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Quantity + Primary Add to Bag */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-[#4A1828]/25 rounded bg-[#FCF9F4]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-3 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] transition-colors"
              >
                −
              </button>
              <span className="px-3 text-sm font-medium tabular-nums min-w-[2.25rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 py-3 text-sm font-medium text-[#21171A] hover:bg-[#F4ECE4] transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3.5 px-6 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium tracking-wide hover:bg-[#38111E] transition-colors rounded inline-flex items-center justify-center gap-2"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <span>
                  Add to Bag · {formatPrice(product.pricePKR * quantity, currency)}
                </span>
              )}
            </button>
          </div>

          {/* Service & Payment Assurances */}
          <div className="pt-2 space-y-2.5 text-xs text-[#6A5A5E]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#A67C46] shrink-0" />
              <span>
                Same-day Karachi rider dispatch · Nationwide COD &amp; Worldwide DHL Express
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#A67C46] shrink-0" />
              <span>
                Complimentary fitting adjustment within 14 days at our DHA Phase 5 Karachi outlet
              </span>
            </div>
          </div>

          {/* Included Pieces & Care */}
          <div className="pt-4 border-t border-[#4A1828]/12 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-[#21171A] mb-2">
                What Is Included
              </h2>
              <ul className="space-y-1.5 text-sm text-[#3B2E32]">
                {product.includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#A67C46] mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#21171A] mb-2">
                Garment Care
              </h2>
              <ul className="space-y-1.5 text-sm text-[#6A5A5E]">
                {product.careInstructions.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="text-[#A67C46] mt-1">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pakistani Ensembles */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-14 border-t border-[#4A1828]/12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#21171A]">
              You May Also Adore
            </h2>
            <button
              type="button"
              onClick={onBackToCollections}
              className="text-sm font-medium text-[#4A1828] hover:text-[#A67C46] transition-colors"
            >
              View All Ensembles
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                currency={currency}
                editMode={editMode}
                onSelectProduct={onSelectProduct}
                onQuickAdd={(prod) => onAddToBag(prod, 'M', 1)}
                onEditProduct={onEditProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
