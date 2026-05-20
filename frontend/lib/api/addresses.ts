'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getToken() {
  const session = await getServerSession(authOptions)
  return (session as any)?.accessToken
}

export async function getAddresses() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/addresses`, {
    headers: {
      "Authorization": `Token ${token}`
    },
    cache: "no-store"
  })

  if (!res.ok) throw new Error("Erro ao buscar endereços")
  return res.json()
}

export async function createAddressAction(data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/addresses/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Token ${token}` 
      },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      revalidatePath('/profile/address')
      return { success: true }
    } else {
      const err = await res.json()
      return { success: false, error: err }
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function updateAddressAction(id: number, data: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/addresses/${id}/edit`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Token ${token}` 
      },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      revalidatePath('/profile/address')
      return { success: true }
    } else {
      const err = await res.json()
      return { success: false, error: err }
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function deleteAddressAction(id: number) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/addresses/${id}/delete`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Token ${token}` 
      },
    })

    if (res.ok) {
      revalidatePath('/profile/address')
      return { success: true }
    } else {
      const err = await res.json()
      return { success: false, error: err }
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
