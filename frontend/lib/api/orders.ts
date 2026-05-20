'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getToken() {
  const session = await getServerSession(authOptions)
  return (session as any)?.accessToken
}

export async function getMyOrders() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/orders/my-orders`, {
    headers: {
      "Authorization": `Token ${token}`
    },
    cache: "no-store"
  })

  if (!res.ok) throw new Error("Erro ao buscar pedidos")
  return res.json()
}

export async function createOrderAction(data: any) {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/orders/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Token ${token}` 
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.detail || "Erro ao criar pedido")
  }

  revalidatePath('/purchases')
  revalidatePath('/painel/pedidos')
  return res.json()
}

export async function getAdminOrders(statusFilter?: string) {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  let url = `${API_URL}/admin/orders`
  if (statusFilter) url += `?status=${statusFilter}`

  const res = await fetch(url, {
    headers: {
      "Authorization": `Token ${token}`
    },
    cache: "no-store"
  })

  if (!res.ok) throw new Error("Erro ao buscar pedidos")
  return res.json()
}

export async function updateOrderStatusAction(id: number, status: string) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ status })
    })

    if (res.ok) {
      revalidatePath('/painel/pedidos')
      revalidatePath('/purchases')
      return { success: true }
    } else {
      const err = await res.json()
      return { success: false, error: err.error || "Erro ao atualizar pedido" }
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
