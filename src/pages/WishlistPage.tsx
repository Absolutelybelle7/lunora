import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { mockProducts } from '../lib/mockData';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    const matchingProducts = wishlist
      .map((id) => mockProducts.find((product) => product.id === id) as Product | undefined)
      .filter((product): product is Product => product !== undefined);
    setItems(matchingProducts);
  }, [user, wishlist]);

  if (!user) {
    return (
      <div className="theme-page min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="rounded-3xl bg-white p-12 text-center shadow-premium">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Save pieces you love</h2>
          <p className="text-slate-500 mb-6">Sign in to add items to your wishlist and revisit them anytime.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="rounded-full bg-charcoal px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-black"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen bg-ivory">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="heading-serif text-4xl font-semibold text-charcoal mb-2">Wishlist</h1>
          <p className="text-sm text-slate-500">Curated luxury pieces you’ve saved for later.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-6">Browse our collection and add favorites to save for later.</p>
            <button
              onClick={() => onNavigate('shop')}
              className="rounded-full border border-charcoal px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-charcoal transition hover:bg-ivory"
            >
              Shop the edit
            </button>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
