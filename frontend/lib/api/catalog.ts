'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProductsAction(search?: string) {
  let url = `${API_URL}/products`
  if (search) url += `?search=${encodeURIComponent(search)}`
  
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error("Erro ao buscar produtos")
  return res.json()
}

export async function getCategoriesAction() {
  const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' })
  if (!res.ok) throw new Error("Erro ao buscar categorias")
  return res.json()
}

export async function getProductAction(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error("Produto não encontrado")
  return res.json()
}
