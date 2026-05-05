'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function ImagensPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      // 1. List files in 'catalog' bucket (root level for now)
      // Note: This only lists files in the root. 
      // If we have subfolders like /products and /categories, we need to list them too.
      const { data: productsData } = await supabase.storage.from('catalog').list('products');
      const { data: categoriesData } = await supabase.storage.from('catalog').list('categories');

      const allImages = [
        ...(productsData?.map(f => ({ ...f, path: `products/${f.name}` })) || []),
        ...(categoriesData?.map(f => ({ ...f, path: `categories/${f.name}` })) || [])
      ];

      // 2. Fetch all products and categories to check usage
      const [pRes, cRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      ]);

      const [products, categories] = await Promise.all([pRes.json(), cRes.json()]);
      
      const extraImages = products.flatMap((p: any) => p.images || []);
      const usedUrls = new Set([
        ...products.map((p: any) => p.image_url),
        ...categories.map((c: any) => c.image_url),
        ...extraImages
      ]);

      const processedImages = allImages.map(img => {
        const { data: { publicUrl } } = supabase.storage.from('catalog').getPublicUrl(img.path);
        return {
          ...img,
          url: publicUrl,
          isUsed: usedUrls.has(publicUrl)
        };
      });

      setImages(processedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(path: string) {
    if (!confirm("Tem certeza que deseja excluir esta imagem do storage?")) return;
    
    const { error } = await supabase.storage.from('catalog').remove([path]);
    if (!error) {
      setImages(images.filter(img => img.path !== path));
    } else {
      alert("Erro ao excluir imagem: " + error.message);
    }
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Catálogo de Imagens</h1>
        <p className="text-gray-500 mt-1 text-sm lg:text-base">Gerencie arquivos no Supabase Storage e remova imagens não vinculadas ao banco.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
          ))
        ) : images.length > 0 ? (
          images.map((img) => (
            <Card key={img.id} className="overflow-hidden group border-none shadow-sm h-full flex flex-col">
              <div className="aspect-square relative flex items-center justify-center bg-gray-50">
                <img src={img.url} className="w-full h-full object-cover" alt="" />
                {!img.isUsed && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 shadow-sm">
                    <AlertCircle className="w-3 h-3" />
                    Não utilizado
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={img.url} target="_blank" rel="noreferrer">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => deleteImage(img.path)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-400 truncate font-mono" title={img.name}>{img.name}</p>
                <p className="text-[10px] font-bold text-gray-600 mt-0.5">
                  {formatBytes(img.metadata?.size)}
                </p>
                <div className="mt-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {img.path.split('/')[0]}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            Nenhuma imagem encontrada no storage.
          </div>
        )}
      </div>
    </div>
  );
}
