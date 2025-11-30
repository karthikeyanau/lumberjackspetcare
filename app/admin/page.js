'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiSettings } from 'react-icons/fi';

function AdminContent() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    setUser(userObj);

    if (userObj.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch products count
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      
      // Fetch users count (we'll create this endpoint)
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const usersData = await usersRes.json();
      
      // Fetch orders count
      const ordersRes = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const ordersData = await ordersRes.json();

      setStats({
        totalProducts: productsData.products?.length || 0,
        totalUsers: usersData.users?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue: ordersData.totalRevenue || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your store from here</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <FiPackage className="text-4xl text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <FiUsers className="text-4xl text-secondary-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <FiShoppingBag className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <FiTrendingUp className="text-4xl text-secondary-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center">
              <FiPackage className="text-3xl text-primary-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                <p className="text-gray-600 text-sm mt-1">Add, edit, or delete products</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center">
              <FiUsers className="text-3xl text-secondary-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                <p className="text-gray-600 text-sm mt-1">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center">
              <FiShoppingBag className="text-3xl text-primary-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Orders</h3>
                <p className="text-gray-600 text-sm mt-1">Manage customer orders</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}

