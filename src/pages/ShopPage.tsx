import { useEffect, useState } from 'react';
import { SlidersHorizontal, X, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts, mockCategories } from '../lib/mockData';
import { formatPrice } from '../lib/currency';
import type { Category, Product } from '../types';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  categorySlug?: string;
}

export default function ShopPage({ onNavigate, categorySlug }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState({
    category: categorySlug || '',
    minPrice: 0,
    maxPrice: 100,
    inStock: false,
    rating: 0,
    sort: 'default'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      setFilters((currentFilters) => ({ ...currentFilters, category: categorySlug }));
    }
  }, [categorySlug]);

  useEffect(() => {
    loadProducts();
    updateActiveFilters();
  }, [filters]);

  const loadCategories = async () => {
    const cats = mockCategories.filter(c => !c.parent_id);
    setCategories(cats);
  };

  const loadProducts = async () => {
    setLoading(true);
    
    let filtered = [...mockProducts];

    if (filters.category) {
      const normalized = filters.category.toLowerCase();
      const category = mockCategories.find(c => c.slug === normalized);
      if (category) {
        filtered = filtered.filter(p => p.category_id === category.id);
      } else if (normalized === 'sale') {
        filtered = filtered.filter(p => p.sale_price !== null);
      } else if (normalized === 'new-arrivals') {
        filtered = filtered.filter(p => new Date(p.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      } else if (normalized === 'luxury-collection') {
        filtered = filtered.filter(p => p.base_price >= 60 || p.category_id === '5');
      } else if (normalized === 'women' || normalized === 'accessories') {
        filtered = filtered.filter(p => p.category_id !== undefined);
      }
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.minPrice > 0 || filters.maxPrice < 100) {
      filtered = filtered.filter(p => 
        p.base_price >= filters.minPrice && p.base_price <= filters.maxPrice
      );
    }

    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        filtered.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    setProducts(filtered);
    setLoading(false);
  };

  const updateActiveFilters = () => {
    const active: string[] = [];
    if (filters.category) active.push(`Category: ${filters.category}`);
    if (filters.inStock) active.push('In Stock');
    if (filters.rating > 0) active.push(`${filters.rating}+ Stars`);
    if (filters.minPrice > 0 || filters.maxPrice < 100) {
      active.push(`${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`);
    }
    setActiveFilters(active);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 100,
      inStock: false,
      rating: 0,
      sort: 'default'
    });
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setFilters({ ...filters, category: '' });
    } else if (filter === 'In Stock') {
      setFilters({ ...filters, inStock: false });
    } else if (filter.includes('Stars')) {
      setFilters({ ...filters, rating: 0 });
    } else if (filter.includes('GH₵') || filter.includes('-')) {
      setFilters({ ...filters, minPrice: 0, maxPrice: 100 });
    }
  };

  return (
    <div className="theme-page min-h-screen bg-cream">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="heading-serif text-4xl font-semibold text-neutral-900 mb-2">Shop</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-black">Home</button>
            <span>/</span>
            <span>Shop</span>
            {categorySlug && (
              <>
                <span>/</span>
                <span className="text-black capitalize">{categorySlug.replace('-', ' ')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filter Options</h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">By Categories</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat.slug}
                          onChange={() => setFilters({ ...filters, category: cat.slug })}
                          className="text-black focus:ring-emerald-800"
                        />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </label>
                    ))}
                    {filters.category && (
                      <button
                        onClick={() => setFilters({ ...filters, category: '' })}
                        className="text-sm text-black hover:underline"
                      >
                        Clear selection
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Min: {formatPrice(filters.minPrice)}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                        className="w-full accent-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Max: {formatPrice(filters.maxPrice)}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className="w-full accent-emerald-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Review</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters({ ...filters, rating })}
                          className="text-black focus:ring-emerald-800"
                        />
                        <span className="text-sm text-gray-700">{rating} Star{rating > 1 ? 's' : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="text-black focus:ring-emerald-800 rounded"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-cream"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <span className="text-sm text-gray-600">
                  Showing 1-{products.length} of {products.length} results
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-black text-sm rounded-full"
                  >
                    {filter}
                    <button onClick={() => removeFilter(filter)} className="hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
