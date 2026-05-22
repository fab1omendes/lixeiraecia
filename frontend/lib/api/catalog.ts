'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProductsAction(search?: string, category?: string) {
  let url = `${API_URL}/products`
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  if (category) params.append("category", category)
  
  const queryString = params.toString()
  if (queryString) url += `?${queryString}`
  
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
