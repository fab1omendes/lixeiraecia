"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart-drawer";


export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto flex justify-between h-16 items-center px-4">

        <h1 className="font-bold text-lg md:text-xl" onClick={() => window.location.href = "/"}>Lixeira & Cia</h1>

        {/* Desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="/store">Produtos</a>
          <a href="/category">Categorias</a>
          <a href="/contact">Contato</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <User size={18} />
          </Button>
          <CartDrawer />

          {/* Mobile botão */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
          <a href="#">Produtos</a>
          <a href="#">Categorias</a>
          <a href="#">Contato</a>
        </div>
      )}
    </header>
  );
}