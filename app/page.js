'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { FiShoppingBag, FiHeart, FiTruck, FiShield } from 'react-icons/fi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true');
      const data = await response.json();
      setFeaturedProducts(data.products.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Lumberjacks Pet Care</h1>
          <p className="text-xl mb-8">Everything your pet needs, delivered to your door</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/subscriptions"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FiShoppingBag className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of products for all pets</p>
            </div>
            <div className="text-center">
              <FiTruck className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </div>
            <div className="text-center">
              <FiShield className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe and encrypted transactions</p>
            </div>
            <div className="text-center">
              <FiHeart className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Pet Care Experts</h3>
              <p className="text-gray-600">Expert advice and support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary-600 hover:underline">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-4 text-center py-12 text-gray-500">
                  No featured products available. Add some products to see them here!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="bg-primary-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Monthly Subscription Boxes</h2>
          <p className="text-gray-600 mb-8">
            Get curated pet supplies delivered monthly. Customize based on your pet&apos;s needs!
          </p>
          <Link
            href="/subscriptions"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
          >
            Start Subscription
          </Link>
        </div>
      </section>
    </div>
  );
}

