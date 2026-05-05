'use client'

import { ImageUpload } from "./image-upload";
import { Button } from "./ui/button";
import { Plus, X, Image as ImageIcon } from "lucide-react";

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  value: string[];
  path: string;
}

export function MultiImageUpload({ onImagesChange, value, path }: MultiImageUploadProps) {
  const addImage = () => {
    onImagesChange([...value, ""]);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...value];
    newImages[index] = url;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative group border rounded-xl overflow-hidden bg-gray-50 h-32">
            <ImageUpload 
              path={path}
              value={url}
              onUpload={(newUrl) => updateImage(index, newUrl)}
            />
            {url && (
                <button 
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl h-32 hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-500 hover:border-blue-200"
        >
          <div className="p-2 rounded-full bg-white shadow-sm">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Add Imagem</span>
        </button>
      </div>
    </div>
  );
}
