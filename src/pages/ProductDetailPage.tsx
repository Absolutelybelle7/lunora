import { useEffect, useState } from 'react';
import { Star, Heart, Share2, Minus, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContent';
import ProductCard from '../components/ProductCard';
import { mockProducts, mockReviews, mockCategories } from '../lib/mockData';
import { formatPrice } from '../lib/currency';
import type { Product, Review } from '../types';

interface ProductDetailPageProps {
  productSlug: string;
  onNavigate: (page: string) => void;
}

type ProductWithCategory = Product & { categories?: { name: string } };

export default function ProductDetailPage({ productSlug, onNavigate }: ProductDetailPageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productSlug]);

  const loadProduct = async () => {
    setLoading(true);
    const productData = mockProducts.find(p => p.slug === productSlug);

    if (productData) {
      const category = mockCategories.find(c => c.id === productData.category_id);
      setProduct({ ...productData, categories: category ? { name: category.name } : undefined });

      const related = mockProducts
        .filter(p => p.category_id === productData.category_id && p.id !== productData.id)
        .slice(0, 4);
      setRelatedProducts(related);

      const reviewData = mockReviews.filter(r => r.product_id === productData.id);
      setReviews(reviewData);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user || !product) {
      if (!user) onNavigate('auth');
      return;
    }

    await addToCart(
      product.id,
      quantity,
      product.sale_price || product.base_price,
      selectedVariant || undefined
    );
  };

  if (loading) {
    return (
      <div className="theme-page min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="theme-page min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-emerald-800">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop')} className="hover:text-emerald-800">Shop</button>
            <span>/</span>
            <span className="text-emerald-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-emerald-800' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600">{product.categories?.name}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.review_count} Reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatPrice(product.sale_price || product.base_price)}
                </span>
                {product.sale_price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                )}
                {product.sale_price && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                    {Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold text-gray-900">SKU:</span>{' '}
                  <span className="text-gray-600">{product.sku}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Availability:</span>{' '}
                  {product.stock_quantity > 0 ? (
                    <span className="text-emerald-600">In Stock ({product.stock_quantity} items)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-emerald-800 text-white py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-colors disabled:bg-gray-400"
                >
                  Add To Cart
                </button>

                <button className="p-3 border rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <button className="w-full border-2 border-amber-700 text-amber-700 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors mb-6">
                Buy Now
              </button>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Share:</h3>
                <div className="flex items-center gap-3">
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b mb-6">
            <div className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-semibold capitalize ${
                    activeTab === tab
                      ? 'text-emerald-800 border-b-2 border-emerald-800'
                      : 'text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
              {product.specifications?.benefits && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Benefits:</h3>
                  <ul className="space-y-2">
                    {product.specifications.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-emerald-800 mt-1">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="font-semibold text-gray-900 w-48 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="text-gray-700">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                <p className="text-gray-600">{reviews.length} reviews</p>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {review.user_profiles?.full_name || 'Anonymous'}
                            </span>
                            {review.verified_purchase && (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
