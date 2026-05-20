'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getToken() {
  const session = await getServerSession(authOptions)
  return (session as any)?.accessToken
}

export async function getProfileAction() {
  const token = await getToken()
  if (!token) throw new Error("Não autenticado")

  const res = await fetch(`${API_URL}/user/me`, {
    headers: {
      "Authorization": `Token ${token}`
    },
    cache: "no-store"
  })

  if (!res.ok) throw new Error("Erro ao buscar perfil")
  return res.json()
}

export async function updateProfileAction(dataToSend: any) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(dataToSend)
    })

    if (res.ok) {
      const updatedData = await res.json()
      revalidatePath('/profile')
      return { success: true, data: updatedData }
    } else {
      const errors = await res.json()
      return { success: false, error: errors }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const token = await getToken()
  if (!token) return { success: false, error: "Não autenticado" }

  try {
    const res = await fetch(`${API_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    })

    if (res.ok) {
      return { success: true }
    } else {
      const err = await res.json()
      return { success: false, error: err.detail || "Erro ao alterar senha" }
    }
  } catch (e: any) {
    return { success: false, error: "Erro de conexão com o servidor" }
  }
}
