'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function signupAction(dataToSend: any) {
  try {
    const res = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    })

    if (res.ok) {
      return { success: true }
    } else {
      const errors = await res.json()
      return { success: false, error: errors }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
