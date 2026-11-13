import heroCoutureImg from '../assets/images/hero_maimoona_couture_1794552786917.jpg';
import pastelMintImg from '../assets/images/dress_pastel_echo_mint_1794552786915.jpg';
import roseChiffonImg from '../assets/images/dress_rose_chiffon_formal_1794552787555.jpg';
import crimsonBridalImg from '../assets/images/dress_crimson_bridal_lehenga_1794552787499.jpg';
import emeraldVelvetImg from '../assets/images/dress_emerald_velvet_shawl_1794552789684.jpg';
import ivoryChikankariImg from '../assets/images/dress_ivory_chikankari_pret_1794552789000.jpg';
import midnightShararaImg from '../assets/images/dress_midnight_sharara_1794552790133.jpg';
import atelierCraftImg from '../assets/images/atelier_embroidery_craft_1794552790482.jpg';

export type CategoryKey =
  | 'all'
  | 'luxury-pret'
  | 'festive-formals'
  | 'bridal-couture'
  | 'winter-velvet';

export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'AED';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  urduSubtitle: string;
  category: Exclude<CategoryKey, 'all'>;
  categoryLabel: string;
  collectionName: string;
  pricePKR: number;
  fabric: string;
  pieces: string;
  embroidery: string;
  colorTone: string;
  dispatchDays: string;
  availability: 'Ready to Ship' | 'Made to Order' | 'Limited Edition';
  image: string;
  aspectNote: string;
  description: string;
  careInstructions: string[];
  includedItems: string[];
  featured?: boolean;
}

export interface SiteConfig {
  brandName: string;
  announcementText: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  outletAddress: string;
  outletHours: string;
  whatsappPhone: string;
  conciergeEmail: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'Maimoona Noor Fashion',
  announcementText:
    'Karachi Flagship Outlet · Complimentary Delivery Across Pakistan Above PKR 25,000 · Cash on Delivery & Worldwide Express',
  heroKicker: 'Karachi Flagship · Zamzama & Clifton Studio',
  heroTitle: 'Heirloom Pakistani Couture, Crafted in Karachi',
  heroSubtitle:
    'Pure silk pret, hand-embellished chiffons, winter velvet shawls, and bespoke bridal lehengas tailored at our DHA Phase 5 Karachi outlet.',
  heroImage: heroCoutureImg,
  outletAddress: 'Plot 18-C, Street 4, Zamzama Commercial, DHA Phase 5, Karachi',
  outletHours: 'Monday – Saturday, 11:30 AM – 8:30 PM PKT',
  whatsappPhone: '+92 300 842 9104',
  conciergeEmail: 'concierge@maimoonanoor.pk',
};

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  PKR: { symbol: 'PKR', rate: 1, label: 'PKR' },
  USD: { symbol: '$', rate: 0.0036, label: 'USD' },
  GBP: { symbol: '£', rate: 0.0028, label: 'GBP' },
  AED: { symbol: 'AED', rate: 0.0132, label: 'AED' },
};

