import { FormEvent, useEffect, useState } from 'react';
import { Check, PackageCheck, X } from 'lucide-react';
import { SiteConfig } from '../data/products';
import { OrderRecord } from '../types';

export type CareTabKey = 'track' | 'sizing' | 'shipping' | 'returns';

interface ClientCareModalProps {
  isOpen: boolean;
  initialTab: CareTabKey;
  initialOrderQuery?: string;
  orders: OrderRecord[];
  siteConfig: SiteConfig;
  onClose: () => void;
}

const TRACK_STAGES = [
  'Order Confirmed',
  'Hand Embroidery & Tailoring',
  'Quality Inspection',
  'Dispatched via Courier',
];

export function ClientCareModal({
  isOpen,
  initialTab,
  initialOrderQuery = '',
  orders,
  siteConfig,
  onClose,
}: ClientCareModalProps) {
  const [activeTab, setActiveTab] = useState<CareTabKey>(initialTab);
  const [query, setQuery] = useState(initialOrderQuery || 'MNF-1042');
  const [lookedUpOrder, setLookedUpOrder] = useState<OrderRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialOrderQuery) {
      setQuery(initialOrderQuery);
      const found = orders.find(
        (o) => o.orderNumber.toLowerCase() === initialOrderQuery.toLowerCase()
      );
      setLookedUpOrder(found || null);
      setNotFound(!found);
    }
  }, [initialTab, initialOrderQuery, orders]);

  if (!isOpen) return null;

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = query.trim().replace(/^#/, '').toLowerCase();
    const match = orders.find((o) => o.orderNumber.toLowerCase() === clean);
    if (match) {
      setLookedUpOrder(match);
      setNotFound(false);
    } else {
      setLookedUpOrder(null);
      setNotFound(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Maimoona Noor Fashion Client Care"
    >
      <div className="bg-[#FCF9F4] text-[#21171A] w-full max-w-2xl max-h-[88vh] flex flex-col border border-[#4A1828]/15 shadow-2xl rounded">
        <div className="px-6 py-5 bg-[#4A1828] text-[#FCF9F4] flex items-center justify-between rounded-t">
          <h2 className="font-serif text-2xl font-semibold">Client Care &amp; Concierge</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close client care"
            className="p-1.5 text-[#FCF9F4]/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#F4ECE4] border-b border-[#4A1828]/12 flex gap-5 overflow-x-auto text-sm">
          {(
            [
              { key: 'track', label: 'Track Order' },
              { key: 'sizing', label: 'Size Guide' },
              { key: 'shipping', label: 'Shipping & COD' },
              { key: 'returns', label: 'Alterations & Returns' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#4A1828] text-[#4A1828] font-medium'
                  : 'border-transparent text-[#6A5A5E] hover:text-[#21171A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#3B2E32]">
          {activeTab === 'track' && (
            <div className="space-y-5">
              <p>
                Enter your {siteConfig.brandName} order reference (for example,{' '}
                <strong className="text-[#4A1828]">MNF-1042</strong>) to inspect Karachi atelier preparation and courier progress.
              </p>

              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order Number (e.g. MNF-1042)"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] transition-colors whitespace-nowrap"
                >
                  Check Status
                </button>
              </form>

              {notFound && (
                <p className="text-xs text-[#991B1B]">
                  No order matched “{query}”. Try sample order MNF-1042 or place a test order in your shopping bag.
                </p>
              )}

              {lookedUpOrder && (
                <div className="p-5 bg-[#F4ECE4] border border-[#4A1828]/15 rounded space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl font-semibold text-[#4A1828]">
                        Order #{lookedUpOrder.orderNumber}
                      </p>
                      <p className="text-xs text-[#6A5A5E]">
                        Placed {lookedUpOrder.createdAt} · {lookedUpOrder.city} ·{' '}
                        {lookedUpOrder.paymentMethod}
                      </p>
                    </div>
                    <PackageCheck className="w-5 h-5 text-[#A67C46] shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    {TRACK_STAGES.map((stage, idx) => {
                      const done = idx <= lookedUpOrder.statusStep;
                      return (
                        <div
                          key={stage}
                          className={`p-3 rounded border text-xs ${
                            done
                              ? 'bg-[#FCF9F4] border-[#4A1828] text-[#21171A]'
                              : 'bg-transparent border-[#4A1828]/15 text-[#6A5A5E]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-medium">
                            {done && <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />}
                            <span>{stage}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sizing' && (
            <div className="space-y-4">
              <p>
                All standard Pakistani sizes follow our tailored kameez &amp; trouser proportions in inches. You may also select <strong>Custom Size</strong> on any ensemble for complimentary bespoke stitching at our Karachi atelier.
              </p>
              <div className="overflow-x-auto border border-[#4A1828]/15 rounded">
                <table className="w-full text-left text-xs tabular-nums">
                  <thead className="bg-[#F4ECE4] text-[#4A1828] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest</th>
                      <th className="py-2.5 px-3">Waist</th>
                      <th className="py-2.5 px-3">Hip</th>
                      <th className="py-2.5 px-3">Kameez Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A1828]/10 bg-white">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">XS</td>
                      <td className="py-2.5 px-3">34"</td>
                      <td className="py-2.5 px-3">28"</td>
                      <td className="py-2.5 px-3">37"</td>
                      <td className="py-2.5 px-3">42"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">S</td>
                      <td className="py-2.5 px-3">36"</td>
                      <td className="py-2.5 px-3">30"</td>
                      <td className="py-2.5 px-3">39"</td>
                      <td className="py-2.5 px-3">43"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">M</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">32"</td>
                      <td className="py-2.5 px-3">41"</td>
                      <td className="py-2.5 px-3">44"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">L</td>
                      <td className="py-2.5 px-3">41"</td>
                      <td className="py-2.5 px-3">35"</td>
                      <td className="py-2.5 px-3">44"</td>
                      <td className="py-2.5 px-3">45"</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">XL</td>
                      <td className="py-2.5 px-3">44"</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">47"</td>
                      <td className="py-2.5 px-3">46"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 leading-relaxed">
              <h3 className="font-serif text-xl font-semibold text-[#4A1828]">
                Karachi Dispatch, Nationwide COD &amp; Worldwide Delivery
              </h3>
              <p>
                <strong>Karachi Same-Day &amp; Next-Day Delivery:</strong> Ready-to-ship ensembles dispatch directly from our DHA Phase 5 outlet across Clifton, DHA, PECHS, Bahadurabad, and Gulshan via dedicated rider.
              </p>
              <p>
                <strong>Across Pakistan:</strong> Cash on Delivery (COD) via TCS &amp; Leopard Express. Delivery is complimentary above PKR 25,000, and flat PKR 650 below that threshold.
              </p>
              <p>
                <strong>International Clients (UK, USA, UAE, Canada, Saudi Arabia):</strong> Shipped via DHL Express from Karachi in 5–7 business days after atelier dispatch.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-3 leading-relaxed">
              <h3 className="font-serif text-xl font-semibold text-[#4A1828]">
                Alterations &amp; Exchange Policy
              </h3>
              <p>
                Ready-to-ship standard-size ensembles may be exchanged for another size within 7 days of delivery at our Karachi outlet or via courier if unworn with original tags intact.
              </p>
              <p>
                Every stitched outfit includes 1.5 inches of internal tailoring allowance and complimentary fitting alterations at {siteConfig.outletAddress}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
