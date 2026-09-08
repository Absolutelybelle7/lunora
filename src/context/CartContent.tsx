import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { mockProducts } from '../lib/mockData';
import type { CartItem } from '../types';

type PersistedCartItem = Omit<CartItem, 'product'>;

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number, price: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cartData = localStorage.getItem(`cart_${user.id}`);
      if (cartData) {
        const parsedCart = JSON.parse(cartData) as PersistedCartItem[];
        // Fetch product details from mock data
        const enrichedItems = parsedCart.map((item) => {
          const product = mockProducts.find(p => p.id === item.product_id);
          if (product) {
            return {
              ...item,
              product: {
                name: product.name,
                images: product.images,
                slug: product.slug,
              },
            };
          }
          return null;
        }).filter((item): item is CartItem => item !== null);
        setItems(enrichedItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (cartItems: CartItem[]) => {
    if (user) {
      const itemsToSave = cartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      }));
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(itemsToSave));
    }
  };

  const addToCart = async (productId: string, quantity: number, price: number, variantId?: string) => {
    if (!user) return;

    try {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) return;

      const existingItem = items.find(
        item => item.product_id === productId && item.variant_id === (variantId || null)
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const newItem: CartItem = {
          id: `cart_item_${Date.now()}`,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
          price,
          product: {
            name: product.name,
            images: product.images,
            slug: product.slug,
          },
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveCart(updatedItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeItem(itemId);
        return;
      }

      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      saveCart(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;

    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveCart(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setItems([]);
      localStorage.removeItem(`cart_${user.id}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
