"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, User, Package, Search as SearchIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart-drawer";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/use-profile";
import { useCatalog, Product } from "@/hooks/use-catalog";
import { useCart } from "@/app/(public)/store/cart";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getProducts } = useCatalog();
  const { data: session } = useSession();
  const { profile } = useProfile();

  const avatar = profile?.avatar || "";
  const name = profile?.name || "";
  const email = profile?.email || "";
  const [mounted, setMounted] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for autocomplete
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        const data = await getProducts(searchTerm);
        setResults(data.slice(0, 5));
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, getProducts]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowDropdown(false);
    if (searchTerm.trim()) {
      router.push(`/store?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(`/store`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#c0d0f0]/80 via-[#d4def6]/80 to-[#eef3fd]/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-2">
        {/* Mobile Logo */}
        <div className="flex-1 mx-2 md:hidden">
          <h1 className="font-bold text-xs cursor-pointer" onClick={() => router.push("/")}>Lixeira & Cia</h1>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:block shrink-0">
          <h1 className="font-bold text-lg md:text-xl cursor-pointer" onClick={() => router.push("/")}>Lixeira & Cia</h1>
        </div>

        {/* Search Container */}
        <div className="flex-1 max-w-2xl relative" ref={dropdownRef}>
          {/* Mobile Search */}
          <div className="md:hidden">
            <InputGroup className="bg-white">
              <InputGroupInput
                placeholder="Buscar..."
                className="h-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
              />
              <InputGroupAddon onClick={() => handleSearch()} className="cursor-pointer">
                <SearchIcon size={16} />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block w-full">
            <form onSubmit={handleSearch}>
              <InputGroup className="bg-white group-focus-within:ring-2 ring-blue-500/20 transition-all">
                <InputGroupInput
                  placeholder="Buscar produtos, marcas e muito mais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
                />
                <InputGroupAddon onClick={() => handleSearch()} className="cursor-pointer">
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-xl border border-gray-100 z-[100] mt-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="p-2 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Sugestões de produtos</span>
                <button
                  onClick={handleSearch}
                  className="text-[10px] font-bold text-blue-600 hover:underline px-2"
                >
                  Ver todos
                </button>
              </div>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSearchTerm(product.name);
                    router.push(`/store?search=${encodeURIComponent(product.name)}`);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={product.image_url || "/placeholder-product.jpg"}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      em {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-600">
                      R$ {parseFloat(product.price.toString()).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6 mx-4 shrink-0">
          <a href="/store" className="text-sm font-medium hover:text-blue-600">Produtos</a>
          <a href="/category" className="text-sm font-medium hover:text-blue-600">Categorias</a>
          <a href="/contact" className="text-sm font-medium hover:text-blue-600">Contato</a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {!mounted ? (
            <div className="w-9 h-9 flex items-center justify-center">
              <User size={18} className="text-gray-400 animate-pulse" />
            </div>
          ) : session ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full overflow-hidden w-9 h-9 border focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback>{name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col mb-2 px-2 pb-2 border-b gap-1">
                  <span className="font-semibold text-sm truncate">{name || "Sua Conta"}</span>
                  <span className="text-xs text-muted-foreground truncate">{email || ""}</span>
                </div>

                {(session.user as any).isStaff && (
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={() => router.push("/painel")}>
                    <LayoutDashboard className="mr-2" size={16} /> Painel
                  </Button>
                )}

                <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={() => router.push("/purchases")}>
                  <Package className="mr-2" size={16} /> Minhas Compras
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={() => router.push("/profile")}>
                  <User className="mr-2" size={16} /> Meu Perfil
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {
                  useCart.getState().clearCart();
                  signOut({ callbackUrl: '/' });
                }}>
                  <LogOut className="mr-2" size={16} /> Sair
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
              <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
                <User size={18} />
              </Button>
          )}
          <CartDrawer />

          <button onClick={() => setOpen(!open)} className="lg:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-4 border-t pt-4 bg-white/50">
          <a href="/store" className="font-medium">Produtos</a>
          <a href="/category" className="font-medium">Categorias</a>
          <a href="/contact" className="font-medium">Contato</a>
        </div>
      )}
    </header>
  );
}