# 🧮 Bioblanks Quote Calculator

> Calculadora de preços modular e interativa para Webflow - Refatorada de embed para micro-frontend TypeScript

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() 
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)]() 
[![Webflow](https://img.shields.io/badge/Webflow-4353FF?logo=webflow&logoColor=white)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

## 🎯 Visão Geral

Esta calculadora foi refatorada de um embed HTML monolítico para uma arquitetura modular em TypeScript, mantendo **100% da funcionalidade e visual originais** enquanto adiciona:

- ✅ **Engine de preços isolada** e testável
- ✅ **Web Components** que se conectam ao HTML existente  
- ✅ **Bundle único** (3.72 kB) pronto para Webflow
- ✅ **Eventos customizados** para integração avançada
- ✅ **Dados mock** para desenvolvimento independente

## 🚀 Demo ao Vivo

- **[Demo Online](https://bioblanks-accounts.github.io/bioblanks-quote-calculator/)** - Versão de desenvolvimento
- **[Webflow Production](https://seu-site.webflow.io/)** - Versão integrada

## 📋 Funcionalidades

### 🛍️ Produtos & Customizações
- Dropdown dinâmico de produtos (Hoodie, Cap, T-Shirt)
- Seleção de cores com preços diferenciados
- Opções de artwork (screen printing, embroidery)
- Neck labels personalizados
- **Embellishments** com configurações avançadas

### 💰 Engine de Preços
- Faixas de preço por quantidade (1, 25, 50, 100+)
- Cálculo automático de custos unitários
- Lead times baseados em volume
- **Data de entrega estimada** (dias úteis)
- Formatação de moeda localizada

### 🎨 Interface & UX
- Design responsivo e acessível
- Controles de quantidade (input + slider + botões)
- Métricas em tempo real
- Visual idêntico ao embed original
- Suporte a teclado e screen readers

## 🛠️ Instalação & Uso

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/Bioblanks-accounts/bioblanks-quote-calculator.git
cd bioblanks-quote-calculator

# Instale dependências
npm install

# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Executar testes
npm test
```

### Integração no Webflow

#### Opção 1: Script Inline (Recomendado)
```html
<!-- Cole antes do </body> no Webflow -->
<script>
// Cole aqui o conteúdo de dist/quote-calc.v1.js
</script>
```

#### Opção 2: CDN Externo
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@main/dist/quote-calc.v1.js"></script>
```

#### Opção 3: Upload de Arquivo
1. Faça upload do `dist/quote-calc.v1.js` para seu hosting
2. Referencie o arquivo no Webflow Custom Code

## 📁 Estrutura do Projeto

```
bioblanks-quote-calculator/
├── src/
│   ├── types.ts           # Tipos TypeScript (ConfigSchema, Product, etc)
│   ├── pricing-core.ts    # Engine de preços (funções puras)
│   ├── pricing-core.test.ts # Testes da engine
│   ├── mock-data.ts       # Dados mock para desenvolvimento
│   ├── quote-wc.ts        # Web Component principal
│   └── loader.ts          # Inicializador (entry point)
├── dist/
│   └── quote-calc.v1.js   # Bundle final para produção
├── embed.html             # HTML original do embed
├── index.html             # Página de desenvolvimento
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração do Vite
├── vitest.config.ts       # Configuração de testes
└── README.md              # Esta documentação
```

## 🧪 API & Eventos

### Eventos Customizados

```javascript
// Escutar mudanças na calculadora
document.addEventListener('quote:change', (event) => {
  console.log('Quote atualizado:', event.detail);
  // event.detail contém: product, quantity, prices, delivery, etc.
});

// Escutar submissões
document.addEventListener('quote:submit', (event) => {
  console.log('Quote enviado:', event.detail);
  // event.detail.action = 'email' | 'design'
});
```

### Controle Programático

```javascript
// Obter instância do componente
const calc = document.querySelector('bioblanks-quote-calc');

// Atualizar configuração
calc.setConfig(newConfigData);

// Forçar reinicialização
window.initBioblanksCalculator();
```

## 🔧 Configuração de Dados

### Estrutura do ConfigSchema

```typescript
interface ConfigSchema {
  currency: string;           // "USD", "EUR", etc.
  products: Product[];        // Array de produtos disponíveis
  options: {
    colors?: ColorOption[];   // Cores disponíveis
    artwork?: AddOn[];        // Opções de artwork
    neckLabel?: AddOn[];      // Tipos de neck label
  };
  leadTimeRules: Array<{      // Regras de lead time
    minQty: number;
    days: number;
  }>;
  limits: {                   // Limites de quantidade
    minQty: number;
    maxQty: number;
    qtyStep?: number;
  };
  cta: {                      // Call-to-actions
    startDesignUrl?: string;
    emailSubject?: string;
    emailTo?: string;
  };
}
```

### Conectar ao CMS do Webflow

Para substituir dados mock por dados reais:

1. **Edite `src/loader.ts`**
2. **Substitua `mockConfig`** por carregamento do CMS:

```typescript
// Exemplo de integração com Webflow CMS
async function loadConfigFromWebflow() {
  const response = await fetch('/api/calculator-config');
  return await response.json();
}

// No loader.ts
const config = await loadConfigFromWebflow();
calcComponent.setConfig(config);
```

## 🧪 Testes

### Executar Testes
```bash
npm test          # Executar todos os testes
npm run test:ui   # Interface visual dos testes
```

### Cobertura de Testes
- ✅ **Engine de preços** - 100% das funções puras
- ✅ **Cálculo de faixas** - Diferentes quantidades
- ✅ **Lead times** - Regras de prazo
- ✅ **Formatação** - Moedas e datas
- ✅ **Dias úteis** - Cálculo de delivery
- ⚠️ **Componentes DOM** - Pendente (4/19 testes)

## 🎨 Personalização

### Variáveis CSS
```css
#quote-calc {
  --rc-font: system-ui, sans-serif;
  --rc-bg: #f4f5f6;
  --rc-card: #ffffff;
  --rc-text: #0f172a;
  --rc-accent: #111827;
  --rc-radius: 12px;
  /* ... mais variáveis disponíveis */
}
```

### Temas Customizados
```css
/* Tema escuro */
#quote-calc.dark-theme {
  --rc-bg: #1a1a1a;
  --rc-card: #2a2a2a;
  --rc-text: #ffffff;
}
```

## 🚧 Roadmap

### Próximas Funcionalidades
- [ ] **Integração CMS** - Conexão direta com Webflow CMS API
- [ ] **Cálculo de Embellishments** - Preços dinâmicos para screen print/embroidery
- [ ] **Feriados** - Suporte a feriados no cálculo de delivery
- [ ] **Cutoff de Horário** - Pedidos após horário específico
- [ ] **Analytics** - Tracking de eventos de conversão
- [ ] **A/B Testing** - Variações de interface
- [ ] **Multi-moeda** - Suporte a mais moedas
- [ ] **Testes E2E** - Cypress/Playwright

### Melhorias Técnicas
- [ ] **Bundle Splitting** - Carregamento lazy de componentes
- [ ] **Web Workers** - Cálculos em background
- [ ] **PWA** - Cache offline da calculadora
- [ ] **Storybook** - Documentação visual dos componentes

## 🤝 Contribuição

### Como Contribuir
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código
- **TypeScript** com tipagem estrita
- **Prettier** para formatação
- **ESLint** para qualidade de código
- **Conventional Commits** para mensagens

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/discussions)
- 📧 **Email**: dev@bioblanks.com

## 🏆 Changelog

### v1.0.0 (2024-08-15)
- ✨ Primeira versão da calculadora refatorada
- ✨ Engine de preços isolada e testável
- ✨ Web Components com eventos customizados
- ✨ Build otimizado de 3.72 kB
- ✨ Dados mock para desenvolvimento
- ✨ Integração mantida com Webflow Forms

---

**Desenvolvido com ❤️ pela equipe Bioblanks**