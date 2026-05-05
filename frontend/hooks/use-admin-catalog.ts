import { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

export function useAdminCatalog() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = (session as any)?.accessToken;
    return {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    };
  };

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  }

  async function createCategory(data: { name: string; description?: string; image_url?: string }) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return { success: res.ok, data: await res.json() };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory(id: number, data: any) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return { success: res.ok, data: await res.json() };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { success: res.ok };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  // PRODUCTS
  async function getProduct(id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  }

  async function createProduct(data: any) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return { success: res.ok, data: await res.json() };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  async function updateProduct(id: number, data: any) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return { success: res.ok, data: await res.json() };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { success: res.ok };
    } catch (error) {
      return { success: false, error };
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
