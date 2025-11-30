'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  
  // Find if this product is already in cart
  const cartItem = items.find(item => item.productId === product?._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-primary-600 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Pet Type:</span>{' '}
              {product.petType?.join(', ') || 'All'}
            </p>
            {product.brand && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Stock:</span>{' '}
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </p>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                />
                {quantityInCart > 0 && (
                  <span className="text-sm text-gray-600">
                    ({quantityInCart} in cart)
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  quantityInCart > 0
                    ? 'bg-primary-700 text-white hover:bg-primary-800'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <FiShoppingCart />
                {quantityInCart > 0 ? `Add More (+${quantityInCart} in cart)` : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

