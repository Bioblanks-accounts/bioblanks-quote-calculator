# 🧮 Bioblanks Quote Calculator

> Interactive pricing calculator with real-time quotes and delivery estimates - built as a TypeScript micro-frontend for seamless Webflow integration.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-GitHub_Pages-blue)](https://bioblanks-accounts.github.io/bioblanks-quote-calculator/)
[![Version](https://img.shields.io/badge/Version-1.0.0-green)](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/releases)
[![Bundle Size](https://img.shields.io/badge/Bundle_Size-~4KB_gzipped-brightgreen)](./dist/quote-calc.v1.js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](./src/types.ts)

## 🎯 **Overview**

A complete refactor from Webflow embed to modular TypeScript micro-frontend, preserving all existing functionality while enabling:

- **🧪 Isolated Testing** - Pure pricing engine with 100% test coverage
- **🔧 Type Safety** - Full TypeScript support with comprehensive interfaces  
- **🎨 Visual Consistency** - Maintains existing HTML/CSS without breaking design
- **📡 Event-Driven** - Custom events for external integrations (Zapier, Make.com)
- **🚀 Performance** - Single 4KB bundle with optimized loading

---

## 📦 **What's Inside**

### **Architecture Overview**
```
src/
├── types.ts          # Complete TypeScript interfaces
├── pricing-core.ts   # Pure calculation engine (testable)
├── mock-data.ts     # Development data (replace with CMS)
├── quote-wc.ts      # Web Component orchestrator
└── loader.ts        # Bundle entry point

dist/
└── quote-calc.v1.js # Production bundle (4KB gzipped)
```

### **Core Features**
- ✅ **Product Selection** - Dynamic dropdown with pricing tiers
- ✅ **Visual Color Picker** - Interactive swatches with hex colors
- ✅ **Quantity Controls** - Stepper buttons + range slider
- ✅ **Embellishments** - Screen printing & embroidery with configs
- ✅ **Smart Calculations** - Real-time pricing with business day delivery
- ✅ **Form Integration** - Hidden fields auto-populated for submission
- ✅ **Responsive Design** - Mobile-first with CSS variables

---

## 🚀 **Quick Start**

### **Option 1: CDN (Recommended for Production)**
```html
<!-- Pinned version for stability -->
<script defer src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@v1.0.0/dist/quote-calc.v1.js" 
        integrity="sha384-[hash-will-be-added]"
        crossorigin="anonymous"></script>

<!-- Your existing Webflow embed HTML -->
<div id="quote-calc" data-form-id="your-form-id">
  <!-- Existing HTML structure preserved -->
</div>
```

### **Option 2: Self-Hosted**
```html
<script defer src="/assets/quote-calc.v1.js"></script>
<div id="quote-calc" data-form-id="contact-form">
  <!-- Your HTML here -->
</div>
```

### **Option 3: Inline (Development Only)**
```html
<script>
  // Paste contents of quote-calc.v1.js here
</script>
```

---

## 🔌 **Webflow CMS Integration**

### **Method 1: Collection List (Recommended)**

Create a **Products** collection with these fields:

```html
<!-- In your Webflow Designer -->
<div data-calc-products-root>
  <div class="product-item w-dyn-item" data-product-id="tech-hoodie">
    <script type="application/json" class="product-config">
      {
        "name": "Tech Hoodie",
        "description": "Technical evolution with anorak hood",
        "image": "https://uploads-ssl.webflow.com/...",
        "priceBreaks": [
          {"minQty": 1, "unit": 19.90},
          {"minQty": 25, "unit": 17.60}
        ]
      }
    </script>
  </div>
</div>
```

### **Method 2: Fallback JSON (Simple)**

```html
<script type="application/json" id="calc-data">
{
  "currency": "USD",
  "products": [...],
  "options": {...},
  "leadTimeRules": [...],
  "limits": {...},
  "cta": {...}
}
</script>
```

### **CMS Field Structure**

| Field Name | Type | Purpose |
|------------|------|---------|
| `product-id` | Plain Text | Unique identifier |
| `product-name` | Plain Text | Display name |
| `product-description` | Plain Text | Product description |
| `product-image` | Image | Product photo |
| `price-breaks` | Plain Text (JSON) | Quantity pricing tiers |
| `calculator-config` | Plain Text (JSON) | Full configuration |


---

## 📡 **Event System & Integration**

### **Event Contracts**

#### **`quote:change`** - Fired on any input change
```javascript
document.addEventListener('quote:change', (event) => {
  console.log('Quote updated:', event.detail);
  /*
  {
    productId: "tech-hoodie",
    productName: "Tech Hoodie", 
    quantity: 50,
    unitCost: 16.40,
    subtotal: 820.00,
    leadTimeDays: 12,
    deliveryDate: "02/15/2024",
    currency: "USD",
    options: {
      color: { id: "black", label: "Black" },
      artwork: { id: "front-1c", label: "Front 1-color", addPerUnit: 0.6 },
      neckLabel: { id: "woven", label: "Woven label", addPerUnit: 0.3 },
      embellishments: {
        order: ["screenprint"],
        items: {
          screenprint: {
            sp_colors: "2 colors",
            sp_size: "10x12", 
            sp_extras: "Water-based"
          }
        }
      }
    }
  }
  */
});
```

#### **`quote:submit`** - Fired on "Send to email" 
```javascript
document.addEventListener('quote:submit', (event) => {
  const quote = event.detail;
  
  // Option A: Webflow Form Integration
  populateWebflowForm(quote);
  
  // Option B: Direct API Call
  fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  });
  
  // Option C: Zapier/Make Webhook
  fetch('https://hooks.zapier.com/your-webhook', {
    method: 'POST',
    body: JSON.stringify(quote)
  });
});

function populateWebflowForm(quote) {
  const form = document.querySelector('[data-name="Quote Form"]');
  form.querySelector('[name="product"]').value = quote.productName;
  form.querySelector('[name="quantity"]').value = quote.quantity;
  form.querySelector('[name="total"]').value = quote.subtotal;
  form.querySelector('[name="quote-data"]').value = JSON.stringify(quote);
}
```

---

## ♿ **Accessibility (A11Y)**

### **Compliance Standards**
- **WCAG 2.1 AA** compliant
- **Keyboard navigation** - Tab, Enter, Space, Arrow keys
- **Screen reader** optimized with proper ARIA labels
- **Focus management** - Visible focus indicators
- **Live regions** - Price updates announced (`aria-live="polite"`)

### **Key Features**
```html
<!-- Semantic structure -->
<section aria-labelledby="product-section">
  <h2 id="product-section">Choose Product</h2>
  
<!-- Live price updates -->
<div aria-live="polite" aria-relevant="all">
  <span id="unit-cost-value">$16.40</span>
</div>

<!-- Color selection -->
<div role="listbox" aria-label="Garment Color">
  <button role="option" aria-selected="true">White</button>
</div>
```

### **Testing Checklist**
- [ ] Tab navigation reaches all interactive elements
- [ ] Screen reader announces price changes
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible on all controls
- [ ] Error states clearly communicated

---

## 🔒 **Security & Performance**

### **Bundle Security**
```html
<!-- Pinned version with integrity check -->
<script defer 
        src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@v1.0.0/dist/quote-calc.v1.js"
        integrity="sha384-[hash]"
        crossorigin="anonymous">
</script>
```

### **Content Security Policy**
```http
Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net;
```

### **Performance Optimization**
- **Lazy loading** - Calculator initializes after page load
- **Batch DOM updates** - Prevents layout thrashing  
- **Debounced calculations** - Smooth UX during rapid input
- **Tree shaking** - Only required code included in bundle


---

## 🧪 **Testing**

### **Test Coverage Matrix**
| Test Case | Quantity | Expected Unit Cost | Lead Time |
|-----------|----------|-------------------|-----------|
| Single item | 1 | Base price | 5 days |
| Small batch | 25 | Tier 2 discount | 12 days |
| Medium batch | 50 | Tier 3 discount | 18 days |
| Large batch | 100+ | Maximum discount | 24 days |

### **Running Tests**
```bash
# Install dependencies
npm install

# Run test suite  
npm test

# Test with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### **Test Categories**
- **✅ Pure Functions** - 100% coverage of pricing engine
- **✅ Business Logic** - All price tiers and lead time rules
- **✅ Date Calculations** - Business days, weekends, delivery estimates
- **✅ Edge Cases** - Min/max quantities, zero prices, invalid inputs

---

## 🎨 **Customization**

### **CSS Variables**
```css
#quote-calc {
  --rc-accent: #FF9533;      /* Primary brand color */
  --rc-bg: #f4f5f6;          /* Background */
  --rc-card: #ffffff;        /* Card background */
  --rc-text: #0f172a;        /* Text color */
  --rc-muted: #6b7280;       /* Secondary text */
  --rc-border: #e5e7eb;      /* Border color */
  --rc-radius: 12px;         /* Border radius */
  --rc-btn-h: 44px;          /* Button height */
}
```

### **Theme Examples**
```css
/* Dark Theme */
#quote-calc.dark {
  --rc-bg: #1f2937;
  --rc-card: #374151;
  --rc-text: #f9fafb;
  --rc-border: #4b5563;
}

/* Minimal Theme */
#quote-calc.minimal {
  --rc-radius: 4px;
  --rc-border: #e5e7eb;
  --rc-accent: #000000;
}
```

---

## 📈 **Observability & Debugging**

### **Debug Mode**
```javascript
// Enable detailed logging
window.__calcDebug = true;

// Listen to all calculator events
document.addEventListener('quote:change', (e) => {
  console.log('🔄 Quote changed:', e.detail);
});

document.addEventListener('quote:submit', (e) => {
  console.log('📧 Quote submitted:', e.detail);
});
```

### **Error Tracking**
```javascript
// Sentry integration example
window.addEventListener('error', (event) => {
  if (event.filename?.includes('quote-calc')) {
    Sentry.captureException(event.error);
  }
});
```

### **Performance Monitoring**
```javascript
// Track calculator load time
performance.mark('calc-start');
document.addEventListener('DOMContentLoaded', () => {
  performance.mark('calc-end');
  performance.measure('calc-load', 'calc-start', 'calc-end');
});
```


---

## 🔄 **Migration Guide**

### **From Webflow Embed to Bundle**

#### **Step 1: Prepare Your Webflow Site**
- [ ] Keep existing HTML structure and IDs
- [ ] Ensure `#quote-calc` container exists
- [ ] Add form integration listeners

#### **Step 2: Add the Bundle**
```html
<!-- In Webflow Project Settings > Custom Code > Footer -->
<script defer src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@v1.0.0/dist/quote-calc.v1.js"></script>
```

#### **Step 3: Test Core Functions**
- [ ] Product selection updates pricing
- [ ] Quantity changes affect lead time
- [ ] Color selection works with pricing
- [ ] Embellishments calculate correctly
- [ ] "Send to email" triggers form submission

#### **Step 4: CMS Integration**
- [ ] Create Products collection
- [ ] Map existing data to new structure
- [ ] Test with real CMS data
- [ ] Verify quote:submit events fire correctly

#### **Step 5: Analytics & Monitoring**
- [ ] Set up error tracking
- [ ] Enable debug mode for testing
- [ ] Monitor performance metrics
- [ ] Test form submissions end-to-end

---

## 🚧 **Roadmap**

### **Version 1.1.0** (Next Release)
- [ ] **Holiday Calendar** - Skip holidays in delivery calculations
- [ ] **Cutoff Times** - Order before 2PM ships same day
- [ ] **Multi-Currency** - EUR, GBP, CAD support
- [ ] **A/B Testing** - Built-in experiment framework

### **Version 1.2.0** (Future)
- [ ] **Bulk Pricing** - Tiered discounts for multiple products
- [ ] **Rush Orders** - Express delivery options
- [ ] **International Shipping** - Global delivery estimates
- [ ] **Save Quotes** - Permalink generation

### **Extension Points**
```javascript
// Holiday provider interface
window.QuoteCalc.setHolidayProvider((date) => {
  return isCompanyHoliday(date);
});

// Cutoff time provider  
window.QuoteCalc.setCutoffProvider((now) => {
  return now.getHours() < 14; // 2PM cutoff
});
```

---

## �� **Contributing**

### **Development Setup**
```bash
git clone https://github.com/Bioblanks-accounts/bioblanks-quote-calculator.git
cd bioblanks-quote-calculator
npm install
npm run dev
```

### **Contribution Guidelines**
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Test** your changes (`npm test`)
4. **Commit** with conventional commits (`feat: add holiday support`)
5. **Push** to branch (`git push origin feature/amazing-feature`)
6. **Open** Pull Request

### **Code Standards**
- **TypeScript** - Strict mode enabled
- **ESLint** - Consistent code style  
- **Vitest** - Test coverage ≥ 90%
- **Semantic Versioning** - Breaking changes documented


---

## 📋 **Complete Integration Example**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Bioblanks Quote Calculator</title>
</head>
<body>
  <!-- Existing Webflow HTML structure -->
  <div id="quote-calc" data-form-id="quote-form">
    <!-- Your current embed HTML here -->
  </div>
  
  <!-- Hidden Webflow form -->
  <form id="quote-form" data-name="Quote Form" style="display: none;">
    <input name="product" type="hidden">
    <input name="quantity" type="hidden">
    <input name="total" type="hidden">
    <input name="quote-data" type="hidden">
  </form>

  <!-- Calculator bundle -->
  <script defer src="https://cdn.jsdelivr.net/gh/Bioblanks-accounts/bioblanks-quote-calculator@v1.0.0/dist/quote-calc.v1.js"></script>
  
  <!-- Integration script -->
  <script>
    document.addEventListener('quote:submit', (event) => {
      const quote = event.detail;
      
      // Populate Webflow form
      const form = document.getElementById('quote-form');
      form.querySelector('[name="product"]').value = quote.productName;
      form.querySelector('[name="quantity"]').value = quote.quantity;
      form.querySelector('[name="total"]').value = quote.subtotal;
      form.querySelector('[name="quote-data"]').value = JSON.stringify(quote);
      
      // Submit to Webflow
      form.submit();
      
      // Optional: Send to external service
      fetch('https://hooks.zapier.com/your-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
    });
  </script>
</body>
</html>
```

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 **Support**

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/Bioblanks-accounts/bioblanks-quote-calculator/discussions)
- **📧 Direct Support**: support@bioblanks.com
- **🚀 Live Demo**: [GitHub Pages](https://bioblanks-accounts.github.io/bioblanks-quote-calculator/)

---

*Built with ❤️ for seamless Webflow integration*
