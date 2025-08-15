import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/loader.ts',
      name: 'BioblanksQuoteCalc',
      fileName: 'quote-calc.v1',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true
      }
    },
    target: 'es2020',
    minify: true
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
