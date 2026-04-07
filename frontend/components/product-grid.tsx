// components/product-grid.tsx
import { ProductCard } from "./product-card";

const products = [
  {
    id: "1",
    size: "200 ml",
    name: "Detergente Líquido",
    price: 5.99,
    image: "/prod1.jpg",
  },
  {
    id: "2",
    size: "2 Litros",
    name: "Desinfetante",
    price: 7.99,
    image: "/prod2.jpg",
  },
];

export function ProductGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto">

        <h2 className="text-3xl font-bold mb-10">
          Produtos em destaque
        </h2>

<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
        </div>

      </div>
    </section>
  );
}