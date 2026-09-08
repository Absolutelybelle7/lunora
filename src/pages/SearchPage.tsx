import { useEffect, useMemo, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../lib/mockData';

interface SearchPageProps {
  onNavigate: (page: string, query?: string) => void;
  initialQuery: string;
}

export default function SearchPage({ onNavigate, initialQuery }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    return mockProducts.filter((product) =>
      [product.name, product.description].some((value) =>
        value.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [debouncedQuery]);

  return (
    <div className="theme-page min-h-screen bg-ivory">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="heading-serif text-4xl font-semibold text-charcoal mb-2">Search</h1>
          <p className="text-sm text-slate-500">Find the perfect piece from our luxury edit.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="heading-serif text-2xl font-semibold text-charcoal">Search the collection</h2>
            <p className="text-slate-500">Try “silk”, “perfume”, or “evening dress”.</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search styles, designers, materials"
                className="w-full border-0 bg-transparent text-sm text-charcoal outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => onNavigate('search', query.trim())}
                className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-black"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {debouncedQuery ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-slate-500">Showing {results.length} results for “{debouncedQuery}”</p>
              <button
                onClick={() => setQuery('')}
                className="text-sm text-charcoal hover:text-gold"
              >
                Clear search
              </button>
            </div>

            {results.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <p className="text-sm text-slate-600">No results matched your search.</p>
                <button
                  onClick={() => {
                    setQuery('');
                    onNavigate('shop');
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-ivory"
                >
                  Browse All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {['Silk', 'Satin', 'Perfume', 'Body Care', 'New Arrivals'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setDebouncedQuery(tag);
                }}
                className="rounded-full border border-slate-200 bg-white px-6 py-4 text-left text-sm text-charcoal shadow-sm transition hover:border-charcoal"
              >
                <p className="font-semibold">{tag}</p>
                <p className="text-slate-500">Explore premium selections</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
