/**
 * Loader - Inicializa o Web Component no Webflow
 */

import { BioblanksQuoteCalc } from './quote-wc.js';
import { mockConfig } from './mock-data.js';

// Aguarda o DOM estar pronto
function initCalculator() {
  const container = document.getElementById('quote-calc');
  
  if (!container) {
    console.error('Container #quote-calc não encontrado. Verifique se o Embed está na página.');
    return;
  }

  // Verifica se já existe um Web Component
  let calcComponent = container.querySelector('bioblanks-quote-calc') as BioblanksQuoteCalc;
  
  if (!calcComponent) {
    // Cria o Web Component
    calcComponent = document.createElement('bioblanks-quote-calc') as BioblanksQuoteCalc;
    
    // Anexa (invisível) ao container
    calcComponent.style.display = 'none';
    container.appendChild(calcComponent);
  }

  // Configura com dados mock
  calcComponent.setConfig(mockConfig);

  // Event listeners opcionais para debug
  calcComponent.addEventListener('quote:change', ((event: CustomEvent) => {
    console.log('Quote changed:', event.detail);
  }) as EventListener);

  calcComponent.addEventListener('quote:submit', ((event: CustomEvent) => {
    console.log('Quote submitted:', event.detail);
  }) as EventListener);

  console.log('✅ Bioblanks Quote Calculator initialized');
}

// Executa quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  // DOM já está pronto
  initCalculator();
}

// Fallback para execução manual
(window as any).initBioblanksCalculator = initCalculator;

// Expor tipos para desenvolvimento (opcional)
export type { ConfigSchema, QuotePayload } from './types.js';
