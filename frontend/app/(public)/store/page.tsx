import { Navbar } from "@/components/navbar";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

export default function Store() {
  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-10">
      <Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
        <ProductGrid />
      </Suspense>
    </main>
  )
}