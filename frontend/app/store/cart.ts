// store/cart.ts
import { create } from "zustand";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, size?: string) => void;
  removeItem: (id: string, size?: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string, size?: string) => void;
  decreaseQuantity: (id: string, size?: string) => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],

  addItem: (item, size) =>
    set((state) => {
      const exists = state.items.find(
        (i) => i.id === item.id && i.size === size
      );

      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.size === size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { ...item, size, quantity: 1 },
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
      items: state.items.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: i.quantity + 1 }
          : i
    ),
  })),

  decreaseQuantity: (id, size) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      ),
    })),
}));