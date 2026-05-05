import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
  stock: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size?: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string, size?: string) => void;
  decreaseQuantity: (id: string, size?: string) => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.id === item.id && i.size === item.size
          );

          if (exists) {
            const newQuantity = exists.quantity + quantity;
            if (newQuantity > item.stock) {
            // Cap at stock
              return {
                items: state.items.map((i) =>
                  i.id === item.id && i.size === item.size
                    ? { ...i, quantity: item.stock }
                    : i
                ),
              };
            }
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }

          // Ensure initial quantity doesn't exceed stock
          const finalQty = Math.min(quantity, item.stock);
          if (finalQty <= 0 && item.stock > 0) return state; // Should not happen if UI is correct

          return {
            items: [
              ...state.items,
              { ...item, quantity: finalQty },
            ],
          };
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size)
          ),
        })),

      clearCart: () => set({ items: [] }),

      increaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id && i.size === size) {
              if (i.quantity < i.stock) {
                return { ...i, quantity: i.quantity + 1 };
              }
            }
            return i;
          }),
        })),

      decreaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
              : i
          ),
        })),
    }),
    {
      name: "lixeiraecia-cart",
    }
  )
);