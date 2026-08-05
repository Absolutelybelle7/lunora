import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContent';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  onNavigate: (page: string, query?: string) => void;
  currentPage: string;
}

const navLinks = [
  { label: 'Home', page: 'home' },
  { label: 'Shop', page: 'shop' },
  { label: 'New Arrivals', page: 'category-new-arrivals' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'about' },
];

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNavigate('search', searchQuery.trim());
  };

  const isHome = currentPage === 'home';

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'glass shadow-sm py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex-shrink-0 text-left"
          >
            <span className="block text-[10px] sm:text-xs uppercase tracking-[0.45em] text-neutral-500 group-hover:text-neutral-800 transition-colors">
              LUNORA
            </span>
            <span className="block text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-neutral-900">
              Fashion
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <button
                key={link.page + link.label}
                onClick={() => onNavigate(link.page)}
                className={`relative text-sm tracking-wide transition-colors duration-300 ${
                  currentPage === link.page
                    ? 'text-black font-medium'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Search - desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden xl:flex items-center gap-2 glass rounded-full px-4 py-2 min-w-[220px]"
          >
            <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search styles..."
              className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onNavigate('search')}
              className="xl:hidden flex h-10 w-10 items-center justify-center rounded-full glass text-neutral-600 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass text-neutral-600 hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white px-1">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass text-neutral-600 hover:text-black transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white px-1">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => user ? onNavigate('account') : onNavigate('auth')}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full glass text-neutral-600 hover:text-black transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full glass text-neutral-600 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="mx-4 mt-3 glass rounded-2xl p-5 shadow-lg">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page + link.label}
                    onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                    className={`text-left py-2.5 text-sm transition-colors ${
                      currentPage === link.page ? 'text-black font-medium' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-neutral-200/60">
                <button
                  onClick={() => { onNavigate(user ? 'account' : 'auth'); setMobileMenuOpen(false); }}
                  className="w-full btn-primary justify-center text-sm py-3"
                >
                  {user ? 'My Account' : 'Sign In'}
                </button>
                {user && (
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); onNavigate('home'); }}
                    className="mt-2 w-full rounded-full border border-neutral-200 py-3 text-sm text-neutral-600 hover:text-black transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
