'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getToken() {
  const session = await getServerSession(authOptions)
  return (session as any)?.accessToken
}

function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`
  }
}

// ----------------------------------------------------
// DASHBOARD STATS
// ----------------------------------------------------
export async function getDashboardStats() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: getHeaders(token),
    cache: "no-store"
  })

  if (!res.ok) throw new Error('Erro ao buscar estatísticas do dashboard')
  return res.json()
}

// ----------------------------------------------------
// USERS
// ----------------------------------------------------
export async function getUsersAdmin() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/admin/users`, {
    headers: getHeaders(token),
    cache: "no-store"
  })

  if (!res.ok) throw new Error('Erro ao buscar usuários')
  return res.json()
}

export async function updateUserStatusAction(userId: number, status: string) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    })

    if (!res.ok) throw new Error('Erro ao atualizar status do usuário')
    revalidatePath('/painel/usuarios')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ----------------------------------------------------
// CATALOG (CATEGORIES & PRODUCTS)
// ----------------------------------------------------
export async function getCategory(id: number) {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/categories/${id}`, {
    headers: getHeaders(token),
    cache: "no-store"
  })
  return res.json()
}

export async function createCategoryAction(data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    })
    revalidatePath('/painel/categorias')
    return { success: res.ok, data: await res.json() }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCategoryAction(id: number, data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    })
    revalidatePath('/painel/categorias')
    return { success: res.ok, data: await res.json() }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteCategoryAction(id: number) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    })
    revalidatePath('/painel/categorias')
    return { success: res.ok }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getProduct(id: number) {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/products/${id}`, {
    headers: getHeaders(token),
    cache: "no-store"
  })
  return res.json()
}

export async function createProductAction(data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    })
    revalidatePath('/painel/produtos')
    return { success: res.ok, data: await res.json() }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProductAction(id: number, data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    })
    revalidatePath('/painel/produtos')
    return { success: res.ok, data: await res.json() }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProductAction(id: number) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    })
    revalidatePath('/painel/produtos')
    return { success: res.ok }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ----------------------------------------------------
// PROMOTIONS & COUPONS
// ----------------------------------------------------
export async function getAdminPromotions() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")
  const res = await fetch(`${API_URL}/admin/promotions`, { headers: getHeaders(token), cache: "no-store" })
  if (!res.ok) throw new Error("Erro ao buscar promoções")
  return res.json()
}

export async function getAdminCoupons() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")
  const res = await fetch(`${API_URL}/admin/coupons`, { headers: getHeaders(token), cache: "no-store" })
  if (!res.ok) throw new Error("Erro ao buscar cupons")
  return res.json()
}

export async function createPromotionAction(data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/admin/promotions`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Erro ao criar promoção')
    revalidatePath('/painel/promocoes')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function createCouponAction(data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/admin/coupons`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Erro ao criar cupom')
    revalidatePath('/painel/promocoes')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deletePromotionAction(id: number) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    })
    if (!res.ok) throw new Error('Erro ao excluir promoção')
    revalidatePath('/painel/promocoes')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
