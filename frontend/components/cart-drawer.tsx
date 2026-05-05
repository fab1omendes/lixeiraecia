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
import { ShoppingCart, Trash2, AlertTriangle, Plus, Minus } from "lucide-react";
import { useCart } from "@/app/(public)/store/cart";
import { cn } from "@/lib/utils";

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
        <Button variant="ghost" size="icon" className="relative group">
          <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg border-2 border-white animate-in zoom-in duration-300">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0 flex flex-col border-l-0 shadow-2xl">
        <div className="p-6 border-b bg-gray-50/50">
          <SheetHeader className="space-y-1">
            <SheetTitle className="flex items-center justify-between text-2xl font-outfit uppercase tracking-tighter">
              <ShoppingCart size={20} />
              <span className="font-outfit uppercase tracking-tighter text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                Meu Carrinho
              </span>
              <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                {items.length} {items.length === 1 ? 'Produto' : 'Produtos'}
              </div>
            </SheetTitle>
            <SheetDescription className="text-xs font-medium text-gray-500">
              Verifique o estoque e as quantidades antes de fechar o pedido.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="p-6 rounded-full bg-gray-100">
                <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-900 uppercase tracking-widest text-xs">Seu carrinho está vazio</p>
                <p className="text-xs text-gray-400 max-w-[200px]">Adicione produtos para começar sua jornada de limpeza moderna.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/10 transition-all group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 relative shadow-sm">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tighter leading-tight pr-4">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded leading-none">
                            {item.size || "Padrão"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
                          <button
                            onClick={() => decreaseQuantity(item.id, item.size)}
                            className="p-1 hover:bg-gray-50 rounded transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id, item.size)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 hover:bg-gray-50 rounded transition-colors disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        {item.quantity >= item.stock && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600 uppercase tracking-tighter">
                            <AlertTriangle size={10} />
                            Limite de estoque
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Item</p>
                        <p className="text-base font-black text-green-600 font-inter leading-none">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50/50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium">Subtotal</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-900 border-t border-gray-100 pt-2">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-outfit uppercase font-bold tracking-tighter">Total Geral</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black text-blue-600 font-inter tracking-tight">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl uppercase tracking-widest shadow-xl group/checkout active:scale-95 transition-all">
              Finalizar Compra
              <ShoppingCart className="ml-2 w-5 h-5 group-hover/checkout:translate-x-1 transition-transform" />
            </Button>
            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Processamento seguro via SSL</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}