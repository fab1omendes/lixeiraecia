'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  ChevronRight,
  TrendingUp,
  Tag,
  Menu,
  X,
  Store,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  permission?: string;
}

const menuItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/painel",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    href: "/painel/produtos",
    icon: Package,
    permission: "products.view_product",
  },
  {
    title: "Categorias",
    href: "/painel/categorias",
    icon: Tag,
    permission: "products.view_category",
  },
  {
    title: "Catálogo de Imagens",
    href: "/painel/imagens",
    icon: ImageIcon,
    permission: "products.view_product",
  },
  {
    title: "Pedidos",
    href: "/painel/pedidos",
    icon: ShoppingCart,
    permission: "orders.view_order",
  },
  {
    title: "Usuários",
    href: "/painel/usuarios",
    icon: Users,
    permission: "users.view_customuser",
  },
  {
    title: "Promoções",
    href: "/painel/promocoes",
    icon: TrendingUp,
    permission: "promotions.view_coupon",
  },
  {
    title: "Configurações",
    href: "/painel/configuracoes",
    icon: Settings,
    permission: "admin.view_logentry",
  },
];

export function AdminSidebar({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const filteredItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return permissions.includes(item.permission);
  });

  return (
    <>
      {/* Floating Mobile Toggler (Below Native Navbar) */}
      <div className="lg:hidden fixed top-[70px] left-4 z-40">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="bg-white/90 backdrop-blur-sm shadow-sm border-gray-200 text-blue-600 font-bold flex items-center gap-2 h-9 px-4 rounded-full"
        >
          <Menu className="w-4 h-4" />
          Menu ADM
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-[70] w-64 bg-white border-r border-gray-200 flex flex-col h-screen transition-transform duration-300 shadow-sm lg:translate-x-0 outline-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header (Desktop) */}
        <div className="p-6 border-b border-gray-100 hidden lg:block">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Painel Administrativo
          </h2>
        </div>

        {/* Header (Mobile) */}
        <div className="p-6 border-b border-gray-100 lg:hidden flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Painel ADM
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                  )} />
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )} />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
              ADM
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-tight truncate">Membro da Equipe</span>
              <Link href="/" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                <Store className="w-3 h-3" />
                Ir para a loja
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
