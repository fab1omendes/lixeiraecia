"use client"

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { useCatalog, Product } from "@/hooks/use-catalog";
import { Loader2, PackageSearch, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function ProductGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const { getProducts, loading } = useCatalog();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getProducts(search);
      setProducts(data);
    }
    load();
  }, [getProducts, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Buscando as melhores ofertas...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 min-h-[400px] text-center px-4">
        <PackageSearch className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">
          {search ? `Nenhum resultado para "${search}"` : "Nenhum produto disponível no momento."}
        </p>
        <p className="text-sm mb-6">Tente usar termos menos específicos ou outras palavras.</p>
        {search && (
          <Button variant="outline" onClick={() => router.push('/store')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Ver Todos os Produtos
          </Button>
        )}
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black text-gray-900 font-outfit uppercase tracking-tighter">
              {search ? `Busca: "${search}"` : "Nossa Vitrine"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-500 font-medium">
              {search ? `Encontramos ${products.length} itens correspondentes.` : "Qualidade e economia para sua casa ou empresa."}
            </p>
          </div>
          <div className="h-[2px] flex-1 bg-gray-100 hidden md:block mx-8" />
          <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
            {products.length} PRODUTOS
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}