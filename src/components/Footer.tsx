import { Instagram, Facebook, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const shopLinks = [
  { label: 'All Products', page: 'shop' },
  { label: 'New Arrivals', page: 'category-new-arrivals' },
  { label: 'Women', page: 'category-women' },
  { label: 'Men', page: 'category-men' },
  { label: 'Sale', page: 'category-sale' },
];

const careLinks = [
  { label: 'Contact Us', page: 'about' },
  { label: 'Shipping Info', page: 'about' },
  { label: 'Returns & Exchanges', page: 'about' },
  { label: 'Size Guide', page: 'about' },
  { label: 'FAQs', page: 'about' },
];

const aboutLinks = [
  { label: 'Our Story', page: 'about' },
  { label: 'Sustainability', page: 'about' },
  { label: 'Careers', page: 'about' },
  { label: 'Press', page: 'about' },
  { label: 'Store Locator', page: 'about' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = (page: string) => onNavigate?.(page);

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <ScrollReveal className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <span className="block text-[10px] uppercase tracking-[0.45em] text-neutral-400">LUNORA</span>
              <span className="block text-sm font-semibold uppercase tracking-[0.25em] text-white mt-0.5">Fashion</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-xs">
              Timeless fashion for every moment. Discover curated collections that blend elegance with everyday comfort.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Shop */}
          <ScrollReveal delay={0.05}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-5">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Customer Care */}
          <ScrollReveal delay={0.1}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-5">Customer Care</h3>
            <ul className="space-y-2.5">
              {careLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* About */}
          <ScrollReveal delay={0.15}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-5">About Us</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Stay Connected */}
          <ScrollReveal delay={0.2} className="col-span-2 md:col-span-1">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-5">Stay Connected</h3>
            <p className="text-sm text-neutral-400 mb-4">Subscribe for style tips and exclusive offers.</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-0 rounded-full border border-neutral-700 overflow-hidden"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500 min-w-0"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center text-neutral-400 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </ScrollReveal>
        </div>

        <div className="mt-14 pt-8 border-t border-neutral-800 text-center">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} LUNORA Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
