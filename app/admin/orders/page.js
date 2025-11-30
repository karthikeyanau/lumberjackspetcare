'use client';

import { useState, useEffect, Suspense, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiPackage, FiDollarSign, FiChevronDown, FiChevronUp, FiEdit } from 'react-icons/fi';

function OrdersContent() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [editingStatus, setEditingStatus] = useState(null);

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

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update the order in the list
        setOrders(orders.map(order => 
          order._id === orderId ? data.order : order
        ));
        setEditingStatus(null);
        alert('Order status updated successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: 'delivered', // Can't go further
      cancelled: 'cancelled', // Can't change cancelled
    };
    return statusFlow[currentStatus] || 'pending';
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(searchLower) ||
      order.userId?.name?.toLowerCase().includes(searchLower) ||
      order.userId?.email?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower)
    );
  });

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">View and manage customer orders</p>
          </div>
          <Link href="/admin" className="px-4 py-2 text-gray-700 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order._id);
                  const isEditing = editingStatus === order._id;
                  
                  return (
                    <Fragment key={order._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOrderExpansion(order._id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            <div className="text-sm font-medium text-gray-900">
                              #{order._id.toString().slice(-8)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.userId?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              onBlur={() => setEditingStatus(null)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                              autoFocus
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status || 'pending'}
                              </span>
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => {
                                    const nextStatus = getNextStatus(order.status);
                                    handleStatusUpdate(order._id, nextStatus);
                                  }}
                                  className="text-primary-600 hover:text-primary-800 text-xs"
                                  title="Update to next status"
                                >
                                  <FiEdit />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-start gap-3">
                                      {item.image && (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-16 h-16 object-cover rounded"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.name || item.productId?.name || 'Product'}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                          ${item.price?.toFixed(2) || '0.00'} each
                                        </p>
                                        <p className="text-sm font-semibold text-primary-600 mt-1">
                                          Total: ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {order.shippingAddress && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                                  <div className="text-sm text-gray-600">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>
                                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                  </div>
                                </div>
                              )}
                              {order.trackingNumber && (
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-gray-700">Tracking Number: </span>
                                  <span className="text-sm text-gray-900">{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

