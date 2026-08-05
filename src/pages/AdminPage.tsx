import { BarChart3, Box, ListCheck, Users, Bell } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { mockProducts } from '../lib/mockData';
import { formatPrice } from '../lib/currency';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const orders = [
  { id: 'order_1', date: '2026-06-20', total: 240, status: 'completed' },
  { id: 'order_2', date: '2026-06-18', total: 320, status: 'pending' },
  { id: 'order_3', date: '2026-06-12', total: 190, status: 'shipped' },
];

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeMetric, setActiveMetric] = useState('overview');

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), []);
  const totalProducts = mockProducts.length;
  const lowStock = mockProducts.filter((product) => product.stock_quantity < 20).length;

  useEffect(() => {
    document.title = 'Admin Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-charcoal mb-2">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Manage orders, products, customers, and site content.</p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-slate-100"
            >
              View storefront
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 xl:grid-cols-4 mb-10">
          {[
            { label: 'Revenue', value: formatPrice(revenue), icon: BarChart3 },
            { label: 'Products', value: totalProducts, icon: Box },
            { label: 'Low Stock', value: lowStock, icon: ListCheck },
            { label: 'Notifications', value: 3, icon: Bell },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-ivory text-charcoal mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-semibold text-charcoal mb-1">{metric.value}</p>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-charcoal">Sales overview</h2>
                <p className="text-sm text-slate-500">Last 30 days performance</p>
              </div>
              <div className="rounded-full border border-slate-200 px-4 py-2 text-sm text-charcoal">Monthly</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-slate-200 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">{order.date}</p>
                  <p className="text-xl font-semibold text-charcoal mb-1">{formatPrice(order.total)}</p>
                  <p className="text-sm text-slate-600">{order.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-ivory text-charcoal">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Customers</p>
                <p className="text-2xl font-semibold text-charcoal">1,280</p>
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setActiveMetric('overview')}
                className={`block w-full rounded-full px-5 py-3 text-left text-sm font-semibold transition ${activeMetric === 'overview' ? 'bg-charcoal text-white' : 'bg-slate-50 text-charcoal hover:bg-slate-100'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveMetric('products')}
                className={`block w-full rounded-full px-5 py-3 text-left text-sm font-semibold transition ${activeMetric === 'products' ? 'bg-charcoal text-white' : 'bg-slate-50 text-charcoal hover:bg-slate-100'}`}
              >
                Product Management
              </button>
              <button
                onClick={() => setActiveMetric('orders')}
                className={`block w-full rounded-full px-5 py-3 text-left text-sm font-semibold transition ${activeMetric === 'orders' ? 'bg-charcoal text-white' : 'bg-slate-50 text-charcoal hover:bg-slate-100'}`}
              >
                Order Management
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
