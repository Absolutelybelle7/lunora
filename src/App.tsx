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
import Preloader from './components/Preloader';

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

interface RouteState {
  page: AppPage;
  searchQuery: string;
  categorySlug: string;
  productSlug: string;
}

function getRouteFromLocation(): RouteState {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const segments = path.split('/').filter(Boolean);
  const query = new URLSearchParams(window.location.search);

  if (segments[0] === 'product' && segments[1]) {
    return { page: 'product', productSlug: segments[1], categorySlug: '', searchQuery: '' };
  }

  if (segments[0] === 'category' && segments[1]) {
    return { page: 'shop', categorySlug: segments[1], productSlug: '', searchQuery: '' };
  }

  if (segments[0] === 'search') {
    return { page: 'search', searchQuery: query.get('q') ?? '', categorySlug: '', productSlug: '' };
  }

  const page = segments[0] as AppPage | undefined;
  const validPages: AppPage[] = ['home', 'shop', 'about', 'cart', 'checkout', 'auth', 'account', 'wishlist', 'admin'];

  return {
    page: page && validPages.includes(page) ? page : 'home',
    searchQuery: '',
    categorySlug: '',
    productSlug: '',
  };
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState<RouteState>(getRouteFromLocation);
  const { page: currentPage, searchQuery, categorySlug, productSlug } = route;

  const navigateTo = (page: string, query?: string) => {
    let nextRoute: RouteState;

    if (page.startsWith('product-')) {
      const slug = page.replace('product-', '');
      nextRoute = { page: 'product', productSlug: slug, categorySlug: '', searchQuery: '' };
    } else if (page.startsWith('category-')) {
      const slug = page.replace('category-', '');
      nextRoute = { page: 'shop', categorySlug: slug, productSlug: '', searchQuery: '' };
    } else if (page === 'search') {
      nextRoute = { page: 'search', searchQuery: query ?? '', productSlug: '', categorySlug: '' };
    } else {
      const validPages: AppPage[] = ['home', 'shop', 'about', 'cart', 'checkout', 'auth', 'account', 'wishlist', 'admin'];
      const nextPage = validPages.includes(page as AppPage) ? page as AppPage : 'home';
      nextRoute = { page: nextPage, productSlug: '', categorySlug: '', searchQuery: '' };
    }

    const path = nextRoute.page === 'product'
      ? `/product/${nextRoute.productSlug}`
      : nextRoute.page === 'shop' && nextRoute.categorySlug
        ? `/category/${nextRoute.categorySlug}`
        : nextRoute.page === 'search'
          ? `/search${nextRoute.searchQuery ? `?q=${encodeURIComponent(nextRoute.searchQuery)}` : ''}`
          : nextRoute.page === 'home' ? '/' : `/${nextRoute.page}`;

    window.history.pushState(null, '', path);
    setRoute(nextRoute);
  };

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, categorySlug, productSlug, searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

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
          {isLoading && <Preloader />}
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
