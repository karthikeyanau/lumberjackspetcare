import { create } from 'zustand';

const useCartStore = create((set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product._id
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
                quantity: 1,
              },
            ],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        const state = useCartStore.getState();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    })
);

export { useCartStore };

