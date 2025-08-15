# 🧮 Bioblanks Quote Calculator

> Modular and interactive pricing calculator for Webflow - Refactored from embed to TypeScript micro-frontend

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() 
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)]() 
[![Webflow](https://img.shields.io/badge/Webflow-4353FF?logo=webflow&logoColor=white)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

## 🎯 Overview

This calculator was refactored from a monolithic HTML embed to a modular TypeScript architecture, maintaining **100% of the original functionality and visual design** while adding:

- ✅ **Isolated pricing engine** and testable
- ✅ **Web Components** that connect to existing HTML  
- ✅ **Single bundle** (3.72 kB) ready for Webflow
- ✅ **Custom events** for advanced integration
- ✅ **Mock data** for independent development

## 🚀 Live Demo

- **[Online Demo](https://bioblanks-accounts.github.io/bioblanks-quote-calculator/)** - Development version
- **[Webflow Production](https://your-site.webflow.io/)** - Integrated version

## 📋 Features

### 🛍️ Products & Customizations
- Dynamic product dropdown (Hoodie, Cap, T-Shirt)
- Color selection with differentiated pricing
- Artwork options (screen printing, embroidery)
- Custom neck labels
- **Embellishments** with advanced configurations

### 💰 Pricing Engine
- Quantity-based price breaks (1, 25, 50, 100+)
- Automatic unit cost calculation
- Volume-based lead times
- **Estimated delivery date** (business days)
- Localized currency formatting

### 🎨 Interface & UX
- Responsive and accessible design
- Quantity controls (input + slider + buttons)
- Real-time metrics
- Visual identical to original embed
- Keyboard and screen reader support

## 🛠️ Installation & Usage

### Local Development

```bash
# Clone the repository
git clone https://github.com/Bioblanks-accounts/bioblanks-quote-calculator.git
cd bioblanks-quote-calculator

# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Webflow Integration

#### Option 1: Inline Script (Recommended)
```html
<!-- Paste before </body> in Webflow -->
<script>
// Paste here the content of dist/quote-calc.v1.js
</script>
```

#### Option 2: External CDN
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@main/dist/quote-calc.v1.js"></script>
```

#### Option 3: File Upload
1. Upload `dist/quote-calc.v1.js` to your hosting
2. Reference the file in Webflow Custom Code

## 📁 Project Structure

```
bioblanks-quote-calculator/
├── src/
│   ├── types.ts           # TypeScript types (ConfigSchema, Product, etc)
│   ├── pricing-core.ts    # Pricing engine (pure functions)
│   ├── pricing-core.test.ts # Engine tests
│   ├── mock-data.ts       # Mock data for development
│   ├── quote-wc.ts        # Main Web Component
│   └── loader.ts          # Initializer (entry point)
├── dist/
│   └── quote-calc.v1.js   # Final production bundle
├── embed.html             # Original embed HTML
├── index.html             # Development page
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Test configuration
└── README.md              # This documentation
```

## 🧪 API & Events

### Custom Events

```javascript
// Listen to calculator changes
document.addEventListener('quote:change', (event) => {
  console.log('Quote updated:', event.detail);
  // event.detail contains: product, quantity, prices, delivery, etc.
});

// Listen to submissions
document.addEventListener('quote:submit', (event) => {
  console.log('Quote submitted:', event.detail);
  // event.detail.action = 'email' | 'design'
});
```

### Programmatic Control

```javascript
// Get component instance
const calc = document.querySelector('bioblanks-quote-calc');

// Update configuration
calc.setConfig(newConfigData);

// Force reinitialization
window.initBioblanksCalculator();
```

## 🔧 Data Configuration

### ConfigSchema Structure

```typescript
interface ConfigSchema {
  currency: string;           // "USD", "EUR", etc.
  products: Product[];        // Array of available products
  options: {
    colors?: ColorOption[];   // Available colors
    artwork?: AddOn[];        // Artwork options
    neckLabel?: AddOn[];      // Neck label types
  };
  leadTimeRules: Array<{      // Lead time rules
    minQty: number;
    days: number;
  }>;
  limits: {                   // Quantity limits
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

### Connect to Webflow CMS

To replace mock data with real data:

1. **Edit `src/loader.ts`**
2. **Replace `mockConfig`** with CMS loading:

```typescript
// Example Webflow CMS integration
async function loadConfigFromWebflow() {
  const response = await fetch('/api/calculator-config');
  return await response.json();
}

// In loader.ts
const config = await loadConfigFromWebflow();
calcComponent.setConfig(config);
```

## 🧪 Testing

### Run Tests
```bash
npm test          # Run all tests
npm run test:ui   # Visual test interface
```

### Test Coverage
- ✅ **Pricing engine** - 100% of pure functions
- ✅ **Price breaks calculation** - Different quantities
- ✅ **Lead times** - Timing rules
- ✅ **Formatting** - Currencies and dates
- ✅ **Business days** - Delivery calculation
- ⚠️ **DOM components** - Pending (4/19 tests)

## 🎨 Customization

### CSS Variables
```css
#quote-calc {
  --rc-font: system-ui, sans-serif;
  --rc-bg: #f4f5f6;
  --rc-card: #ffffff;
  --rc-text: #0f172a;
  --rc-accent: #111827;
  --rc-radius: 12px;
  /* ... more variables available */
}
```

### Custom Themes
```css
/* Dark theme */
#quote-calc.dark-theme {
  --rc-bg: #1a1a1a;
  --rc-card: #2a2a2a;
  --rc-text: #ffffff;
}
```

## 🚧 Roadmap

### Upcoming Features
- [ ] **CMS Integration** - Direct connection with Webflow CMS API
- [ ] **Embellishments Calculation** - Dynamic pricing for screen print/embroidery
- [ ] **Holidays** - Holiday support in delivery calculation
- [ ] **Time Cutoff** - Orders after specific time
- [ ] **Analytics** - Conversion event tracking
- [ ] **A/B Testing** - Interface variations
- [ ] **Multi-currency** - Support for more currencies
- [ ] **E2E Tests** - Cypress/Playwright

### Technical Improvements
- [ ] **Bundle Splitting** - Lazy loading of components
- [ ] **Web Workers** - Background calculations
- [ ] **PWA** - Offline calculator cache
- [ ] **Storybook** - Visual component documentation

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

### Code Standards
- **TypeScript** with strict typing
- **Prettier** for formatting
- **ESLint** for code quality
- **Conventional Commits** for messages

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/discussions)
- 📧 **Email**: dev@bioblanks.com

## 🏆 Changelog

### v1.0.0 (2024-08-15)
- ✨ First version of refactored calculator
- ✨ Isolated and testable pricing engine
- ✨ Web Components with custom events
- ✨ Optimized 3.72 kB build
- ✨ Mock data for development
- ✨ Maintained integration with Webflow Forms

---

**Developed with ❤️ by the Bioblanks team**