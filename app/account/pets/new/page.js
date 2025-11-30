'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddPetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    dietaryPreferences: '',
    allergies: '',
    specialNeeds: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare data
      const petData = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dietaryPreferences: formData.dietaryPreferences 
          ? formData.dietaryPreferences.split(',').map(p => p.trim()).filter(p => p)
          : [],
        allergies: formData.allergies 
          ? formData.allergies.split(',').map(a => a.trim()).filter(a => a)
          : [],
        specialNeeds: formData.specialNeeds || undefined,
      };

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to account page with pets tab
        window.location.href = '/account?tab=pets';
      } else {
        setError(data.error || 'Failed to add pet. Please try again.');
      }
    } catch (error) {
      console.error('Add pet error:', error);
      setError('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/account?tab=pets" 
          className="text-primary-600 hover:underline mb-4 inline-block"
        >
          ← Back to My Pets
        </Link>
        <h1 className="text-3xl font-bold mt-4">Add New Pet</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Pet Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your pet's name"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Pet Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="small-animal">Small Animal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium mb-2">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Golden Retriever, Persian, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2">
                Age (years)
              </label>
              <input
                type="number"
                id="age"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Age"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                id="weight"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Weight"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dietaryPreferences" className="block text-sm font-medium mb-2">
              Dietary Preferences
            </label>
            <input
              type="text"
              id="dietaryPreferences"
              value={formData.dietaryPreferences}
              onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Grain-free, Organic, Wet food (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple preferences with commas</p>
          </div>

          <div>
            <label htmlFor="allergies" className="block text-sm font-medium mb-2">
              Allergies
            </label>
            <input
              type="text"
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Chicken, Wheat, Dairy (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple allergies with commas</p>
          </div>

          <div>
            <label htmlFor="specialNeeds" className="block text-sm font-medium mb-2">
              Special Needs
            </label>
            <textarea
              id="specialNeeds"
              value={formData.specialNeeds}
              onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special care requirements or medical conditions..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Adding Pet...' : 'Add Pet'}
            </button>
            <Link
              href="/account?tab=pets"
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

