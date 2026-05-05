'use client'

import { useEffect, useState } from "react";
import { useCatalog, Category } from "@/hooks/use-catalog";
import { Loader2, Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoriasPage() {
  const { getCategories, loading } = useCatalog();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, [getCategories]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black text-gray-900 font-outfit uppercase tracking-tighter">
          Explore por Categorias
        </h1>
        <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Encontre tudo o que você precisa em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link href={`/store?category=${cat.id}`} key={cat.id} className="group">
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 h-full relative">
              <CardContent className="p-0 h-full">
                <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                  {cat.image_url ? (
                    <img 
                      src={cat.image_url} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white font-outfit mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-gray-200 text-sm line-clamp-1 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {cat.description}
                      </p>
                    )}
                    <div className="flex items-center text-blue-400 font-bold text-sm">
                      Ver Produtos <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          Nenhuma categoria cadastrada ainda.
        </div>
      )}
    </main>
  );
}
