'use client'

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminCatalog } from '@/hooks/use-admin-catalog';
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
  path: string;
}

export function ImageUpload({ onUpload, value, path }: ImageUploadProps) {
  const { uploadImage, loading } = useAdminCatalog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value || '');
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Local preview (fast)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Compression logic
    if (file.size > 150 * 1024) {
      setCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.15, // 150Kb
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        file = await imageCompression(file, options);
      } catch (error) {
        console.error("Compression error:", error);
      } finally {
        setCompressing(false);
      }
    }

    // Upload
    const result = await uploadImage(file, path);
    if (result.success && result.url) {
      onUpload(result.url);
    }
  };

  const removeImage = () => {
    setPreview('');
    onUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 w-full">
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl overflow-hidden transition-all h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 ${
          preview ? 'border-blue-200' : 'border-gray-200'
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Trocar Imagem</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="p-3 rounded-full bg-white shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm">Clique para fazer upload</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold opacity-50">Max 150Kb (Auto-compactado)</p>
          </div>
        )}

        {(loading || compressing) && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-blue-600">
              {compressing ? "Compactando..." : "Enviando..."}
            </p>
          </div>
        )}
      </div>

      {preview && !loading && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={removeImage}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Remover Imagem
        </Button>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
