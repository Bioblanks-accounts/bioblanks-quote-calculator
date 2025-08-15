/**
 * Testes da engine de preços
 */

import { describe, it, expect } from 'vitest';
import { 
  unitForQty, 
  leadDaysForQty, 
  getNextBusinessDay, 
  addBusinessDays, 
  calculateDeliveryDate,
  computeSubtotal,
  formatCurrency 
} from './pricing-core.js';
import type { ConfigSchema, QuoteState } from './types.js';

describe('unitForQty', () => {
  const priceBreaks = [
    { minQty: 1, unit: 10.00 },
    { minQty: 25, unit: 8.50 },
    { minQty: 50, unit: 7.00 },
    { minQty: 100, unit: 6.00 }
  ];

  it('should return correct price for quantity 1', () => {
    expect(unitForQty(priceBreaks, 1)).toBe(10.00);
  });

  it('should return correct price for quantity 25', () => {
    expect(unitForQty(priceBreaks, 25)).toBe(8.50);
  });

  it('should return correct price for quantity 75', () => {
    expect(unitForQty(priceBreaks, 75)).toBe(7.00);
  });

  it('should return correct price for quantity 150', () => {
    expect(unitForQty(priceBreaks, 150)).toBe(6.00);
  });

  it('should handle empty price breaks', () => {
    expect(unitForQty([], 10)).toBe(0);
  });
});

describe('leadDaysForQty', () => {
  const leadTimeRules = [
    { minQty: 1, days: 5 },
    { minQty: 25, days: 8 },
    { minQty: 100, days: 12 }
  ];

  it('should return correct lead time for small quantities', () => {
    expect(leadDaysForQty(leadTimeRules, 10)).toBe(5);
  });

  it('should return correct lead time for medium quantities', () => {
    expect(leadDaysForQty(leadTimeRules, 50)).toBe(8);
  });

  it('should return correct lead time for large quantities', () => {
    expect(leadDaysForQty(leadTimeRules, 200)).toBe(12);
  });
});

describe('getNextBusinessDay', () => {
  it('should return Monday for Saturday', () => {
    const saturday = new Date('2024-01-06'); // Saturday
    const nextBusinessDay = getNextBusinessDay(saturday);
    expect(nextBusinessDay.getDay()).toBe(1); // Monday
    expect(nextBusinessDay.getDate()).toBe(8); // Jan 8
  });

  it('should return Monday for Sunday', () => {
    const sunday = new Date('2024-01-07'); // Sunday
    const nextBusinessDay = getNextBusinessDay(sunday);
    expect(nextBusinessDay.getDay()).toBe(1); // Monday
    expect(nextBusinessDay.getDate()).toBe(8); // Jan 8
  });

  it('should return same day for weekdays', () => {
    const monday = new Date('2024-01-08'); // Monday
    const nextBusinessDay = getNextBusinessDay(monday);
    expect(nextBusinessDay.getTime()).toBe(monday.getTime());
  });
});

describe('addBusinessDays', () => {
  it('should add 5 business days correctly', () => {
    const monday = new Date('2024-01-08'); // Monday
    const result = addBusinessDays(monday, 5);
    expect(result.getDay()).toBe(1); // Next Monday (skipping weekend)
    expect(result.getDate()).toBe(15); // Jan 15
  });

  it('should skip weekends', () => {
    const wednesday = new Date('2024-01-10'); // Wednesday
    const result = addBusinessDays(wednesday, 3);
    expect(result.getDay()).toBe(1); // Monday (skipping weekend)
    expect(result.getDate()).toBe(15); // Jan 15
  });
});

describe('calculateDeliveryDate', () => {
  it('should format date correctly', () => {
    const date = calculateDeliveryDate(5, new Date('2024-01-08')); // Monday
    expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/); // MM/dd/yyyy format
  });
});

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(29.90, 'USD')).toBe('$29.90');
  });

  it('should format EUR correctly', () => {
    expect(formatCurrency(29.90, 'EUR')).toBe('€29.90');
  });

  it('should default to USD', () => {
    expect(formatCurrency(29.90)).toBe('$29.90');
  });
});

describe('computeSubtotal', () => {
  const mockConfig: ConfigSchema = {
    currency: 'USD',
    products: [
      {
        id: 'test-product',
        name: 'Test Product',
        priceBreaks: [
          { minQty: 1, unit: 20.00 },
          { minQty: 50, unit: 18.00 }
        ],
        baseDevCost: 10
      }
    ],
    options: {
      colors: [
        { id: 'red', label: 'Red', add: 1.00 }
      ],
      artwork: [
        { id: 'logo', label: 'Logo', addPerUnit: 2.00, devCost: 25 }
      ],
      neckLabel: [
        { id: 'custom', label: 'Custom', addPerUnit: 0.50, devCost: 15 }
      ]
    },
    leadTimeRules: [
      { minQty: 1, days: 5 },
      { minQty: 25, days: 8 }
    ],
    limits: { minQty: 1, maxQty: 1000 },
    cta: {}
  };

  const mockState: QuoteState = {
    selectedProductId: 'test-product',
    quantity: 10,
    selectedColor: 'red',
    selectedArtwork: 'logo',
    selectedNeckLabel: 'custom',
    embellishments: []
  };

  it('should calculate subtotal correctly', () => {
    const result = computeSubtotal(mockConfig, mockState);
    
    // Base: $20.00, Color: +$1.00, Artwork: +$2.00, Label: +$0.50 = $23.50/unit
    // Qty 10: $235.00
    // Dev costs: Base $10 + Artwork $25 + Label $15 = $50
    // Total: $235.00 + $50 = $285.00
    
    expect(result.unitCost).toBe(23.50);
    expect(result.devCosts).toBe(50);
    expect(result.subtotal).toBe(285.00);
    expect(result.leadTimeDays).toBe(5);
  });

  it('should handle missing product', () => {
    const stateWithMissingProduct = { ...mockState, selectedProductId: 'non-existent' };
    const result = computeSubtotal(mockConfig, stateWithMissingProduct);
    
    expect(result.unitCost).toBe(0);
    expect(result.subtotal).toBe(0);
  });
});
