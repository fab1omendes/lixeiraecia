// components/product-card.tsx
"use client";

import { useCart } from "@/app/(public)/store/cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: any) {

  const addItem = useCart((state) => state.addItem);

  return (
    <Card className="hover:shadow-xl transition">
      <CardContent className="p-4">
        
        <img src={product.image} className="rounded mb-4" />

        <h3>{product.name}</h3>

        <p className="text-green-600 font-bold">
          R$ {product.price}
        </p>

        <p className="text-green-600 font-bold">
          Tamanho: {product.size}
        </p>

        <p className="text-green-600 font-bold">
          Qtd: {product.quantity}
        </p>

        <Button onClick={() => addItem(product, product.size)}>
          Adicionar
        </Button>

      </CardContent>
    </Card>
  );
}