import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContent';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import About from './pages/About';

type AppPage =
  | 'home'
  | 'shop'
  | 'about'
  | 'cart'
  | 'checkout'
  | 'auth'
  | 'account'
  | 'wishlist'
  | 'admin'
  | 'search'
  | 'product';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [productSlug, setProductSlug] = useState('');

  const navigateTo = (page: string, query?: string) => {
    if (page.startsWith('product-')) {
      setCurrentPage('product');
      setProductSlug(page.replace('product-', ''));
      setCategorySlug('');
      setSearchQuery('');
      return;
    }

    if (page.startsWith('category-')) {
      setCurrentPage('shop');
      setCategorySlug(page.replace('category-', ''));
      setProductSlug('');
      setSearchQuery('');
      return;
    }

    if (page === 'search') {
      setCurrentPage('search');
      setSearchQuery(query ?? '');
      setProductSlug('');
      setCategorySlug('');
      return;
    }

    setCurrentPage(page as AppPage);
    setProductSlug('');
    setCategorySlug('');
    setSearchQuery('');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, categorySlug, productSlug, searchQuery]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'shop':
        return <ShopPage onNavigate={navigateTo} categorySlug={categorySlug} />;
      case 'about':
        return <About />;
      case 'cart':
        return <CartPage onNavigate={navigateTo} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigateTo} />;
      case 'auth':
        return <AuthPage onNavigate={navigateTo} />;
      case 'account':
        return <AccountPage onNavigate={navigateTo} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigateTo} />;
      case 'admin':
        return <AdminPage onNavigate={navigateTo} />;
      case 'search':
        return <SearchPage onNavigate={navigateTo} initialQuery={searchQuery} />;
      case 'product':
        return <ProductDetailPage productSlug={productSlug} onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-cream text-charcoal">
            <Header onNavigate={navigateTo} currentPage={currentPage} />
            <main className={currentPage === 'home' ? '' : 'pt-20'}>{renderPage()}</main>
            <Footer onNavigate={navigateTo} />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
