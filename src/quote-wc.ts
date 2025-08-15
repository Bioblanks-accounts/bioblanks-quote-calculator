/**
 * Web Component que conecta ao HTML existente da calculadora
 */

import type { 
  ConfigSchema, 
  QuoteState, 
  QuoteCalculation, 
  QuotePayload,
  EmbellishmentItem 
} from './types.js';
import { computeSubtotal, formatCurrency } from './pricing-core.js';

export class BioblanksQuoteCalc extends HTMLElement {
  private config: ConfigSchema | null = null;
  private state: QuoteState;
  private calculation: QuoteCalculation;
  
  // Cache de elementos DOM
  private elements: {
    productSelect?: HTMLSelectElement;
    productCard?: HTMLElement | null;
    productImage?: HTMLImageElement;
    productName?: HTMLElement | null;
    productDesc?: HTMLElement | null;
    colorSelect?: HTMLSelectElement;
    artworkSelect?: HTMLSelectElement;
    neckLabelSelect?: HTMLSelectElement;
    quantityInput?: HTMLInputElement;
    quantitySlider?: HTMLInputElement;
    qtyDecBtn?: HTMLButtonElement;
    qtyIncBtn?: HTMLButtonElement;
    // Readouts
    leadTimeValue?: HTMLElement | null;
    deliveryDateValue?: HTMLElement | null;
    quantityValue?: HTMLElement | null;
    unitCostValue?: HTMLElement | null;
    subtotalValue?: HTMLElement | null;
    // Embellishments
    addScreenprintBtn?: HTMLButtonElement;
    addEmbroideryBtn?: HTMLButtonElement;
    embellishmentsList?: HTMLElement | null;
    // Actions
    emailBtn?: HTMLButtonElement;
    designBtn?: HTMLButtonElement;
    // Hidden form fields
    formFields?: Record<string, HTMLInputElement>;
  } = {};

  constructor() {
    super();
    
    // Estado inicial
    this.state = {
      selectedProductId: '',
      quantity: 1,
      selectedColor: '',
      selectedArtwork: '',
      selectedNeckLabel: '',
      embellishments: []
    };
    
    this.calculation = {
      unitCost: 0,
      devCosts: 0,
      subtotal: 0,
      leadTimeDays: 5,
      estimatedDelivery: ''
    };
  }

  connectedCallback() {
    this.init();
  }

  private init() {
    this.cacheElements();
    this.bindEvents();
    
    if (this.config) {
      this.populate();
      this.updateCalculation();
    }
  }

  public setConfig(config: ConfigSchema) {
    this.config = config;
    
    // Se já conectado, re-initialize
    if (this.isConnected) {
      this.populate();
      this.updateCalculation();
    }
  }

