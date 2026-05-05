'use client'

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCatalog } from "@/hooks/use-admin-catalog";
import { ImageUpload } from "@/components/image-upload";
import { MultiImageUpload } from "@/components/multi-image-upload";

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { getProduct, updateProduct, loading } = useAdminCatalog();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
    size: "",
    color: "",
    image_urls: [] as string[],
    is_active: true
  });
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function load() {
      // Load categories first
      const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (catRes.ok) setCategories(await catRes.json());

      // Load product
      const data = await getProduct(parseInt(id));
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          stock: data.stock.toString(),
          category_id: data.category_id.toString(),
          image_url: data.image_url || "",
          size: data.size || "",
          color: data.color || "",
          image_urls: data.images || [],
          is_active: data.is_active
        });
      }
      setInitialLoading(false);
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) return;

    const res = await updateProduct(parseInt(id), {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      category_id: parseInt(formData.category_id)
    });

    if (res.success) {
      setMessage({ type: 'success', text: "Produto atualizado com sucesso! Redirecionando..." });
      setTimeout(() => router.push("/painel/produtos"), 2000);
    } else {
      setMessage({ type: 'error', text: (res.error as any)?.detail || "Erro ao atualizar produto." });
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Editar Produto</h1>
          <p className="text-gray-500 mt-1">Atualize as informações do seu produto.</p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm font-inter">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho / Dimensões</Label>
                  <Input 
                    id="size" 
                    placeholder="Ex: 5L, 30cm, G"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input 
                    id="color" 
                    placeholder="Ex: Inox, Branco, Preto"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem Principal</Label>
                <ImageUpload 
                  path="products"
                  value={formData.image_url}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>

              <div className="space-y-2">
                <Label>Galeria de Imagens (Opcional)</Label>
                <MultiImageUpload 
                  path="products"
                  value={formData.image_urls}
                  onImagesChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm font-inter">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">Preço e Estoque</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda (R$)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Estoque Disponível</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm font-inter">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">Organização</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Produto Ativo na Loja</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 mt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base shadow-sm"
              disabled={loading || !formData.name || !formData.price || !formData.category_id}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando Alterações...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
