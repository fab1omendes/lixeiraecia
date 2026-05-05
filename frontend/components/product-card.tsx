// components/product-card.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/app/(public)/store/cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Plus, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [product.image_url, ...(product.images || [])].filter(Boolean);

  const handleAdd = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.image_url || "/placeholder-product.jpg",
      stock: product.stock,
      size: product.size,
    }, quantity);
    setQuantity(1); // Reset local quantity after adding
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white h-full flex flex-col scale-[0.98] hover:scale-100">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Gallery Area */}
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Thumbnail indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        idx === currentImageIndex
                          ? "bg-blue-600 w-4"
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <Package className="w-12 h-12 mb-2" />
              <span className="text-xs uppercase font-bold tracking-widest">Sem Imagem</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg transform -rotate-12">
                Esgotado
              </span>
            </div>
          )}

          {/* Badge for size/color */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.size && (
              <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border shadow-sm uppercase tracking-tight">
                {product.size}
              </span>
            )}
            {product.color && (
              <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border shadow-sm uppercase tracking-tight">
                {product.color}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 line-clamp-2 font-outfit uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {product.category || "Geral"}
            </p>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex items-end justify-between border-t border-gray-50 pt-3">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Preço Unitário</p>
                <p className="text-xl font-black text-green-600 font-inter">
                  R$ {parseFloat(product.price).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight",
                  isOutOfStock ? "text-red-500" : "text-blue-500"
                )}>
                  <Info size={12} />
                  <span>{product.stock} em estoque</span>
                </div>
              </div>
            </div>

            {/* Quantity Controls & Add Button */}
            {!isOutOfStock ? (
              <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Quantidade</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrement}
                      disabled={quantity <= 1}
                      className="p-1 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold min-w-[20px] text-center">{quantity}</span>
                    <button
                      onClick={increment}
                      disabled={quantity >= product.stock}
                      className="p-1 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAdd}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-lg group/btn active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-100 text-gray-400 font-bold h-10 border border-gray-200"
              >
                Indisponível
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}