'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'orders', 'pets', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      fetchUserData();
    }
  }, [user, activeTab]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Fetch pets
      const petsResponse = await fetch('/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const petsData = await petsResponse.json();
      if (petsData.pets) {
        setPets(petsData.pets);
      } else if (petsData.error) {
        console.error('Error fetching pets:', petsData.error);
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.orders) {
        setOrders(ordersData.orders);
      } else if (ordersData.error) {
        console.error('Error fetching orders:', ordersData.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-2xl text-primary-600" />
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'orders'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <FiPackage className="inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('pets')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'pets'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <FiHeart className="inline mr-2" />
                My Pets
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <FiSettings className="inline mr-2" />
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Loyalty Points</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {user.loyaltyPoints || 0}
                  </p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Total Orders</p>
                  <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Pets Registered</p>
                  <p className="text-3xl font-bold text-primary-600">{pets.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No orders yet.</p>
              )}
            </div>
          )}

          {activeTab === 'pets' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Pets</h2>
                <Link
                  href="/account/pets/new"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Add Pet
                </Link>
              </div>
              {pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div key={pet._id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.type} {pet.breed && `• ${pet.breed}`}
                      </p>
                      {pet.age && <p className="text-sm text-gray-600">Age: {pet.age} years</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No pets registered yet.</p>
                  <Link
                    href="/account/pets/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-block"
                  >
                    Add Your First Pet
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Profile editing functionality would be implemented here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}

