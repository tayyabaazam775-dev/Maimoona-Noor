import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/products';
import { CartItem, OrderRecord } from '../types';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onTrackCreatedOrder: (orderNumber: string) => void;
}

const FREE_DELIVERY_THRESHOLD_PKR = 25000;
const STANDARD_DELIVERY_PKR = 650;

export function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onTrackCreatedOrder,
}: CartDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<OrderRecord['paymentMethod']>('Cash on Delivery (COD)');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotalPKR = items.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );
  const shippingPKR =
    subtotalPKR === 0 || subtotalPKR >= FREE_DELIVERY_THRESHOLD_PKR
      ? 0
      : STANDARD_DELIVERY_PKR;
  const totalPKR = subtotalPKR + shippingPKR;

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const orderNum = `MNF-${Math.floor(1050 + Math.random() * 8900)}`;
    const newOrder: OrderRecord = {
      orderNumber: orderNum,
      createdAt: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      paymentMethod,
      items: [...items],
      subtotalPKR,
      shippingPKR,
      totalPKR,
      statusStep: 0,
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setStep('confirmed');
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('bag');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="w-full max-w-md bg-[#FCF9F4] text-[#21171A] h-full flex flex-col shadow-2xl border-l border-[#4A1828]/15">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#4A1828]/12 flex items-center justify-between bg-[#F4ECE4]/60">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="p-1 -ml-1 text-[#6A5A5E] hover:text-[#4A1828]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-serif text-2xl font-semibold text-[#4A1828]">
              {step === 'bag' && 'Your Shopping Bag'}
              {step === 'checkout' && 'Delivery & Payment'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close bag drawer"
            className="p-2 text-[#6A5A5E] hover:text-[#4A1828] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#A67C46]/70" />
                  <div className="space-y-1">
                    <p className="font-serif text-xl text-[#21171A]">
                      Your shopping bag is empty
                    </p>
                    <p className="text-sm text-[#6A5A5E] max-w-xs">
                      Explore our Karachi-crafted luxury pret, festive chiffons, and bridal couture ensembles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="px-6 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium tracking-wide rounded hover:bg-[#38111E] transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-3 bg-[#F4ECE4] border border-[#4A1828]/10 rounded text-xs text-[#3B2E32]">
                    {subtotalPKR >= FREE_DELIVERY_THRESHOLD_PKR ? (
                      <span>
                        Complimentary nationwide courier delivery unlocked for your order.
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <strong className="tabular-nums">
                          {formatPrice(FREE_DELIVERY_THRESHOLD_PKR - subtotalPKR, currency)}
                        </strong>{' '}
                        more for complimentary nationwide shipping across Pakistan.
                      </span>
                    )}
                  </div>

                  <ul className="divide-y divide-[#4A1828]/10">
                    {items.map((item) => (
                      <li key={item.cartItemId} className="py-4 flex gap-4">
                        <div className="w-20 h-26 shrink-0 bg-[#F4ECE4] overflow-hidden border border-[#4A1828]/10">
                          <ResilientImage
                            src={item.product.image}
                            alt={item.product.name}
                            fallbackTitle={item.product.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-serif text-lg font-medium text-[#21171A] leading-tight">
                                {item.product.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.cartItemId)}
                                aria-label={`Remove ${item.product.name}`}
                                className="text-[#6A5A5E] hover:text-[#991B1B] p-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-[#6A5A5E] mt-0.5">
                              Size: {item.size} · {item.product.colorTone}
                            </p>
                            {item.customMeasurements && (
                              <p className="text-[11px] text-[#A67C46] mt-1">
                                Bespoke: L {item.customMeasurements.shirtLength} · C{' '}
                                {item.customMeasurements.chest} · W{' '}
                                {item.customMeasurements.waist}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3">
                            <div className="inline-flex items-center border border-[#4A1828]/25 rounded">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                                className="p-1.5 text-[#21171A] hover:bg-[#F4ECE4]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-medium tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                                className="p-1.5 text-[#21171A] hover:bg-[#F4ECE4]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-[#4A1828] tabular-nums">
                              {formatPrice(item.product.pricePKR * item.quantity, currency)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#6A5A5E]">
                  Recipient Information
                </h3>

                <label className="block text-xs text-[#6A5A5E]">
                  Full Name *
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Fatima Zahra"
                    className="mt-1 w-full px-3.5 py-2.5 text-sm bg-white border border-[#4A1828]/20 rounded text-[#21171A] focus:outline-none focus:border-[#4A1828]"
                  />
                </label>

                <label className="block text-xs text-[#6A5A5E]">
                  Mobile / WhatsApp Number *
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="mt-1 w-full px-3.5 py-2.5 text-sm bg-white border border-[#4A1828]/20 rounded text-[#21171A] focus:outline-none focus:border-[#4A1828]"
                  />
                </label>

                <label className="block text-xs text-[#6A5A5E]">
                  City &amp; Country *
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Karachi, Pakistan"
                    className="mt-1 w-full px-3.5 py-2.5 text-sm bg-white border border-[#4A1828]/20 rounded text-[#21171A] focus:outline-none focus:border-[#4A1828]"
                  />
                </label>

                <label className="block text-xs text-[#6A5A5E]">
                  Complete Delivery Address *
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, street, Clifton / DHA / block"
                    className="mt-1 w-full px-3.5 py-2.5 text-sm bg-white border border-[#4A1828]/20 rounded text-[#21171A] focus:outline-none focus:border-[#4A1828]"
                  />
                </label>
              </div>

              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#6A5A5E]">
                  Payment Method
                </h3>
                {(
                  [
                    'Cash on Delivery (COD)',
                    'Bank Transfer (IBFT)',
                    'Card Payment',
                  ] as const
                ).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-3 border rounded cursor-pointer text-sm transition-colors ${
                      paymentMethod === method
                        ? 'border-[#4A1828] bg-[#F4ECE4]'
                        : 'border-[#4A1828]/15 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-[#4A1828]"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="py-6 space-y-6">
              <div className="flex items-start gap-3 p-4 bg-[#F4ECE4] border border-[#4A1828]/15 rounded">
                <CheckCircle2 className="w-6 h-6 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif text-xl font-semibold text-[#4A1828]">
                    Order #{confirmedOrder.orderNumber} Confirmed
                  </p>
                  <p className="text-xs text-[#6A5A5E] mt-1">
                    Thank you, {confirmedOrder.customerName}. Our Karachi outlet has received your ensemble order and will verify dispatch details via WhatsApp.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm border-y border-[#4A1828]/12 py-4">
                <div className="flex justify-between">
                  <span className="text-[#6A5A5E]">Payment Method</span>
                  <span className="font-medium">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6A5A5E]">Delivery To</span>
                  <span className="font-medium text-right">{confirmedOrder.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6A5A5E]">Total Payable</span>
                  <span className="font-semibold text-[#4A1828] tabular-nums">
                    {formatPrice(confirmedOrder.totalPKR, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onTrackCreatedOrder(confirmedOrder.orderNumber);
                    handleCloseDrawer();
                  }}
                  className="w-full py-3 px-4 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium rounded hover:bg-[#38111E] transition-colors"
                >
                  Track Order #{confirmedOrder.orderNumber}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="w-full py-2.5 px-4 border border-[#4A1828]/25 text-sm font-medium rounded hover:bg-[#F4ECE4] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Totals */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-[#4A1828]/12 bg-[#FCF9F4] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6A5A5E]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotalPKR, currency)}</span>
              </div>
              <div className="flex justify-between text-[#6A5A5E]">
                <span>Courier Delivery</span>
                <span className="tabular-nums">
                  {shippingPKR === 0 ? 'Complimentary' : formatPrice(shippingPKR, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#4A1828] pt-2 border-t border-[#4A1828]/12">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(totalPKR, currency)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium tracking-wide rounded hover:bg-[#38111E] transition-colors"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 px-6 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium tracking-wide rounded hover:bg-[#38111E] transition-colors"
              >
                Confirm Order · {formatPrice(totalPKR, currency)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
