/**
 * Tipos do sistema de calculadora de preços
 */

export interface PriceBreak {
  minQty: number;
  unit: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  priceBreaks: PriceBreak[];
  baseDevCost?: number;
}

export interface AddOn {
  id: string;
  label: string;
  addPerUnit?: number;
  devCost?: number;
}

export interface ColorOption {
  id: string;
  label: string;
  add?: number;
}

export interface ConfigSchema {
  currency: string;
  products: Product[];
  options: {
    colors?: ColorOption[];
    artwork?: AddOn[];
    neckLabel?: AddOn[];
  };
  leadTimeRules: Array<{ minQty: number; days: number }>;
  limits: { minQty: number; maxQty: number; qtyStep?: number };
  cta: { 
    startDesignUrl?: string; 
    emailSubject?: string; 
    emailTo?: string; 
  };
}

export interface EmbellishmentItem {
  id: string;
  type: 'screenprint' | 'embroidery';
  isExpanded: boolean;
  config: {
    // Screen Print
    sp_colors?: string;
    sp_size?: string;
    sp_extras?: string;
    // Embroidery
    emb_colors?: string;
    emb_area?: string;
    emb_3d?: boolean;
  };
}

export interface QuoteState {
  selectedProductId: string;
  quantity: number;
  selectedColor: string;
  selectedArtwork: string;
  selectedNeckLabel: string;
  embellishments: EmbellishmentItem[];
}

export interface QuoteCalculation {
  unitCost: number;
  devCosts: number;
  subtotal: number;
  leadTimeDays: number;
  estimatedDelivery: string; // MM/dd/yyyy format
}

export interface QuotePayload extends QuoteState, QuoteCalculation {
  product: Product;
  currency: string;
  timestamp: string;
}

// Eventos customizados
export interface QuoteChangeEvent extends CustomEvent {
  detail: QuotePayload;
}

export interface QuoteSubmitEvent extends CustomEvent {
  detail: QuotePayload & {
    action: 'email' | 'design';
  };
}