  private cacheElements() {
    const container = document.getElementById('quote-calc');
    if (!container) {
      console.error('Container #quote-calc não encontrado');
      return;
    }

    // Produto
    this.elements.productSelect = container.querySelector('#rc-product-select') as HTMLSelectElement;
    this.elements.productCard = container.querySelector('.rc-product-card');
    this.elements.productImage = container.querySelector('#rc-product-image') as HTMLImageElement;
    this.elements.productName = container.querySelector('#rc-product-name');
    this.elements.productDesc = container.querySelector('#rc-product-desc');

    // Opções
    this.elements.colorSelect = container.querySelector('#rc-color-select') as HTMLSelectElement;
    this.elements.artworkSelect = container.querySelector('#rc-artwork-select') as HTMLSelectElement;
    this.elements.neckLabelSelect = container.querySelector('#rc-neck-label-select') as HTMLSelectElement;

    // Quantidade
    this.elements.quantityInput = container.querySelector('#rc-quantity') as HTMLInputElement;
    this.elements.quantitySlider = container.querySelector('#rc-quantity-slider') as HTMLInputElement;
    this.elements.qtyDecBtn = container.querySelector('#rc-qty-dec') as HTMLButtonElement;
    this.elements.qtyIncBtn = container.querySelector('#rc-qty-inc') as HTMLButtonElement;

    // Readouts
    this.elements.leadTimeValue = container.querySelector('#rc-lead-time-value');
    this.elements.deliveryDateValue = container.querySelector('#rc-delivery-date-value');
    this.elements.quantityValue = container.querySelector('#rc-quantity-value');
    this.elements.unitCostValue = container.querySelector('#rc-unit-cost-value');
    this.elements.subtotalValue = container.querySelector('#rc-subtotal-value');

    // Embellishments
    this.elements.addScreenprintBtn = container.querySelector('#btn-add-screenprint') as HTMLButtonElement;
    this.elements.addEmbroideryBtn = container.querySelector('#btn-add-embroidery') as HTMLButtonElement;
    this.elements.embellishmentsList = container.querySelector('#rc-embellishments-list');

    // Actions
    this.elements.emailBtn = container.querySelector('#rc-send-email') as HTMLButtonElement;
    this.elements.designBtn = container.querySelector('#rc-start-design') as HTMLButtonElement;

    // Hidden form fields
    this.elements.formFields = {};
    const hiddenFields = [
      'product_id', 'product_name', 'quantity', 'color', 'artwork', 
      'neck_label', 'unit_cost', 'subtotal', 'lead_time', 'estimated_delivery_date',
      'options_json'
    ];
    
    hiddenFields.forEach(field => {
      const input = container.querySelector(`input[name="${field}"]`) as HTMLInputElement;
      if (input) {
        this.elements.formFields![field] = input;
      }
    });
  }

  private bindEvents() {
    // Produto
    this.elements.productSelect?.addEventListener('change', () => {
      this.state.selectedProductId = this.elements.productSelect!.value;
      this.updateProductCard();
      this.updateCalculation();
    });

    // Opções
    this.elements.colorSelect?.addEventListener('change', () => {
      this.state.selectedColor = this.elements.colorSelect!.value;
      this.updateCalculation();
    });

    this.elements.artworkSelect?.addEventListener('change', () => {
      this.state.selectedArtwork = this.elements.artworkSelect!.value;
      this.updateCalculation();
    });

    this.elements.neckLabelSelect?.addEventListener('change', () => {
      this.state.selectedNeckLabel = this.elements.neckLabelSelect!.value;
      this.updateCalculation();
    });

    // Quantidade - input
    this.elements.quantityInput?.addEventListener('input', () => {
      const value = parseInt(this.elements.quantityInput!.value, 10);
      if (!isNaN(value)) {
        this.updateQuantity(value);
      }
    });

    // Quantidade - slider
    this.elements.quantitySlider?.addEventListener('input', () => {
      const value = parseInt(this.elements.quantitySlider!.value, 10);
      this.updateQuantity(value);
    });

    // Quantidade - botões
    this.elements.qtyDecBtn?.addEventListener('click', () => {
      const newQty = Math.max(this.config?.limits.minQty || 1, this.state.quantity - 1);
      this.updateQuantity(newQty);
    });

    this.elements.qtyIncBtn?.addEventListener('click', () => {
      const newQty = Math.min(this.config?.limits.maxQty || 1000, this.state.quantity + 1);
      this.updateQuantity(newQty);
    });

    // Embellishments
    this.elements.addScreenprintBtn?.addEventListener('click', () => {
      this.toggleEmbellishment('screenprint');
    });

    this.elements.addEmbroideryBtn?.addEventListener('click', () => {
      this.toggleEmbellishment('embroidery');
    });

    // Actions
    this.elements.emailBtn?.addEventListener('click', () => {
      this.handleSubmit('email');
    });

    this.elements.designBtn?.addEventListener('click', () => {
      this.handleSubmit('design');
    });
  }

  private populate() {
    if (!this.config) return;

    // Popular dropdown de produtos
    if (this.elements.productSelect) {
      this.elements.productSelect.innerHTML = '<option value="">Select a product...</option>';
      this.config.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        this.elements.productSelect!.appendChild(option);
      });
      
