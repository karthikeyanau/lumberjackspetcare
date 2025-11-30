'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);
  
  // Find if this product is already in cart
  const cartItem = items.find(item => item.productId === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation to product page
    addItem(product);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart > 1) {
      updateQuantity(product._id, quantityInCart - 1);
    } else {
      updateQuantity(product._id, 0); // This will remove the item
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-64 bg-gray-200">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {quantityInCart > 0 ? (
              <div className="flex items-center gap-2 bg-primary-700 text-white rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="px-3 py-2 hover:bg-primary-800 transition flex items-center"
                >
                  <FiMinus />
                </button>
                <span className="px-3 py-2 font-semibold min-w-[2rem] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrease}
                  className="px-3 py-2 hover:bg-primary-800 transition flex items-center"
                >
                  <FiPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
              >
                <FiShoppingCart />
                Add to Cart
              </button>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-sm text-orange-600 mt-2">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-red-600 mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}

