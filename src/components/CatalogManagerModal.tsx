import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Check, Download, Pencil, Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import {
  CATEGORY_TABS,
  CategoryKey,
  CurrencyCode,
  HERO_MEDIA,
  ProductItem,
  SiteConfig,
  formatPrice,
} from '../data/products';
import { downloadStandaloneHtml, downloadWebsiteZip } from '../utils/exportHtml';
import { compressImageFile } from '../utils/imageUpload';
import { ResilientImage } from './ResilientImage';

interface CatalogManagerModalProps {
  isOpen: boolean;
  initialEditingProductId?: string | null;
  products: ProductItem[];
  siteConfig: SiteConfig;
  currency: CurrencyCode;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onResetDefaults: () => void;
}

type CategoryNoAll = Exclude<CategoryKey, 'all'>;

const CATEGORY_LABEL_MAP: Record<CategoryNoAll, string> = {
  'luxury-pret': 'Luxury Pret',
  'festive-formals': 'Festive Formals',
  'bridal-couture': 'Bridal Couture',
  'winter-velvet': 'Winter Velvet',
};

function createEmptyDraft(): Omit<ProductItem, 'id' | 'slug'> {
  return {
    name: '',
    urduSubtitle: 'Karachi Studio Edit',
    category: 'luxury-pret',
    categoryLabel: 'Luxury Pret',
    collectionName: 'Karachi Signature',
    pricePKR: 32000,
    fabric: 'Pure Raw Silk & Organza',
    pieces: '3-Piece Embroidered Ensemble',
    embroidery: 'Handcrafted Tilla & Resham',
    colorTone: 'Champagne Ivory',
    dispatchDays: '5–7 working days',
    availability: 'Ready to Ship',
    image: HERO_MEDIA.image,
    aspectNote: 'Studio Portrait',
    description: '',
    careInstructions: [
      'Dry clean only; do not wring or bleach',
      'Steam press on reverse at low silk temperature',
    ],
    includedItems: [
      'Embroidered kameez with inner lining',
      'Tailored raw silk trousers',
      'Embroidered sheer organza dupatta',
    ],
    featured: true,
  };
}