      // Selecionar primeiro produto
      if (this.config.products.length > 0) {
        this.state.selectedProductId = this.config.products[0].id;
        this.elements.productSelect.value = this.state.selectedProductId;
      }
    }

    // Popular cores
    if (this.elements.colorSelect && this.config.options.colors) {
      this.elements.colorSelect.innerHTML = '';
      this.config.options.colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.id;
        option.textContent = color.label;
        this.elements.colorSelect!.appendChild(option);
      });
      
      if (this.config.options.colors.length > 0) {
        this.state.selectedColor = this.config.options.colors[0].id;
        this.elements.colorSelect.value = this.state.selectedColor;
      }
    }

    // Popular artwork
    if (this.elements.artworkSelect && this.config.options.artwork) {
      this.elements.artworkSelect.innerHTML = '';
      this.config.options.artwork.forEach(artwork => {
        const option = document.createElement('option');
        option.value = artwork.id;
        option.textContent = artwork.label;
        this.elements.artworkSelect!.appendChild(option);
      });
      
      if (this.config.options.artwork.length > 0) {
        this.state.selectedArtwork = this.config.options.artwork[0].id;
        this.elements.artworkSelect.value = this.state.selectedArtwork;
      }
    }

    // Popular neck label
    if (this.elements.neckLabelSelect && this.config.options.neckLabel) {
      this.elements.neckLabelSelect.innerHTML = '';
      this.config.options.neckLabel.forEach(label => {
        const option = document.createElement('option');
        option.value = label.id;
        option.textContent = label.label;
        this.elements.neckLabelSelect!.appendChild(option);
      });
      
      if (this.config.options.neckLabel.length > 0) {
        this.state.selectedNeckLabel = this.config.options.neckLabel[0].id;
        this.elements.neckLabelSelect.value = this.state.selectedNeckLabel;
      }
    }

    // Configurar slider de quantidade
    if (this.elements.quantitySlider) {
      this.elements.quantitySlider.min = String(this.config.limits.minQty);
      this.elements.quantitySlider.max = String(this.config.limits.maxQty);
      this.elements.quantitySlider.step = String(this.config.limits.qtyStep || 1);
      this.elements.quantitySlider.value = String(this.state.quantity);
    }

    this.updateProductCard();
  }

  private updateProductCard() {
    if (!this.config) return;
    
    const product = this.config.products.find(p => p.id === this.state.selectedProductId);
    if (!product) return;

    if (this.elements.productImage && product.image) {
      this.elements.productImage.src = product.image;
      this.elements.productImage.alt = product.name;
    }

    if (this.elements.productName) {
      this.elements.productName.textContent = product.name;
    }

    if (this.elements.productDesc && product.description) {
      this.elements.productDesc.textContent = product.description;
    }

    // Mostrar/esconder card
    if (this.elements.productCard) {
      this.elements.productCard.style.display = product ? 'block' : 'none';
    }
  }

  private updateQuantity(newQty: number) {
    this.state.quantity = newQty;
    
    // Sincronizar todos os inputs de quantidade
    if (this.elements.quantityInput) {
      this.elements.quantityInput.value = String(newQty);
    }
    
    if (this.elements.quantitySlider) {
      this.elements.quantitySlider.value = String(newQty);
    }
    
    this.updateCalculation();
  }

  private updateCalculation() {
    if (!this.config) return;

    this.calculation = computeSubtotal(this.config, this.state);
    this.updateReadouts();
    this.updateHiddenFields();
    this.emitChangeEvent();
  }

  private updateReadouts() {
    const currency = this.config?.currency || 'USD';

    if (this.elements.leadTimeValue) {
      this.elements.leadTimeValue.textContent = `${this.calculation.leadTimeDays} business days`;
    }

    if (this.elements.deliveryDateValue) {
      this.elements.deliveryDateValue.textContent = this.calculation.estimatedDelivery;
    }

    if (this.elements.quantityValue) {
      this.elements.quantityValue.textContent = String(this.state.quantity);
    }

    if (this.elements.unitCostValue) {
      this.elements.unitCostValue.textContent = formatCurrency(this.calculation.unitCost, currency);
    }

    if (this.elements.subtotalValue) {
      this.elements.subtotalValue.textContent = formatCurrency(this.calculation.subtotal, currency);
    }
  }

  private updateHiddenFields() {
    if (!this.config || !this.elements.formFields) return;

    const product = this.config.products.find(p => p.id === this.state.selectedProductId);
    const fields = this.elements.formFields;

    if (fields.product_id) fields.product_id.value = this.state.selectedProductId;
    if (fields.product_name) fields.product_name.value = product?.name || '';
    if (fields.quantity) fields.quantity.value = String(this.state.quantity);
    if (fields.color) fields.color.value = this.state.selectedColor;
    if (fields.artwork) fields.artwork.value = this.state.selectedArtwork;
    if (fields.neck_label) fields.neck_label.value = this.state.selectedNeckLabel;
    if (fields.unit_cost) fields.unit_cost.value = String(this.calculation.unitCost);
    if (fields.subtotal) fields.subtotal.value = String(this.calculation.subtotal);
    if (fields.lead_time) fields.lead_time.value = String(this.calculation.leadTimeDays);
    if (fields.estimated_delivery_date) fields.estimated_delivery_date.value = this.calculation.estimatedDelivery;
    
    // Options JSON
    if (fields.options_json) {
      const optionsData = {
        color: this.state.selectedColor,
        artwork: this.state.selectedArtwork,
        neckLabel: this.state.selectedNeckLabel,
        embellishments: this.state.embellishments
      };
      fields.options_json.value = JSON.stringify(optionsData);
    }
  }

  private toggleEmbellishment(type: 'screenprint' | 'embroidery') {
    const existing = this.state.embellishments.find(e => e.type === type);
    
    if (existing) {
      // Toggle expand/collapse
      existing.isExpanded = !existing.isExpanded;
    } else {
      // Criar novo
      const newItem: EmbellishmentItem = {
        id: `${type}-${Date.now()}`,
        type,
        isExpanded: true,
        config: {}
      };
      this.state.embellishments.push(newItem);
    }
    
    this.renderEmbellishments();
    this.updateCalculation();
  }

  private renderEmbellishments() {
    if (!this.elements.embellishmentsList) return;

    const container = this.elements.embellishmentsList;
    container.innerHTML = '';

    this.state.embellishments.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'rc-emb-row';
      row.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 8px;
      `;

      const content = item.type === 'screenprint' 
        ? this.createScreenprintFields(item, index)
        : this.createEmbroideryFields(item, index);

      row.innerHTML = `
        <span style="font-weight: 500; min-width: 20px;">${index + 1}.</span>
        <span style="min-width: 100px; font-weight: 500; text-transform: capitalize;">${item.type}</span>
        ${item.isExpanded ? content : ''}
        <button type="button" class="rc-emb-remove" data-index="${index}" style="
          margin-left: auto;
          padding: 4px 8px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">✕</button>
      `;

      container.appendChild(row);

      // Bind events
      const removeBtn = row.querySelector('.rc-emb-remove') as HTMLButtonElement;
      removeBtn?.addEventListener('click', () => {
        this.state.embellishments.splice(index, 1);
        this.renderEmbellishments();
        this.updateCalculation();
      });

      // Bind field events se expandido
      if (item.isExpanded) {
        this.bindEmbellishmentFieldEvents(row, item);
      }
    });
  }

  private createScreenprintFields(item: EmbellishmentItem, index: number): string {
    return `
      <select name="sp_colors_${index}" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="1-color" ${item.config.sp_colors === '1-color' ? 'selected' : ''}>1 color</option>
        <option value="2-colors" ${item.config.sp_colors === '2-colors' ? 'selected' : ''}>2 colors</option>
        <option value="3-colors" ${item.config.sp_colors === '3-colors' ? 'selected' : ''}>3+ colors</option>
      </select>
      <select name="sp_size_${index}" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="8x10" ${item.config.sp_size === '8x10' ? 'selected' : ''}>8x10</option>
        <option value="10x12" ${item.config.sp_size === '10x12' ? 'selected' : ''}>10x12</option>
        <option value="12x14" ${item.config.sp_size === '12x14' ? 'selected' : ''}>12x14</option>
      </select>
      <select name="sp_extras_${index}" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="plastisol" ${item.config.sp_extras === 'plastisol' ? 'selected' : ''}>None (Plastisol)</option>
        <option value="water-based" ${item.config.sp_extras === 'water-based' ? 'selected' : ''}>Water-based</option>
        <option value="puff" ${item.config.sp_extras === 'puff' ? 'selected' : ''}>Puff</option>
      </select>
    `;
  }

  private createEmbroideryFields(item: EmbellishmentItem, index: number): string {
    return `
      <select name="emb_colors_${index}" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="1-3" ${item.config.emb_colors === '1-3' ? 'selected' : ''}>1-3 colors</option>
        <option value="4-6" ${item.config.emb_colors === '4-6' ? 'selected' : ''}>4-6 colors</option>
        <option value="7-plus" ${item.config.emb_colors === '7-plus' ? 'selected' : ''}>7+ colors</option>
      </select>
      <select name="emb_area_${index}" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="25cm2" ${item.config.emb_area === '25cm2' ? 'selected' : ''}>25cm²</option>
        <option value="50cm2" ${item.config.emb_area === '50cm2' ? 'selected' : ''}>50cm²</option>
        <option value="75cm2" ${item.config.emb_area === '75cm2' ? 'selected' : ''}>75cm²</option>
      </select>
      <label style="display: flex; align-items: center; gap: 4px; font-size: 14px;">
        <input type="checkbox" name="emb_3d_${index}" ${item.config.emb_3d ? 'checked' : ''}> 3D
      </label>
    `;
  }

  private bindEmbellishmentFieldEvents(row: HTMLElement, item: EmbellishmentItem) {
    const selects = row.querySelectorAll('select');
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');

    selects.forEach(select => {
      select.addEventListener('change', () => {
        const name = select.name;
        if (name.startsWith('sp_')) {
          const field = name.replace(/_\d+$/, '');
          (item.config as any)[field] = select.value;
        } else if (name.startsWith('emb_')) {
          const field = name.replace(/_\d+$/, '');
          (item.config as any)[field] = select.value;
        }
        this.updateCalculation();
      });
    });

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        item.config.emb_3d = (checkbox as HTMLInputElement).checked;
        this.updateCalculation();
      });
    });
  }

  private emitChangeEvent() {
    if (!this.config) return;

    const product = this.config.products.find(p => p.id === this.state.selectedProductId);
    if (!product) return;

    const payload: QuotePayload = {
      ...this.state,
      ...this.calculation,
      product,
      currency: this.config.currency,
      timestamp: new Date().toISOString()
    };

    const event = new CustomEvent('quote:change', {
      detail: payload,
      bubbles: true
    });

    this.dispatchEvent(event);
  }

  private handleSubmit(action: 'email' | 'design') {
    if (!this.config) return;

    const product = this.config.products.find(p => p.id === this.state.selectedProductId);
    if (!product) return;

    const payload: QuotePayload & { action: typeof action } = {
      ...this.state,
      ...this.calculation,
      product,
      currency: this.config.currency,
      timestamp: new Date().toISOString(),
      action
    };

    const event = new CustomEvent('quote:submit', {
      detail: payload,
      bubbles: true
    });

    this.dispatchEvent(event);

    if (action === 'email') {
      // Trigger do form do Webflow
      const form = document.querySelector('#quote-calc form') as HTMLFormElement;
      if (form) {
        form.submit();
      }
    } else if (action === 'design' && this.config.cta.startDesignUrl) {
      window.open(this.config.cta.startDesignUrl, '_blank');
    }
  }
}

// Registrar o Web Component
customElements.define('bioblanks-quote-calc', BioblanksQuoteCalc);
