"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart-drawer";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon } from "lucide-react";


import { useSession, signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (

    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#c0d0f0]/80 via-[#d4def6]/80 to-[#eef3fd]/80 backdrop-blur-md">

      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-2">

        {/* Mobile */}
        <div className="flex-1 mx-2 md:hidden">
          <h1 className="font-bold text-xs" onClick={() => window.location.href = "/"}>Lixeira & Cia</h1>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <h1 className="font-bold text-lg md:text-xl" onClick={() => window.location.href = "/"}>Lixeira & Cia</h1>
        </div>

        {/* Mobile */}
        <div className="flex max-w-xs mx-2 md:hidden">
          <InputGroup className="bg-white">
            <InputGroupInput
              placeholder="Estou buscando..."
              className="h-8 text-sm"
            />
            <InputGroupAddon>
              <SearchIcon size={16} />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Desktop */}
        <div className="w-full max-w-2xl hidden md:block">
          <InputGroup className="bg-white">
            <InputGroupInput placeholder="Buscar produtos, marcas e muito mais..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="/store">Produtos</a>
          <a href="/category">Categorias</a>
          <a href="/contact">Contato</a>
        </nav>


        <div className="flex items-center gap-2">
          {session ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full overflow-hidden w-9 h-9 border focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col mb-2 px-2 pb-2 border-b gap-1">
                  <span className="font-semibold text-sm truncate">{session.user?.name || "Sua Conta"}</span>
                  <span className="text-xs text-muted-foreground truncate">{session.user?.email || ""}</span>
                </div>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={() => window.location.href = "/purchases"}>
                  <Package className="mr-2" size={16} /> Minhas Compras
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={() => window.location.href = "/profile"}>
                  <User className="mr-2" size={16} /> Meu Perfil
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2" size={16} /> Sair
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
              <Button variant="ghost" size="icon" onClick={() => window.location.href = "/login"}>
                <User size={18} />
              </Button>
          )}
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