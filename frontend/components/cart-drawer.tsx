// components/cart-drawer.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/app/store/cart";

export function CartDrawer() {
  const { items, removeItem, increaseQuantity, decreaseQuantity } = useCart();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart size={18} />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1 py-0.5 rounded-full">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[350px] sm:w-[400px]">

        {/* Header */}
        <SheetHeader>
          <SheetDescription>
            Revise os itens antes de finalizar sua compra.
          </SheetDescription>
          <SheetTitle className="flex items-center justify-between">
            <span>Seu Carrinho</span>
            <span className="text-sm text-muted-foreground">
              ({items.length} itens)
            </span>
          </SheetTitle>

        </SheetHeader>

        {/* Lista */}
        <div className="mt-6 flex flex-col gap-6 p-4">

          {items.length === 0 && (
            <p className="text-center text-muted-foreground">
              Carrinho vazio
            </p>
          )}

          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4">

              {/* Imagem */}
              <img
                src={item.image}
                className="w-16 h-16 rounded object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  <button onClick={() => removeItem(item.id, item.size)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Tamanho: {item.size || "Padrão"}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x R$ {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">

                    {/* Quantidade */}
                    <div className="flex items-center gap-2">
                        <button
                        onClick={() => decreaseQuantity(item.id, item.size)}
                        className="px-2 border rounded"
                        >
                        -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                        onClick={() => increaseQuantity(item.id, item.size)}
                        className="px-2 border rounded"
                        >
                        +
                        </button>
                    </div>

                    {/* Total */}
                    <p className="text-sm font-bold text-green-600">
                        R$ {(item.price * item.quantity).toFixed(2)}
                    </p>

                </div>

              </div>
            </div>
          ))}

          {/* Total */}
          {items.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <Button className="w-full mt-4">
                Finalizar compra
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}