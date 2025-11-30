'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiX } from 'react-icons/fi';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login?redirect=/subscriptions');
      return;
    }

    setUser(JSON.parse(userData));
    fetchSubscriptions();
  }, [router]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.subscriptions) {
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login?redirect=/subscriptions');
        return;
      }

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: plan.name,
          price: plan.price,
          frequency: plan.frequency,
          status: 'active',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully subscribed to ${plan.name}!`);
        fetchSubscriptions(); // Refresh the list
      } else {
        alert(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSubscriptionAction = async (subscriptionId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Subscription ${action} successfully!`);
        fetchSubscriptions();
      } else {
        alert(data.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const subscriptionPlans = [
    {
      name: 'Basic Box',
      price: 29.99,
      frequency: 'monthly',
      description: 'Perfect for small pets',
      features: [
        '2-3 premium products',
        'Treats and toys',
        'Grooming essentials',
        'Free shipping',
      ],
    },
    {
      name: 'Premium Box',
      price: 49.99,
      frequency: 'monthly',
      description: 'Best value for medium pets',
      features: [
        '4-5 premium products',
        'Premium treats',
        'Health supplements',
        'Grooming kit',
        'Free shipping',
        'Priority support',
      ],
    },
    {
      name: 'Deluxe Box',
      price: 79.99,
      frequency: 'monthly',
      description: 'Ultimate care package',
      features: [
        '6-8 premium products',
        'Gourmet treats',
        'Full health kit',
        'Premium grooming',
        'Specialty toys',
        'Free shipping',
        '24/7 support',
        'Customization',
      ],
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscription Boxes</h1>
        <p className="text-gray-600 text-lg">
          Monthly curated boxes delivered to your door. Customize based on your pet&apos;s needs!
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subscriptionPlans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 ${
              index === 1 ? 'border-2 border-primary-600 transform scale-105' : ''
            }`}
          >
            {index === 1 && (
              <div className="bg-primary-600 text-white text-center py-2 rounded-lg mb-4 -mt-6">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600">/{plan.frequency}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <FiCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe(plan)}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Your Active Subscriptions</h2>
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{sub.planName}</h3>
                    <p className="text-sm text-gray-600">
                      {sub.frequency} • ${sub.price}/{sub.frequency}
                    </p>
                    {sub.nextDeliveryDate && (
                      <p className="text-sm text-gray-600 mt-2">
                        Next delivery: {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      sub.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      // Pause/Resume subscription
                      const newStatus = sub.status === 'active' ? 'paused' : 'active';
                      handleSubscriptionAction(sub._id, newStatus);
                    }}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    {sub.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this subscription?')) {
                        handleSubscriptionAction(sub._id, 'cancelled');
                      }
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-12 bg-primary-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Choose Your Plan</h3>
            <p className="text-gray-600">
              Select a subscription box that fits your pet&apos;s needs
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Customize</h3>
            <p className="text-gray-600">
              Tell us about your pet and we&apos;ll personalize the box
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Receive & Enjoy</h3>
            <p className="text-gray-600">
              Get your curated box delivered monthly to your door
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

