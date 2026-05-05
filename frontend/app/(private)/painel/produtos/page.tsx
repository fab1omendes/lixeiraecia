'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Search, AlertCircle, CheckCircle2, Package, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCatalog } from "@/hooks/use-admin-catalog";
import { cn } from "@/lib/utils";

export default function ProdutosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { deleteProduct } = useAdminCatalog();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    const res = await deleteProduct(id);
    if (res.success) {
      setMessage({ type: 'success', text: "Produto excluído com sucesso!" });
      fetchProducts();
    } else {
      setMessage({ type: 'error', text: (res.error as any)?.detail || "Erro ao excluir produto." });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Produtos</h1>
          <p className="text-gray-500 mt-1 text-sm lg:text-base">Gerencie seu catálogo de produtos e estoque.</p>
        </div>
        <Link href="/painel/produtos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-inter">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <Card className="border-none shadow-sm font-inter">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar produto por nome ou categoria..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="text-gray-600 border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Tamanho</th>
                  <th className="px-6 py-4">Cor</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-16"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-100">
                            {prod.image_url ? (
                              <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{prod.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{prod.size || "-"}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{prod.color || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] uppercase font-bold rounded tracking-wider">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "font-semibold",
                          prod.stock <= 5 ? "text-red-600" : "text-gray-700"
                        )}>
                          {prod.stock} un
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                          prod.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {prod.is_active ? "Ativo" : "Pausado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Link href={`/painel/produtos/editar/${prod.id}`}>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDelete(prod.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
