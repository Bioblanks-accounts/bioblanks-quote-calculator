const o = {
  currency: "USD",
  products: [
    {
      id: "tech-hoodie",
      name: "Tech Hoodie",
      description: "A technical evolution of the traditional hoodie featuring a distinctive anorak hood and hidden side pockets.",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
      priceBreaks: [
        { minQty: 1, unit: 29.9 },
        { minQty: 25, unit: 26.5 },
        { minQty: 50, unit: 24.9 },
        { minQty: 100, unit: 22.9 }
      ],
      baseDevCost: 0
    },
    {
      id: "baseball-cap",
      name: "Baseball Cap",
      description: "Classic 6-panel structured cap with adjustable strap. Perfect for embroidery and everyday wear.",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&crop=center",
      priceBreaks: [
        { minQty: 1, unit: 12.9 },
        { minQty: 25, unit: 11.5 },
        { minQty: 50, unit: 10.9 },
        { minQty: 100, unit: 9.9 }
      ],
      baseDevCost: 0
    },
    {
      id: "premium-tshirt",
      name: "Premium T-Shirt",
      description: "High-quality cotton blend tee with reinforced seams. Ideal for screen printing and promotional events.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
      priceBreaks: [
        { minQty: 1, unit: 16.9 },
        { minQty: 25, unit: 14.5 },
        { minQty: 50, unit: 13.2 },
        { minQty: 100, unit: 11.9 }
      ],
      baseDevCost: 0
    }
  ],
  options: {
    colors: [
      { id: "black", label: "Black", add: 0 },
      { id: "white", label: "White", add: 0 },
      { id: "navy", label: "Navy Blue", add: 0.5 },
      { id: "red", label: "Red", add: 0.5 },
      { id: "forest", label: "Forest Green", add: 0.75 }
    ],
    artwork: [
      { id: "none", label: "No artwork", addPerUnit: 0, devCost: 0 },
      { id: "front-1c", label: "Front 1-color print", addPerUnit: 0.85, devCost: 35 },
      { id: "front-2c", label: "Front 2-color print", addPerUnit: 1.25, devCost: 55 },
      { id: "front-back-1c", label: "Front + Back 1-color", addPerUnit: 1.5, devCost: 65 },
      { id: "full-color", label: "Full-color print", addPerUnit: 2.9, devCost: 85 }
    ],
    neckLabel: [
      { id: "none", label: "No label", addPerUnit: 0, devCost: 0 },
      { id: "woven", label: "Woven label", addPerUnit: 0.45, devCost: 25 },
      { id: "printed", label: "Printed label", addPerUnit: 0.25, devCost: 15 },
      { id: "heat-transfer", label: "Heat transfer label", addPerUnit: 0.35, devCost: 20 }
    ]
  },
  leadTimeRules: [
    { minQty: 1, days: 5 },
    { minQty: 25, days: 8 },
    { minQty: 50, days: 12 },
    { minQty: 100, days: 15 },
    { minQty: 250, days: 18 }
  ],
  limits: {
    minQty: 1,
    maxQty: 1e3,
    qtyStep: 1
  },
  cta: {
    startDesignUrl: "/studio",
    emailSubject: "Quote request – {{productName}}",
    emailTo: "quotes@bioblanks.com"
  }
};
function n() {
  const t = document.getElementById("quote-calc");
  if (!t) {
    console.error("Container #quote-calc não encontrado. Verifique se o Embed está na página.");
    return;
  }
  let e = t.querySelector("bioblanks-quote-calc");
  e || (e = document.createElement("bioblanks-quote-calc"), e.style.display = "none", t.appendChild(e)), e.setConfig(o), e.addEventListener("quote:change", (i) => {
    console.log("Quote changed:", i.detail);
  }), e.addEventListener("quote:submit", (i) => {
    console.log("Quote submitted:", i.detail);
  }), console.log("✅ Bioblanks Quote Calculator initialized");
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
window.initBioblanksCalculator = n;
