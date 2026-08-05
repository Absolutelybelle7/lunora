import { useEffect, useState } from 'react';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockProducts } from '../lib/mockData';
import { formatPrice } from '../lib/currency';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    loadProfile();
    loadOrders();
    loadWishlist();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userData = users.find((u: any) => u.id === user.id);
    setProfile(userData || { full_name: user.user_metadata?.full_name, loyalty_points: 0 });
  };

  const loadOrders = async () => {
    if (!user) return;
    const ordersData = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
    setOrders(ordersData);
  };

  const loadWishlist = async () => {
    if (!user) return;
    const wishlistData = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const enrichedWishlist = wishlistData.map((item: any) => {
      const product = mockProducts.find(p => p.id === item.product_id);
      return product ? { ...item, products: product } : null;
    }).filter(Boolean);
    setWishlist(enrichedWishlist);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-emerald-800"
            >
              Home
            </button>
            <span>/</span>
            <span>Account</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl font-bold">
                    {profile?.full_name?.[0] ||
                      user?.email?.[0]?.toUpperCase() ||
                      ''}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </h3>
                <p className="text-sm text-gray-600">{user?.email || 'No Email'}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  Addresses
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile?.full_name || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile?.phone || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loyalty Points
                      </label>
                      <div className="px-4 py-3 bg-emerald-50 rounded-lg">
                        <span className="text-2xl font-bold text-emerald-800">
                          {profile?.loyalty_points || 0}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">points</span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">
                        You haven't placed any orders yet
                      </p>
                      <button
                        onClick={() => onNavigate('shop')}
                        className="px-6 py-3 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Order #{order.order_number}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Total: {formatPrice(order.total)}
                            </span>
                            <button className="text-emerald-800 hover:underline font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                      <button
                        onClick={() => onNavigate('shop')}
                        className="px-6 py-3 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <img
                            src={item.products.images?.[0]}
                            alt={item.products.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {item.products.name}
                            </h3>
                            <p className="text-neutral-900 font-bold mb-4">
                              {formatPrice(item.products.sale_price || item.products.base_price)}
                            </p>
                            <button
                              onClick={() =>
                                onNavigate(`product-${item.products.slug}`)
                              }
                              className="w-full py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                            >
                              View Product
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No saved addresses yet</p>
                    <button className="px-6 py-3 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900">
                      Add New Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