export function formatPrice(pricePKR: number, currency: CurrencyCode): string {
  const { symbol, rate } = CURRENCY_RATES[currency];
  const converted = pricePKR * rate;
  if (currency === 'PKR') {
    return `${symbol} ${Math.round(converted).toLocaleString('en-US')}`;
  }
  return `${symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export const HERO_MEDIA = {
  image: heroCoutureImg,
  atelierImage: atelierCraftImg,
};

export const CATEGORY_TABS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Ensembles' },
  { key: 'luxury-pret', label: 'Luxury Pret' },
  { key: 'festive-formals', label: 'Festive Formals' },
  { key: 'bridal-couture', label: 'Bridal Couture' },
  { key: 'winter-velvet', label: 'Winter Velvet' },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'mnf-01',
    slug: 'sabza-gul-gharara',
    name: 'Sabza Gul Gharara',
    urduSubtitle: 'Pastel Echo Edit',
    category: 'luxury-pret',
    categoryLabel: 'Luxury Pret',
    collectionName: 'Pastel Echo',
    pricePKR: 28500,
    fabric: 'Pure Raw Silk & Organza',
    pieces: '3-Piece Embroidered Ensemble',
    embroidery: 'Silver Tilla & Pastel Resham',
    colorTone: 'Sage Mint',
    dispatchDays: '5–7 working days',
    availability: 'Ready to Ship',
    image: pastelMintImg,
    aspectNote: '3:4 Studio Portrait',
    description:
      'Rendered in tranquil sage-mint raw silk, the Sabza Gul silhouette pairs a straight embroidered kameez finished with delicate pearl edging alongside a classic pleated gharara and scalloped floral organza dupatta.',
    careInstructions: [
      'Dry clean only; do not wring or bleach',
      'Steam press on reverse side at low silk temperature',
      'Store folded in breathable muslin garment bag',
    ],
    includedItems: [
      'Hand-finished embroidered raw silk kameez',
      'Flared pleated raw silk gharara with border work',
      'Scalloped embroidered sheer organza dupatta',
    ],
    featured: true,
  },
  {
    id: 'mnf-02',
    slug: 'gulnaar-blush-chiffon',
    name: 'Gulnaar Blush Chiffon',
    urduSubtitle: 'Noor-e-Mehfil Edit',
    category: 'festive-formals',
    categoryLabel: 'Festive Formals',
    collectionName: 'Noor-e-Mehfil',
    pricePKR: 44000,
    fabric: 'Pure Crinkle Chiffon & Raw Silk',
    pieces: '3-Piece Hand-Embellished Suit',
    embroidery: 'Pearl, Nakshi & Sequinned Jaal',
    colorTone: 'Dusty Rose Blush',
    dispatchDays: '7–10 working days',
    availability: 'Ready to Ship',
    image: roseChiffonImg,
    aspectNote: '3:4 Studio Portrait',
    description:
      'A quintessential Pakistani festive formal in dusty rose chiffon. Hand-embellished neckline motifs in pearl and antique nakshi flow down to a richly bordered daman, styled with straight raw silk trousers and a generous embroidered chiffon dupatta.',
    careInstructions: [
      'Professional dry clean recommended',
      'Avoid direct perfume spray on metallic nakshi work',
      'Keep wrapped away from prolonged direct sunlight',
    ],
    includedItems: [
      'Hand-embellished pure crinkle chiffon shirt with silk slip',
      'Tailored raw silk straight trousers',
      'Four-sided embroidered chiffon dupatta with kiran lace',
    ],
    featured: true,
  },
  {
    id: 'mnf-03',
    slug: 'zardozi-noor-peshwas',
    name: 'Zardozi Noor Peshwas',
    urduSubtitle: 'Karachi Heritage Campaign',
    category: 'festive-formals',
    categoryLabel: 'Festive Formals',
    collectionName: 'Sahil Heritage',
    pricePKR: 78500,
    fabric: 'Pure Organza & Tissue Silk',
    pieces: '3-Piece Kalidar Peshwas',
    embroidery: 'Antique Dabka, Zardozi & Marori',
    colorTone: 'Warm Ivory & Burnished Gold',
    dispatchDays: '14–18 working days',
    availability: 'Made to Order',
    image: heroCoutureImg,
    aspectNote: 'Editorial Campaign',
    description:
      'Our signature campaign silhouette tailored at our Karachi studio. Featuring sixteen hand-stitched kalis in ivory chiffon layered with antique gold zardozi, framed by a scalloped organza dupatta.',
    careInstructions: [
      'Specialist dry clean only',
      'Store flat in acid-free tissue and cotton cover',
      'Handle delicate scalloped borders with care',
    ],
    includedItems: [
      '16-panel hand-embroidered ivory kalidar peshwas',
      'Pure raw silk churidar / straight trouser',
      'Heirloom scalloped organza dupatta',
    ],
    featured: true,
  },
  {
    id: 'mnf-04',
    slug: 'shahi-sindoor-bridal-lehenga',
    name: 'Shahi Sindoor Bridal Lehenga',
    urduSubtitle: 'Ruh-e-Riwaj Bridal',
    category: 'bridal-couture',
    categoryLabel: 'Bridal Couture',
    collectionName: 'Ruh-e-Riwaj',
    pricePKR: 265000,
    fabric: 'Micro Velvet & Pure Raw Silk',
    pieces: '4-Piece Bridal Couture Set',
    embroidery: 'Heavy Dabka, Kora, Gota & Sitara',
    colorTone: 'Sindoori Crimson & Antique Gold',
    dispatchDays: '6–8 weeks bespoke crafting',
    availability: 'Made to Order',
    image: crimsonBridalImg,
    aspectNote: '3:4 Bridal Portrait',
    description:
      'Handcrafted over 420 artisan hours in our Karachi atelier, this traditional Pakistani barat lehenga pairs deep crimson raw silk and velvet with dense heritage dabka, kora, and marori architectural borders.',
    careInstructions: [
      'Couture specialist dry clean only',
      'Includes custom padded bridal storage box',
      'Complimentary post-fitting tailoring at our DHA Karachi outlet',
    ],
    includedItems: [
      'Hand-embroidered flared bridal lehenga with can-can',
      'Structured velvet & raw silk bridal choli',
      'Crimson net sar-ka-dupatta & velvet shawl',
    ],
    featured: true,
  },
  {
    id: 'mnf-05',
    slug: 'zamarrud-velvet-shawl-ensemble',
    name: 'Zamarrud Velvet Shawl Set',
    urduSubtitle: 'Sardiyon Ki Sham Edit',
    category: 'winter-velvet',
    categoryLabel: 'Winter Velvet',
    collectionName: 'Sardiyon Ki Sham',
    pricePKR: 56000,
    fabric: 'Pure Silk & 9000 Micro Velvet',
    pieces: '3-Piece Winter Festive Suit',
    embroidery: 'Antique Gold Zari & Tilla',
    colorTone: 'Deep Emerald Green',
    dispatchDays: '7–10 working days',
    availability: 'Limited Edition',
    image: emeraldVelvetImg,
    aspectNote: '3:4 Winter Lookbook',
    description:
      'Crafted for evening receptions and dholki nights, featuring an emerald pure silk shirt with gold zari motifs, tailored cigarette trousers, and a plush micro-velvet shawl framed with heirloom borders.',
    careInstructions: [
      'Dry clean only; brush velvet pile gently in one direction',
      'Never iron directly on velvet surface; use light steam',
      'Hang trousers separately from the shawl',
    ],
    includedItems: [
      'Zari-embroidered emerald pure silk shirt',
      'Tailored raw silk cigarette trousers',
      '2.75-yard embroidered micro-velvet winter shawl',
    ],
    featured: true,
  },
  {
    id: 'mnf-06',
    slug: 'noor-e-sahar-chikankari',
    name: 'Noor-e-Sahar Chikankari',
    urduSubtitle: 'Everyday Luxury Pret',
    category: 'luxury-pret',
    categoryLabel: 'Luxury Pret',
    collectionName: 'Pastel Echo',
    pricePKR: 21500,
    fabric: 'Cotton Net & Tissue Silk',
    pieces: '3-Piece Pret Ensemble',
    embroidery: 'Schiffli Chikankari & Crochet Lace',
    colorTone: 'Warm Ivory & Sand',
    dispatchDays: '3–5 working days',
    availability: 'Ready to Ship',
    image: ivoryChikankariImg,
    aspectNote: '3:4 Studio Portrait',
    description:
      'Breathable luxury designed for Karachi afternoons and Eid mornings. Intricate ivory chikankari panels and geometric jaali inserts are paired with crisp embroidered trousers and a featherlight tissue-silk dupatta.',
    careInstructions: [
      'Gentle hand wash in cold water or dry clean',
      'Dry flat in shade to preserve lace borders',
      'Steam press on medium cotton setting',
    ],
    includedItems: [
      'Cotton-net chikankari long kurta with inner slip',
      'Embroidered straight cotton-silk shalwar',
      'Lace-trimmed tissue-silk dupatta',
    ],
    featured: true,
  },
  {
    id: 'mnf-07',
    slug: 'shabnam-midnight-sharara',
    name: 'Shabnam Midnight Sharara',
    urduSubtitle: 'Noor-e-Mehfil Edit',
    category: 'festive-formals',
    categoryLabel: 'Festive Formals',
    collectionName: 'Noor-e-Mehfil',
    pricePKR: 49500,
    fabric: 'Pure Organza & Crushed Silk',
    pieces: '3-Piece Sharara Ensemble',
    embroidery: 'Gold Tilla, Resham & Scallops',
    colorTone: 'Midnight Navy & Gold',
    dispatchDays: '7–10 working days',
    availability: 'Ready to Ship',
    image: midnightShararaImg,
    aspectNote: '3:4 Evening Lookbook',
    description:
      'Dramatic evening elegance in midnight navy. A richly embroidered organza short kurti sits above a sweeping crushed silk sharara edged with broad gold banarsi borders and a scalloped organza dupatta.',
    careInstructions: [
      'Dry clean only to protect crushed silk texture',
      'Do not flatten pleated sharara folds under heavy iron',
      'Store hung on padded satin hanger',
    ],
    includedItems: [
      'Gold-embroidered midnight organza kurti with silk lining',
      'Flared crushed silk sharara with zari hem',
      'Scalloped embroidered navy organza dupatta',
    ],
    featured: true,
  },
];

export const CLIENT_TESTIMONIALS = [
  {
    name: 'Hira Salman',
    city: 'Clifton, Karachi',
    occasion: 'Barat Trousseau · Shahi Sindoor Bridal',
    quote:
      'From my first fitting at the Zamzama outlet in Karachi to the final bridal box, every dabka motif and sleeve measurement was honoured with remarkable patience and grace.',
  },
  {
    name: 'Ayesha Tariq',
    city: 'Islamabad',
    occasion: 'Sister’s Walima · Gulnaar Blush Chiffon',
    quote:
      'Ordered custom measurements from Karachi and delivery arrived in Islamabad right on time. The crinkle chiffon drape and hand-worked pearl neckline looked even richer in person.',
  },
  {
    name: 'Zara Mansoor',
    city: 'London, UK',
    occasion: 'Eid & Family Reception · Sabza Gul Gharara',
    quote:
      'Finding authentic Pakistani ghararas abroad with clean tailoring is rare. Maimoona Noor Fashion delivered within nine days from Karachi to London with crisp finishing.',
  },
];