export function CatalogManagerModal({
  isOpen,
  initialEditingProductId,
  products,
  siteConfig,
  currency,
  onClose,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateSiteConfig,
  onResetDefaults,
}: CatalogManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'dresses' | 'site'>('dresses');
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<ProductItem, 'id' | 'slug'>>(createEmptyDraft());
  const [includedText, setIncludedText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const [siteDraft, setSiteDraft] = useState<SiteConfig>(siteConfig);
  const [siteSavedNotice, setSiteSavedNotice] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);

  const handleExportHtml = async () => {
    setIsExportingHtml(true);
    try {
      await downloadStandaloneHtml(products, siteConfig);
    } finally {
      setIsExportingHtml(false);
    }
  };

  const handleExportZip = async () => {
    setIsExportingHtml(true);
    try {
      await downloadWebsiteZip(products, siteConfig);
    } finally {
      setIsExportingHtml(false);
    }
  };

  useEffect(() => {
    setSiteDraft(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    if (!isOpen) return;
    setUploadError(null);
    setConfirmDeleteId(null);
    setConfirmReset(false);
    if (initialEditingProductId) {
      const target = products.find((p) => p.id === initialEditingProductId);
      if (target) {
        setActiveTab('dresses');
        setFormMode('edit');
        setEditingId(target.id);
        setDraft({
          name: target.name,
          urduSubtitle: target.urduSubtitle,
          category: target.category,
          categoryLabel: target.categoryLabel,
          collectionName: target.collectionName,
          pricePKR: target.pricePKR,
          fabric: target.fabric,
          pieces: target.pieces,
          embroidery: target.embroidery,
          colorTone: target.colorTone,
          dispatchDays: target.dispatchDays,
          availability: target.availability,
          image: target.image,
          aspectNote: target.aspectNote,
          description: target.description,
          careInstructions: target.careInstructions,
          includedItems: target.includedItems,
          featured: true,
        });
        setIncludedText(target.includedItems.join('\n'));
        setImageUrlInput(target.image.startsWith('data:') ? '' : target.image);
        return;
      }
    }
    setFormMode('list');
    setEditingId(null);
  }, [isOpen, initialEditingProductId, products]);

  if (!isOpen) return null;

  const startAddNew = () => {
    const empty = createEmptyDraft();
    setDraft(empty);
    setIncludedText(empty.includedItems.join('\n'));
    setImageUrlInput('');
    setUploadError(null);
    setEditingId(null);
    setFormMode('add');
  };

  const startEditProduct = (product: ProductItem) => {
    setDraft({
      name: product.name,
      urduSubtitle: product.urduSubtitle,
      category: product.category,
      categoryLabel: product.categoryLabel,
      collectionName: product.collectionName,
      pricePKR: product.pricePKR,
      fabric: product.fabric,
      pieces: product.pieces,
      embroidery: product.embroidery,
      colorTone: product.colorTone,
      dispatchDays: product.dispatchDays,
      availability: product.availability,
      image: product.image,
      aspectNote: product.aspectNote,
      description: product.description,
      careInstructions: product.careInstructions,
      includedItems: product.includedItems,
      featured: true,
    });
    setIncludedText(product.includedItems.join('\n'));
    setImageUrlInput(product.image.startsWith('data:') ? '' : product.image);
    setUploadError(null);
    setEditingId(product.id);
    setFormMode('edit');
  };

  const handleDressImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const dataUrl = await compressImageFile(file);
      setDraft((prev) => ({ ...prev, image: dataUrl }));
      setImageUrlInput('');
    } catch {
      setUploadError('Could not process that image. Please try a JPG or PNG photo.');
    }
  };

  const handleHeroImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const dataUrl = await compressImageFile(file, 1400, 0.85);
      setSiteDraft((prev) => ({ ...prev, heroImage: dataUrl }));
    } catch {
      setUploadError('Could not process hero image. Please try another JPG or PNG file.');
    }
  };

  const handleSaveDress = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;

    const parsedIncluded = includedText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const finalImage = imageUrlInput.trim() || draft.image;
    const categoryLabel = CATEGORY_LABEL_MAP[draft.category];
    const cleanSlug = draft.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (formMode === 'edit' && editingId) {
      onUpdateProduct({
        ...draft,
        id: editingId,
        slug: cleanSlug || editingId,
        categoryLabel,
        image: finalImage,
        includedItems: parsedIncluded.length > 0 ? parsedIncluded : draft.includedItems,
      });
    } else {
      const newId = `mnf-${Date.now()}`;
      onAddProduct({
        ...draft,
        id: newId,
        slug: cleanSlug || newId,
        categoryLabel,
        image: finalImage,
        includedItems: parsedIncluded.length > 0 ? parsedIncluded : draft.includedItems,
      });
    }

    setFormMode('list');
    setEditingId(null);
  };

  const handleSaveSiteConfig = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig(siteDraft);
    setSiteSavedNotice(true);
    setTimeout(() => setSiteSavedNotice(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Boutique Catalog and Content Manager"
    >
      <div className="bg-[#FCF9F4] text-[#21171A] w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#4A1828]/20 shadow-2xl rounded">
        {/* Header */}
        <div className="px-6 py-4 bg-[#4A1828] text-[#FCF9F4] flex items-center justify-between rounded-t">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Boutique Studio Manager
            </h2>
            <p className="text-xs text-[#FCF9F4]/80">
              Add, edit, or delete Pakistani dresses, photos, and Karachi outlet details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close manager"
            className="p-1.5 text-[#FCF9F4]/80 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 bg-[#F4ECE4] border-b border-[#4A1828]/12 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-6 text-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dresses');
                setFormMode('list');
              }}
              className={`pb-3 border-b-2 font-medium transition-colors ${
                activeTab === 'dresses'
                  ? 'border-[#4A1828] text-[#4A1828]'
                  : 'border-transparent text-[#6A5A5E] hover:text-[#21171A]'
              }`}
            >
              Dresses &amp; Photos ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('site')}
              className={`pb-3 border-b-2 font-medium transition-colors ${
                activeTab === 'site'
                  ? 'border-[#4A1828] text-[#4A1828]'
                  : 'border-transparent text-[#6A5A5E] hover:text-[#21171A]'
              }`}
            >
              Hero Banner &amp; Karachi Outlet
            </button>
          </div>

          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={isExportingHtml}
              onClick={handleExportZip}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FCF9F4] text-[#4A1828] border border-[#4A1828]/25 text-xs font-medium rounded hover:bg-white transition-colors disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingHtml ? 'Preparing...' : 'Download ZIP'}</span>
            </button>

            <button
              type="button"
              disabled={isExportingHtml}
              onClick={handleExportHtml}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FCF9F4] text-[#4A1828] border border-[#4A1828]/25 text-xs font-medium rounded hover:bg-white transition-colors disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML File</span>
            </button>

            {activeTab === 'dresses' && formMode === 'list' && (
              <button
                type="button"
                onClick={startAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Dress</span>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {uploadError && (
            <div className="p-3 bg-[#991B1B]/10 border border-[#991B1B]/30 text-xs text-[#991B1B] rounded">
              {uploadError}
            </div>
          )}

          {activeTab === 'dresses' && formMode === 'list' && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="py-12 text-center bg-[#F4ECE4] border border-[#4A1828]/12 rounded space-y-3">
                  <p className="font-serif text-xl text-[#21171A]">
                    No dresses in catalog yet
                  </p>
                  <button
                    type="button"
                    onClick={startAddNew}
                    className="px-5 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded"
                  >
                    Add Your First Dress
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#4A1828]/12 border border-[#4A1828]/12 rounded bg-white">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-20 shrink-0 bg-[#F4ECE4] overflow-hidden border border-[#4A1828]/10">
                          <ResilientImage
                            src={item.image}
                            alt={item.name}
                            fallbackTitle={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-semibold text-[#21171A] truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#6A5A5E]">
                            {item.categoryLabel} · {item.fabric} ·{' '}
                            <span className="font-semibold text-[#4A1828] tabular-nums">
                              {formatPrice(item.pricePKR, currency)}
                            </span>
                          </p>
                          <p className="text-[11px] text-[#A67C46] mt-0.5">
                            {item.availability} · {item.colorTone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditProduct(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#4A1828]/25 text-[#21171A] hover:bg-[#F4ECE4] rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {confirmDeleteId === item.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteProduct(item.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-[#991B1B] text-white rounded hover:bg-[#7F1D1D]"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1.5 text-xs text-[#6A5A5E] hover:text-[#21171A]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#991B1B]/25 text-[#991B1B] hover:bg-[#991B1B]/10 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reset Option */}
              <div className="pt-3 flex items-center justify-between text-xs text-[#6A5A5E]">
                <span>Changes are saved automatically in your browser.</span>
                {confirmReset ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#991B1B] font-medium">Restore original 7 dresses?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetDefaults();
                        setConfirmReset(false);
                      }}
                      className="px-3 py-1 bg-[#991B1B] text-white rounded"
                    >
                      Yes, Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2 py-1 text-[#21171A]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-1 text-[#6A5A5E] hover:text-[#4A1828] underline underline-offset-4"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Default Collection</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dresses' && (formMode === 'add' || formMode === 'edit') && (
            <form onSubmit={handleSaveDress} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#4A1828]/12 pb-3">
                <h3 className="font-serif text-2xl font-semibold text-[#21171A]">
                  {formMode === 'edit' ? `Edit: ${draft.name}` : 'Add New Pakistani Dress'}
                </h3>
                <button
                  type="button"
                  onClick={() => setFormMode('list')}
                  className="text-xs font-medium text-[#6A5A5E] hover:text-[#21171A]"
                >
                  Back to Dress List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Photo Upload Column */}
                <div className="md:col-span-4 space-y-3">
                  <div className="aspect-[3/4] w-full bg-[#F4ECE4] border border-[#4A1828]/15 overflow-hidden rounded">
                    <ResilientImage
                      src={imageUrlInput.trim() || draft.image}
                      alt="Dress preview"
                      fallbackTitle={draft.name || 'Preview'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded cursor-pointer hover:bg-[#38111E] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDressImageUpload}
                      className="sr-only"
                    />
                  </label>

                  <label className="block text-[11px] text-[#6A5A5E]">
                    Or paste direct image URL (optional)
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full px-3 py-2 text-xs bg-white border border-[#4A1828]/20 rounded text-[#21171A]"
                    />
                  </label>
                </div>

                {/* Form Fields Column */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1 sm:col-span-2">
                    Dress Name *
                    <input
                      type="text"
                      required
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="e.g. Chandni Rose Gharara"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Category *
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category: e.target.value as CategoryNoAll,
                        })
                      }
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    >
                      {CATEGORY_TABS.filter((t) => t.key !== 'all').map((t) => (
                        <option key={t.key} value={t.key}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Price (PKR) *
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={draft.pricePKR}
                      onChange={(e) =>
                        setDraft({ ...draft, pricePKR: Number(e.target.value) || 0 })
                      }
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A] tabular-nums"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Collection Name
                    <input
                      type="text"
                      value={draft.collectionName}
                      onChange={(e) =>
                        setDraft({ ...draft, collectionName: e.target.value })
                      }
                      placeholder="e.g. Eid Festive"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Availability
                    <select
                      value={draft.availability}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          availability: e.target.value as ProductItem['availability'],
                        })
                      }
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    >
                      <option value="Ready to Ship">Ready to Ship</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Fabric Base
                    <input
                      type="text"
                      value={draft.fabric}
                      onChange={(e) => setDraft({ ...draft, fabric: e.target.value })}
                      placeholder="e.g. Pure Chiffon & Raw Silk"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Color Shade
                    <input
                      type="text"
                      value={draft.colorTone}
                      onChange={(e) =>
                        setDraft({ ...draft, colorTone: e.target.value })
                      }
                      placeholder="e.g. Pistachio Mint"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Pieces Description
                    <input
                      type="text"
                      value={draft.pieces}
                      onChange={(e) => setDraft({ ...draft, pieces: e.target.value })}
                      placeholder="e.g. 3-Piece Embroidered Suit"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1">
                    Embroidery / Handwork
                    <input
                      type="text"
                      value={draft.embroidery}
                      onChange={(e) =>
                        setDraft({ ...draft, embroidery: e.target.value })
                      }
                      placeholder="e.g. Dabka, Tilla & Resham"
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1 sm:col-span-2">
                    Dress Description *
                    <textarea
                      rows={3}
                      required
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({ ...draft, description: e.target.value })
                      }
                      placeholder="Describe the cut, embroidery, and dupatta detailing..."
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="text-xs text-[#6A5A5E] flex flex-col gap-1 sm:col-span-2">
                    Included Pieces (one item per line)
                    <textarea
                      rows={3}
                      value={includedText}
                      onChange={(e) => setIncludedText(e.target.value)}
                      className="px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormMode('list')}
                      className="px-5 py-2.5 border border-[#4A1828]/20 text-xs font-medium rounded hover:bg-[#F4ECE4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] transition-colors"
                    >
                      {formMode === 'edit' ? 'Save Dress Changes' : 'Publish Dress to Store'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'site' && (
            <form onSubmit={handleSaveSiteConfig} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-3">
                  <p className="text-xs font-semibold text-[#4A1828]">
                    Homepage Hero Campaign Image
                  </p>
                  <div className="aspect-[16/9] w-full bg-[#F4ECE4] border border-[#4A1828]/15 overflow-hidden rounded">
                    <ResilientImage
                      src={siteDraft.heroImage}
                      alt="Hero Banner Preview"
                      fallbackTitle="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded cursor-pointer hover:bg-[#38111E] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload New Hero Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <label className="block text-xs text-[#6A5A5E]">
                    Brand Name
                    <input
                      type="text"
                      required
                      value={siteDraft.brandName}
                      onChange={(e) =>
                        setSiteDraft({ ...siteDraft, brandName: e.target.value })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="block text-xs text-[#6A5A5E]">
                    Hero Headline
                    <input
                      type="text"
                      required
                      value={siteDraft.heroTitle}
                      onChange={(e) =>
                        setSiteDraft({ ...siteDraft, heroTitle: e.target.value })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="block text-xs text-[#6A5A5E]">
                    Hero Subtitle
                    <textarea
                      rows={2}
                      value={siteDraft.heroSubtitle}
                      onChange={(e) =>
                        setSiteDraft({ ...siteDraft, heroSubtitle: e.target.value })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="block text-xs text-[#6A5A5E]">
                    Top Announcement Banner
                    <input
                      type="text"
                      value={siteDraft.announcementText}
                      onChange={(e) =>
                        setSiteDraft({
                          ...siteDraft,
                          announcementText: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <label className="block text-xs text-[#6A5A5E]">
                    Karachi Flagship Outlet Address
                    <input
                      type="text"
                      value={siteDraft.outletAddress}
                      onChange={(e) =>
                        setSiteDraft({ ...siteDraft, outletAddress: e.target.value })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-xs text-[#6A5A5E]">
                      WhatsApp / Phone
                      <input
                        type="text"
                        value={siteDraft.whatsappPhone}
                        onChange={(e) =>
                          setSiteDraft({
                            ...siteDraft,
                            whatsappPhone: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                      />
                    </label>
                    <label className="block text-xs text-[#6A5A5E]">
                      Outlet Timings
                      <input
                        type="text"
                        value={siteDraft.outletHours}
                        onChange={(e) =>
                          setSiteDraft({ ...siteDraft, outletHours: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                      />
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    {siteSavedNotice && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2D6A4F]">
                        <Check className="w-4 h-4" /> Saved
                      </span>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] transition-colors"
                    >
                      Save Site &amp; Outlet Settings
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
