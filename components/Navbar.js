'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Function to check auth status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on route changes
    checkAuth();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">Lumberjacks Pet Care</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/subscriptions" className="text-gray-700 hover:text-primary-600">
              Subscriptions
            </Link>
            {isLoggedIn ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary-600 flex items-center gap-1">
                    <FiSettings /> Admin
                  </Link>
                )}
                <Link href="/account" className="text-gray-700 hover:text-primary-600">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link href="/cart" className="relative">
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-primary-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/subscriptions" className="block text-gray-700 hover:text-primary-600">
              Subscriptions
            </Link>
            {isLoggedIn ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="block text-gray-700 hover:text-primary-600 flex items-center gap-1">
                    <FiSettings /> Admin
                  </Link>
                )}
                <Link href="/account" className="block text-gray-700 hover:text-primary-600">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link href="/register" className="block bg-primary-600 text-white px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
            <Link href="/cart" className="flex items-center text-gray-700 hover:text-primary-600">
              <FiShoppingCart className="text-xl mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

