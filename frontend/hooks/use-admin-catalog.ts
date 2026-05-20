import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  getCategory as getCategoryAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getProduct as getProductAction,
  createProductAction,
  updateProductAction,
  deleteProductAction
} from "@/lib/api/admin";

export function useAdminCatalog() {
  const [loading, setLoading] = useState(false);

  // IMAGES
  async function uploadImage(file: File, path: string) {
    setLoading(true);
    try {
      // 1. Upload to Supabase Storage (bucket: 'catalog')
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('catalog')
        .upload(filePath, file);

      if (error) throw error;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('catalog')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  // CATEGORIES
  async function getCategory(id: number) {
    return getCategoryAction(id);
  }

  async function createCategory(data: { name: string; description?: string; image_url?: string }) {
    setLoading(true);
    try {
      return await createCategoryAction(data);
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory(id: number, data: any) {
    setLoading(true);
    try {
      return await updateCategoryAction(id, data);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    setLoading(true);
    try {
      return await deleteCategoryAction(id);
    } finally {
      setLoading(false);
    }
  }

  // PRODUCTS
  async function getProduct(id: number) {
    return getProductAction(id);
  }

  async function createProduct(data: any) {
    setLoading(true);
    try {
      return await createProductAction(data);
    } finally {
      setLoading(false);
    }
  }

  async function updateProduct(id: number, data: any) {
    setLoading(true);
    try {
      return await updateProductAction(id, data);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    setLoading(true);
    try {
      return await deleteProductAction(id);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    uploadImage,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
