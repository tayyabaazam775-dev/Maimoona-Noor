import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CLIENT_TESTIMONIALS, HERO_MEDIA, SiteConfig } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface AtelierViewProps {
  siteConfig: SiteConfig;
}

export function AtelierView({ siteConfig }: AtelierViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [appointmentType, setAppointmentType] = useState('Karachi Flagship Visit (DHA Phase 5)');
  const [interest, setInterest] = useState('Bridal Couture & Barat Lehenga');
  const [preferredDate, setPreferredDate] = useState('');
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setBookingRef(`KHI-${Math.floor(2100 + Math.random() * 7800)}`);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-20">
      {/* Editorial Header & Craftsmanship Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <p className="text-xs font-medium tracking-widest uppercase text-[#A67C46]">
            DHA Phase 5, Karachi · Flagship Outlet &amp; Workshop
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#21171A] leading-tight text-balance">
            Inside the {siteConfig.brandName} Karachi Outlet
          </h1>
          <p className="text-base text-[#3B2E32] leading-relaxed">
            Located on Zamzama Commercial in DHA Phase 5, Karachi, our flagship boutique and atelier bring together generations of master karigars working on wooden adda frames—hand-stitching zardozi, dabka, resham, and gota onto pure Pakistani silks, chiffons, and micro-velvet.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#4A1828]/15">
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A1828] tabular-nums">
                420+ hrs
              </p>
              <p className="text-xs text-[#6A5A5E] mt-1">
                Average handwork per bridal lehenga
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A1828] tabular-nums">
                100%
              </p>
              <p className="text-xs text-[#6A5A5E] mt-1">
                Pure Pakistani silk, chiffon &amp; cotton net
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A1828] tabular-nums">
                Same Day
              </p>
              <p className="text-xs text-[#6A5A5E] mt-1">
                Ready-to-ship courier across Karachi
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[340px] overflow-hidden bg-[#F4ECE4] border border-[#4A1828]/15">
            <ResilientImage
              src={HERO_MEDIA.atelierImage}
              alt="Pakistani master karigar performing zardozi and dabka handwork on a wooden adda frame at Maimoona Noor Fashion Karachi"
              fallbackTitle="Karachi Atelier Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Client Proof & Testimonials */}
      <section className="pt-12 border-t border-[#4A1828]/15 space-y-8">
        <div className="max-w-xl space-y-2">
          <h2 className="font-serif text-3xl font-semibold text-[#21171A]">
            Worn Across Karachi &amp; Beyond
          </h2>
          <p className="text-sm text-[#6A5A5E]">
            Reflections from brides and patrons visiting our DHA Karachi flagship and ordering worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLIENT_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="p-6 bg-[#F4ECE4] border border-[#4A1828]/12 flex flex-col justify-between space-y-5"
            >
              <p className="text-sm text-[#3B2E32] leading-relaxed">
                “{item.quote}”
              </p>
              <footer className="pt-4 border-t border-[#4A1828]/12">
                <p className="font-serif text-lg font-medium text-[#4A1828]">
                  {item.name} · {item.city}
                </p>
                <p className="text-xs text-[#6A5A5E] mt-0.5">{item.occasion}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Private Bridal & Bespoke Consultation Booking */}
      <section className="pt-12 border-t border-[#4A1828]/15 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif text-3xl font-semibold text-[#21171A]">
            Visit Our Karachi Outlet or Book a Video Fitting
          </h2>
          <p className="text-sm text-[#6A5A5E] leading-relaxed">
            Reserve an in-person bridal or formal consultation at our Zamzama outlet in Karachi, or schedule a one-on-one WhatsApp video consultation with our head stylists.
          </p>
          <div className="pt-2 space-y-2 text-sm text-[#3B2E32]">
            <p>
              <strong>Karachi Outlet:</strong> {siteConfig.outletAddress}
            </p>
            <p>
              <strong>WhatsApp Concierge:</strong> {siteConfig.whatsappPhone}
            </p>
            <p>
              <strong>Hours:</strong> {siteConfig.outletHours}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#F4ECE4] border border-[#4A1828]/15 p-6 sm:p-8">
          {bookingRef ? (
            <div className="py-8 space-y-4">
              <div className="flex items-center gap-3 text-[#2D6A4F]">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-serif text-2xl font-semibold text-[#4A1828]">
                  Appointment Confirmed ({bookingRef})
                </h3>
              </div>
              <p className="text-sm text-[#3B2E32] leading-relaxed">
                Thank you, {name}. Our Karachi outlet coordinator will contact you on{' '}
                <strong>{phone}</strong> within 4 business hours to confirm your{' '}
                {appointmentType.toLowerCase()} for {interest}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingRef(null);
                  setName('');
                  setPhone('');
                }}
                className="px-5 py-2.5 bg-[#4A1828] text-[#FCF9F4] text-xs font-medium rounded hover:bg-[#38111E] transition-colors"
              >
                Schedule Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                Full Name *
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                />
              </label>

              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                Phone / WhatsApp *
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 ..."
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                />
              </label>

              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                City &amp; Country
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Karachi / Islamabad / London"
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                />
              </label>

              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                Consultation Format
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                >
                  <option>Karachi Flagship Visit (DHA Phase 5)</option>
                  <option>WhatsApp Video Styling &amp; Sizing</option>
                </select>
              </label>

              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                Ensemble Category
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                >
                  <option>Bridal Couture &amp; Barat Lehenga</option>
                  <option>Walima &amp; Nikkah Peshwas</option>
                  <option>Festive Formals &amp; Gharara</option>
                  <option>Bespoke Trousseau (5+ Outfits)</option>
                </select>
              </label>

              <label className="text-xs text-[#6A5A5E] flex flex-col gap-1.5">
                Preferred Date
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#FCF9F4] border border-[#4A1828]/20 rounded text-sm text-[#21171A]"
                />
              </label>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#4A1828] text-[#FCF9F4] text-sm font-medium rounded hover:bg-[#38111E] transition-colors"
                >
                  Request Karachi Outlet Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
