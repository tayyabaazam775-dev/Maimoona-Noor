import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CurrencyCode, ProductItem, formatPrice } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: ProductItem;
  currency: CurrencyCode;
  editMode?: boolean;
  onSelectProduct: (productId: string) => void;
  onQuickAdd: (product: ProductItem) => void;
  onEditProduct?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

export function ProductCard({
  product,
  currency,
  editMode = false,
  onSelectProduct,
  onQuickAdd,
  onEditProduct,
  onDeleteProduct,
}: ProductCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4ECE4] border border-[#4A1828]/10">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="block w-full h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67C46]"
          aria-label={`View ${product.name}`}
        >
          <ResilientImage
            src={product.image}
            alt={`${product.name} — ${product.pieces} in ${product.colorTone}`}
            fallbackTitle={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </button>

        {/* Direct Studio Edit/Delete Controls when Edit Mode is enabled */}
        {editMode && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onEditProduct && (
              <button
                type="button"
                onClick={() => onEditProduct(product.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FCF9F4]/95 text-[#21171A] text-xs font-medium rounded border border-[#4A1828]/20 shadow-sm hover:bg-white"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
            {onDeleteProduct && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#991B1B] text-white text-xs font-medium rounded shadow-sm hover:bg-[#7F1D1D]"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
            {onDeleteProduct && confirmDelete && (
              <div className="flex items-center gap-1 bg-[#FCF9F4] p-1 rounded border border-[#991B1B]/30 shadow-md">
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product.id)}
                  className="px-2 py-1 bg-[#991B1B] text-white text-[11px] font-medium rounded"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-[11px] text-[#21171A]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Subtle Hover Quick-Add Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => onSelectProduct(product.id)}
            className="flex-1 py-2.5 px-3 bg-[#FCF9F4]/95 backdrop-blur-sm text-[#21171A] text-xs font-medium tracking-wide hover:bg-white transition-colors border border-[#4A1828]/15"
          >
            View Ensemble
          </button>
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="py-2.5 px-4 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium tracking-wide hover:bg-[#38111E] transition-colors whitespace-nowrap"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Uniform Product Metadata Block (Zero Pills) */}
      <div className="pt-4 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 text-xs text-[#6A5A5E]">
          <span className="truncate">
            {product.categoryLabel} · {product.collectionName}
          </span>
          <span className="shrink-0 text-[#A67C46] font-medium">
            {product.availability}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="text-left font-serif text-xl font-medium text-[#21171A] hover:text-[#4A1828] transition-colors leading-snug"
        >
          {product.name}
        </button>

        <div className="flex items-baseline justify-between gap-3 pt-0.5">
          <span className="text-sm font-semibold text-[#4A1828] tabular-nums">
            {formatPrice(product.pricePKR, currency)}
          </span>
          <span className="text-xs text-[#6A5A5E] truncate">{product.fabric}</span>
        </div>
      </div>
    </article>
  );
}
