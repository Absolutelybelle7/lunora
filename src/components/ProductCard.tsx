import { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContent';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../lib/currency';

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discountPercent = product.sale_price
    ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('auth');
      return;
    }

    setIsAddingToCart(true);
    await addToCart(product.id, 1, product.sale_price || product.base_price);
    setIsAddingToCart(false);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('auth');
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onNavigate(`product-${product.slug}`)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-black px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {discountPercent}% off
          </div>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full glass transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
        </button>

        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity === 0}
            className="w-full rounded-full bg-black py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-300 flex items-center justify-center gap-1.5"
          >
            {product.stock_quantity === 0 ? (
              'Out of Stock'
            ) : isAddingToCart ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <h3 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-1">{product.name}</h3>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm font-semibold text-neutral-900">
          {formatPrice(product.sale_price ?? product.base_price)}
        </span>
        {product.sale_price && (
          <span className="text-xs text-neutral-400 line-through">
            {formatPrice(product.base_price)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-neutral-400">({product.review_count})</span>
      </div>
    </div>
  );
}
