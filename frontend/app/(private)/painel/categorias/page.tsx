'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCatalog } from "@/hooks/use-admin-catalog";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { deleteCategory } = useAdminCatalog();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    
    const res = await deleteCategory(id);
    if (res.success) {
      setMessage({ type: 'success', text: "Categoria excluída com sucesso!" });
      fetchCategories();
    } else {
      setMessage({ type: 'error', text: (res.error as any)?.detail || "Erro ao excluir categoria." });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Categorias</h1>
          <p className="text-gray-500 mt-1 text-sm lg:text-base">Gerencie as categorias de produtos da sua loja.</p>
        </div>
        <Link href="/painel/categorias/nova">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-inter">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar categoria..." 
              className="pl-10 max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                            {cat.image_url ? (
                              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </div>
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{cat.description || "—"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link href={`/painel/categorias/editar/${cat.id}`}>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                      Nenhuma categoria encontrada.
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
