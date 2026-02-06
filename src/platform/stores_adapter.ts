/**
 * STORES platform adapter
 * Converts STORES product data to Gawain format
 *
 * STORES (https://stores.jp/) is a popular Japanese e-commerce platform
 */

import type { ProductInput } from '../gawain/types.js';

/**
 * STORES product image structure
 */
export interface StoresProductImage {
  url: string;
  alt?: string;
}

/**
 * STORES product variant structure
 */
export interface StoresProductVariant {
  id: string;
  name: string;
  options: string[];
}

/**
 * STORES product structure
 * Based on typical STORES product data format
 */
export interface StoresProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images?: StoresProductImage[];
  variants?: StoresProductVariant[];
  category?: string;
  published?: boolean;
  stock_quantity?: number;
  sku?: string;
}

/**
 * STORES price context
 */
export interface StoresPriceContext {
  currency: string;
}

/**
 * Default price context for STORES (Japanese platform)
 */
const DEFAULT_PRICE_CONTEXT: StoresPriceContext = {
  currency: 'JPY',
};

/**
 * Convert STORES product to Gawain ProductInput
 */
export function convertStoresProduct(
  product: StoresProduct,
  priceContext: StoresPriceContext = DEFAULT_PRICE_CONTEXT
): ProductInput {
  // Extract image URLs
  const images = (product.images || []).map((img) => img.url);

  // Convert price (STORES uses integer yen, no decimal)
  const price = {
    amount: String(product.price),
    currency: priceContext.currency,
  };

  // Convert variants to Gawain format
  // STORES variants have options array, we create individual variant entries
  const variants = product.variants?.flatMap((variant) =>
    variant.options.map((option, index) => ({
      id: `${variant.id}_${index}`,
      title: `${variant.name}: ${option}`,
      price: String(product.price),
    }))
  );

  return {
    id: product.id,
    title: product.name,
    description: product.description,
    images,
    price,
    variants,
    metadata: {
      source: 'stores',
      category: product.category,
      sku: product.sku,
      published: product.published,
      stockQuantity: product.stock_quantity,
      compareAtPrice: product.compare_at_price,
    },
  };
}

/**
 * Validate STORES product has required fields
 */
export function validateStoresProduct(product: unknown): product is StoresProduct {
  if (!product || typeof product !== 'object') {
    return false;
  }

  const p = product as Record<string, unknown>;

  // Required fields
  if (typeof p.id !== 'string' || !p.id.trim()) {
    return false;
  }
  if (typeof p.name !== 'string' || !p.name.trim()) {
    return false;
  }
  if (typeof p.price !== 'number' || p.price < 0) {
    return false;
  }

  // Images should have at least one (warning only)
  if (Array.isArray(p.images) && p.images.length === 0) {
    console.warn('Product has no images');
  }

  // Validate images structure if present
  if (Array.isArray(p.images)) {
    for (const img of p.images) {
      if (!img || typeof img !== 'object' || typeof (img as { url?: unknown }).url !== 'string') {
        return false;
      }
    }
  }

  // Validate variants structure if present
  if (Array.isArray(p.variants)) {
    for (const variant of p.variants) {
      if (!variant || typeof variant !== 'object') {
        return false;
      }
      const v = variant as Record<string, unknown>;
      if (typeof v.id !== 'string' || typeof v.name !== 'string') {
        return false;
      }
      if (!Array.isArray(v.options)) {
        return false;
      }
    }
  }

  return true;
}
