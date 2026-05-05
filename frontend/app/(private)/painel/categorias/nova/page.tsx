'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminCatalog } from "@/hooks/use-admin-catalog";
import { ImageUpload } from "@/components/image-upload";

export default function NovaCategoriaPage() {
  const router = useRouter();
  const { createCategory, loading } = useAdminCatalog();
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "" });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const res = await createCategory(formData);
    if (res.success) {
      setMessage({ type: 'success', text: "Categoria criada com sucesso! Redirecionando..." });
      setTimeout(() => router.push("/painel/categorias"), 2000);
    } else {
      setMessage({ type: 'error', text: (res.error as any)?.detail || "Erro ao criar categoria." });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Nova Categoria</h1>
          <p className="text-gray-500 mt-1">Adicione uma nova classificação para seus produtos.</p>
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

      <Card className="border-none shadow-sm font-inter">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label>Imagem da Categoria</Label>
            <ImageUpload 
              path="categories"
              value={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input 
                id="name" 
                placeholder="Ex: Eletrônicos, Limpeza..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea 
                id="description" 
                placeholder="Uma breve descrição sobre os produtos desta categoria."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                disabled={loading || !formData.name}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Categoria
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
