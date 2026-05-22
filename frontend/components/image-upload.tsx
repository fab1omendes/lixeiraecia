'use client'

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminCatalog } from '@/hooks/use-admin-catalog';
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
  path: string;
}

// Target dimensions per path type
const RESIZE_CONFIG: Record<string, { width: number; height: number }> = {
  categories: { width: 800, height: 450 }, // 16:9 — matches category card
  products:   { width: 800, height: 800 }, // 1:1  — matches product card
};

/**
 * Center-crop and resize an image file to the target dimensions using Canvas.
 * Returns a new File with the resized image as JPEG.
 */
function resizeImageToFit(file: File, targetW: number, targetH: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;

      // Calculate dimensions to fit the image entirely within target bounds (contain)
      const targetRatio = targetW / targetH;
      const srcRatio = srcW / srcH;

      let drawW: number, drawH: number, offsetX: number, offsetY: number;

      if (srcRatio > targetRatio) {
        // Source is wider: fit to width, pad top/bottom
        drawW = targetW;
        drawH = Math.round(targetW / srcRatio);
        offsetX = 0;
        offsetY = Math.round((targetH - drawH) / 2);
      } else {
        // Source is taller: fit to height, pad sides
        drawH = targetH;
        drawW = Math.round(targetH * srcRatio);
        offsetX = Math.round((targetW - drawW) / 2);
        offsetY = 0;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));

      // Fill with white background to avoid black padding in JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      // Draw the image inside the calculated bounds
      ctx.drawImage(img, 0, 0, srcW, srcH, offsetX, offsetY, drawW, drawH);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas toBlob failed'));
          const resized = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resized);
        },
        'image/jpeg',
        0.92,
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}

export function ImageUpload({ onUpload, value, path }: ImageUploadProps) {
  const { uploadImage, loading } = useAdminCatalog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value || '');
  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately (fast feedback)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setProcessing(true);

    try {
      // Step 1 – Resize / center-crop to card dimensions
      const resizeTarget = RESIZE_CONFIG[path];
      if (resizeTarget) {
        setProcessingLabel('Redimensionando...');
        file = await resizeImageToFit(file, resizeTarget.width, resizeTarget.height);
      }

      // Step 2 – Compress if still large
      if (file.size > 150 * 1024) {
        setProcessingLabel('Compactando...');
        file = await imageCompression(file, {
          maxSizeMB: 0.15,
          maxWidthOrHeight: Math.max(
            resizeTarget?.width ?? 1920,
            resizeTarget?.height ?? 1920,
          ),
          useWebWorker: true,
        });
      }
    } catch (error) {
      console.error('Image processing error:', error);
    } finally {
      setProcessing(false);
      setProcessingLabel('');
    }

    // Step 3 – Upload to Supabase
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

  const isBusy = loading || processing;

  return (
    <div className="space-y-4 w-full">
      <div
        onClick={() => !isBusy && fileInputRef.current?.click()}
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
            <p className="text-[10px] uppercase tracking-wider font-semibold opacity-50">
              {RESIZE_CONFIG[path]
                ? `Auto-ajustado para ${RESIZE_CONFIG[path].width}×${RESIZE_CONFIG[path].height}px`
                : 'Max 150Kb (Auto-compactado)'}
            </p>
          </div>
        )}

        {isBusy && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-blue-600">
              {processingLabel || 'Enviando...'}
            </p>
          </div>
        )}
      </div>

      {preview && !isBusy && (
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
