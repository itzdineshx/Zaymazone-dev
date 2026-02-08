#!/usr/bin/env node

try {
  console.log('Testing products router import...');
  const productsRouter = await import('./src/routes/products.js');
  console.log('Products router imported successfully:', typeof productsRouter.default);
} catch (error) {
  console.error('Error importing products router:', error);
  console.error('Stack:', error.stack);
}