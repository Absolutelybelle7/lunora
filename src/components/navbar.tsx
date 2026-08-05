import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ShoppingBag } from 'lucide-react';
import { useAtom } from 'jotai';
import { cartItemsAtom } from '../store/cartStore';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [cartItems] = useAtom(cartItemsAtom); 
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-rose-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold text-rose-600">Luxe Bonnets</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/shop', label: 'Shop' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
              { path: '/admin', label: 'Admin' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-gray-600 hover:text-rose-500 transition-colors ${
                  location.pathname === link.path ? 'text-rose-500' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-rose-500 focus:outline-none"
            >
              {isOpen ? '✖' : '☰'} {/* Simple icon toggle */}
            </button>
          </div>

          <Link to="/" className="relative">
            <ShoppingBag className="w-6 h-6 text-gray-600 hover:text-rose-500 transition-colors" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-transparent shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/shop', label: 'Shop' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
              { path: '/admin', label: 'Admin' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-gray-600 hover:text-rose-500 transition-colors ${
                  location.pathname === link.path ? 'text-rose-500' : ''
                }`}
                onClick={toggleMenu} 
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
