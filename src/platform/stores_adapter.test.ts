import { describe, it, expect } from 'vitest';
import {
  convertStoresProduct,
  validateStoresProduct,
  type StoresProduct,
} from './stores_adapter.js';

describe('stores_adapter', () => {
  const sampleProduct: StoresProduct = {
    id: 'item_abc123',
    name: 'Test Product',
    description: 'This is a test product description.',
    price: 2980,
    compare_at_price: 3980,
    category: 'Electronics',
    published: true,
    stock_quantity: 50,
    sku: 'TEST-SKU-001',
    images: [
      { url: 'https://example.com/img1.jpg', alt: 'Image 1' },
      { url: 'https://example.com/img2.jpg', alt: 'Image 2' },
    ],
    variants: [
      { id: 'var_color', name: 'Color', options: ['Red', 'Blue', 'Green'] },
      { id: 'var_size', name: 'Size', options: ['S', 'M', 'L'] },
    ],
  };

  describe('convertStoresProduct', () => {
    it('should convert basic product fields', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.id).toBe('item_abc123');
      expect(result.title).toBe('Test Product');
    });

    it('should preserve description as-is', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.description).toBe('This is a test product description.');
    });

    it('should extract image URLs', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.images).toEqual([
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
      ]);
    });

    it('should convert price to string with JPY currency', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.price).toEqual({ amount: '2980', currency: 'JPY' });
    });

    it('should convert price with custom currency', () => {
      const result = convertStoresProduct(sampleProduct, { currency: 'USD' });
      expect(result.price).toEqual({ amount: '2980', currency: 'USD' });
    });

    it('should flatten variants with options', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.variants).toHaveLength(6); // 3 colors + 3 sizes
      expect(result.variants?.[0]).toEqual({
        id: 'var_color_0',
        title: 'Color: Red',
        price: '2980',
      });
      expect(result.variants?.[3]).toEqual({
        id: 'var_size_0',
        title: 'Size: S',
        price: '2980',
      });
    });

    it('should include metadata', () => {
      const result = convertStoresProduct(sampleProduct);
      expect(result.metadata).toEqual({
        source: 'stores',
        category: 'Electronics',
        sku: 'TEST-SKU-001',
        published: true,
        stockQuantity: 50,
        compareAtPrice: 3980,
      });
    });

    it('should handle product without variants', () => {
      const productWithoutVariants: StoresProduct = {
        id: 'simple_item',
        name: 'Simple Product',
        price: 1000,
      };
      const result = convertStoresProduct(productWithoutVariants);
      expect(result.variants).toBeUndefined();
    });

    it('should handle product without images', () => {
      const productWithoutImages: StoresProduct = {
        id: 'no_image_item',
        name: 'No Image Product',
        price: 500,
      };
      const result = convertStoresProduct(productWithoutImages);
      expect(result.images).toEqual([]);
    });
  });

  describe('validateStoresProduct', () => {
    it('should return true for valid product', () => {
      expect(validateStoresProduct(sampleProduct)).toBe(true);
    });

    it('should return false for null', () => {
      expect(validateStoresProduct(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(validateStoresProduct('string')).toBe(false);
    });

    it('should return false for missing id', () => {
      const invalid = { name: 'Test', price: 1000 };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for empty id', () => {
      const invalid = { id: '   ', name: 'Test', price: 1000 };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for missing name', () => {
      const invalid = { id: 'test', price: 1000 };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for empty name', () => {
      const invalid = { id: 'test', name: '   ', price: 1000 };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for missing price', () => {
      const invalid = { id: 'test', name: 'Test' };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for negative price', () => {
      const invalid = { id: 'test', name: 'Test', price: -100 };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for invalid image structure', () => {
      const invalid = {
        id: 'test',
        name: 'Test',
        price: 1000,
        images: [{ notUrl: 'bad' }],
      };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return false for invalid variant structure', () => {
      const invalid = {
        id: 'test',
        name: 'Test',
        price: 1000,
        variants: [{ name: 'Color' }], // missing id and options
      };
      expect(validateStoresProduct(invalid)).toBe(false);
    });

    it('should return true for minimal valid product', () => {
      const minimal = { id: 'test', name: 'Test', price: 0 };
      expect(validateStoresProduct(minimal)).toBe(true);
    });
  });
});
