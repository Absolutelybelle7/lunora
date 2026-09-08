import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1, variantId) => {
        const items = [...get().items];
        const existing = items.find(
          (item) => item.product_id === product.id && item.variant_id === (variantId || null)
        );

        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            product_id: product.id,
            variant_id: variantId || null,
            quantity,
            price: product.sale_price ?? product.base_price,
            product: {
              name: product.name,
              images: product.images,
              slug: product.slug,
            },
          });
        }

        set({ items });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.id !== itemId) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'lunora-cart' }
  )
);

export const useCart = useCartStore;
