/**
 * Engine de preços - Funções puras para cálculos
 */

import type { 
  PriceBreak, 
  ConfigSchema, 
  QuoteState, 
  QuoteCalculation,
  AddOn 
} from './types.js';

/**
 * Encontra o preço unitário baseado na quantidade e faixas de preço
 */
export function unitForQty(priceBreaks: PriceBreak[], qty: number): number {
  if (!priceBreaks || priceBreaks.length === 0) return 0;
  
  // Ordena por minQty crescente e encontra a maior faixa aplicável
  const sorted = [...priceBreaks].sort((a, b) => a.minQty - b.minQty);
  let applicable = sorted[0]; // fallback para primeira faixa
  
  for (const tier of sorted) {
    if (qty >= tier.minQty) {
      applicable = tier;
    } else {
      break;
    }
  }
  
  return applicable.unit;
}

/**
 * Encontra os dias de lead time baseado na quantidade
 */
export function leadDaysForQty(leadTimeRules: Array<{ minQty: number; days: number }>, qty: number): number {
  if (!leadTimeRules || leadTimeRules.length === 0) return 5; // fallback
  
  const sorted = [...leadTimeRules].sort((a, b) => a.minQty - b.minQty);
  let applicable = sorted[0];
  
  for (const rule of sorted) {
    if (qty >= rule.minQty) {
      applicable = rule;
    } else {
      break;
    }
  }
  
  return applicable.days;
}

/**
 * Calcula o próximo dia útil (segunda-feira se hoje for fim de semana)
 */
export function getNextBusinessDay(date: Date = new Date()): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay(); // 0=domingo, 6=sábado
  
  if (dayOfWeek === 0) { // domingo
    result.setDate(result.getDate() + 1); // segunda
  } else if (dayOfWeek === 6) { // sábado
    result.setDate(result.getDate() + 2); // segunda
  }
  // Para dias úteis (1-5), retorna a mesma data
  
  return result;
}

/**
 * Adiciona N dias úteis a uma data (exclui sábados e domingos)
 */
export function addBusinessDays(startDate: Date, businessDays: number): Date {
  const result = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    
    // Se não for sábado (6) nem domingo (0), conta como dia útil
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }
  
  return result;
}

/**
 * Calcula a data estimada de entrega
 */
export function calculateDeliveryDate(leadTimeDays: number, orderDate: Date = new Date()): string {
  const startDate = getNextBusinessDay(orderDate);
  const deliveryDate = addBusinessDays(startDate, leadTimeDays);
  
  // Formato americano MM/dd/yyyy
  const month = (deliveryDate.getMonth() + 1).toString().padStart(2, '0');
  const day = deliveryDate.getDate().toString().padStart(2, '0');
  const year = deliveryDate.getFullYear();
  
  return `${month}/${day}/${year}`;
}

/**
 * Encontra um addon por ID em uma lista
 */
export function findAddonById(addons: AddOn[] | undefined, id: string): AddOn | undefined {
  return addons?.find(addon => addon.id === id);
}

/**
 * Calcula o custo total de um quote
 */
export function computeSubtotal(
  config: ConfigSchema,
  state: QuoteState
): QuoteCalculation {
  const product = config.products.find(p => p.id === state.selectedProductId);
  if (!product) {
    return {
      unitCost: 0,
      devCosts: 0,
      subtotal: 0,
      leadTimeDays: 5,
      estimatedDelivery: calculateDeliveryDate(5)
    };
  }

  // Preço base por unidade
  let unitCost = unitForQty(product.priceBreaks, state.quantity);
  
  // Adiciona custos das opções selecionadas
  const colorOption = config.options.colors?.find(c => c.id === state.selectedColor);
  if (colorOption?.add) {
    unitCost += colorOption.add;
  }
  
  const artworkOption = findAddonById(config.options.artwork, state.selectedArtwork);
  if (artworkOption?.addPerUnit) {
    unitCost += artworkOption.addPerUnit;
  }
  
  const neckLabelOption = findAddonById(config.options.neckLabel, state.selectedNeckLabel);
  if (neckLabelOption?.addPerUnit) {
    unitCost += neckLabelOption.addPerUnit;
  }

  // Custos de desenvolvimento (uma vez só)
  let devCosts = product.baseDevCost || 0;
  
  if (artworkOption?.devCost) {
    devCosts += artworkOption.devCost;
  }
  
  if (neckLabelOption?.devCost) {
    devCosts += neckLabelOption.devCost;
  }

  // Subtotal
  const subtotal = (unitCost * state.quantity) + devCosts;
  
  // Lead time
  const leadTimeDays = leadDaysForQty(config.leadTimeRules, state.quantity);
  
  // Data de entrega
  const estimatedDelivery = calculateDeliveryDate(leadTimeDays);

  return {
    unitCost,
    devCosts,
    subtotal,
    leadTimeDays,
    estimatedDelivery
  };
}

/**
 * Formata um valor monetário baseado na moeda
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'BRL': 'R$'
  };
  
  const symbol = currencyMap[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}
