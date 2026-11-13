import { ProductItem } from './data/products';

export type DressSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom Size';

export interface CustomMeasurements {
  shirtLength: string;
  chest: string;
  waist: string;
  hip: string;
  sleeves: string;
  notes: string;
}

export interface CartItem {
  cartItemId: string;
  product: ProductItem;
  size: DressSize;
  quantity: number;
  customMeasurements?: CustomMeasurements;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'Cash on Delivery (COD)' | 'Bank Transfer (IBFT)' | 'Card Payment';
  items: CartItem[];
  subtotalPKR: number;
  shippingPKR: number;
  totalPKR: number;
  statusStep: number; // 0: Confirmed, 1: Tailoring & Embroidery, 2: Quality Check, 3: Dispatched
}
