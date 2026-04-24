"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart-drawer";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const userInitials = session?.user?.name
    ? session.user.name.substring(0, 2).toUpperCase()
    : "US";

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-6 w-6 rounded-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "Usuário"} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/profile"}>
                  Ver Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sair da Conta (Logout)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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