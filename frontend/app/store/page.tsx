import { Navbar } from "@/components/navbar";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <ProductGrid />
      <Footer />
    </>
  );
}