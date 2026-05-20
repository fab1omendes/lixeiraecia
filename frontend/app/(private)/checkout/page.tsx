"use client"

import { useCart } from "@/app/(public)/store/cart"
import { useAddresses } from "@/hooks/use-addresses"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle, MapPin, ShoppingCart, CheckCircle, CreditCard, Trash2, Plus, Minus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { createOrderAction } from "@/lib/api/orders"

export default function CheckoutPage() {
  const { items, clearCart, increaseQuantity, decreaseQuantity, removeItem } = useCart()
  const { addresses, loading: loadingAddresses } = useAddresses()
  const router = useRouter()
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0]

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleConfirmOrder = async () => {
    if (!defaultAddress) {
      setError("Por favor, adicione um endereço antes de finalizar a compra.")
      return
    }

    if (items.length === 0) {
      setError("Seu carrinho está vazio.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (status !== 'authenticated') throw new Error("Usuário não autenticado.")

      await createOrderAction({
        address_id: defaultAddress.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      })

      clearCart()
      router.push('/purchases')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-6 text-center max-w-sm">Adicione produtos ao carrinho antes de prosseguir para o checkout.</p>
        <Button onClick={() => router.push('/store')}>Ir para a Loja</Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Checkout</h1>
          <p className="text-gray-500 text-sm">Revise seus itens e confirme seu pedido.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Endereço */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAddresses ? (
                  <p className="text-sm text-gray-500 animate-pulse">Carregando endereço...</p>
                ) : defaultAddress ? (
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{defaultAddress.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {defaultAddress.street}, {defaultAddress.number}
                        {defaultAddress.complement ? ` - ${defaultAddress.complement}` : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {defaultAddress.neighborhood}, {defaultAddress.city} - {defaultAddress.state}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">CEP: {defaultAddress.zip_code}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/profile/address')}>
                      Alterar
                    </Button>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-600 flex flex-col gap-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-5 h-5" />
                      Nenhum endereço cadastrado
                    </div>
                    <p className="text-sm">Para finalizar sua compra, você precisa adicionar um endereço de entrega.</p>
                    <Button variant="destructive" onClick={() => router.push('/profile/address')}>
                      Adicionar Endereço
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Itens */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Produtos ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-3 border-b last:border-0 group">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm uppercase tracking-tight truncate">{item.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                            <button onClick={() => decreaseQuantity(item.id, item.size)} className="p-1 hover:bg-white rounded-l-md transition-colors text-gray-500 hover:text-gray-900">
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id, item.size)} disabled={item.quantity >= item.stock} className="p-1 hover:bg-white rounded-r-md transition-colors text-gray-500 hover:text-gray-900 disabled:opacity-30">
                              <Plus size={14} />
                            </button>
                          </div>
                          {item.quantity >= item.stock && (
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter hidden sm:inline-block">Limite de Estoque</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="font-bold text-gray-900">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button onClick={() => removeItem(item.id, item.size)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Remover item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pagamento */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 uppercase">A Faturar</p>
                  <p className="text-sm text-gray-500 mt-1">O pagamento será combinado após a aprovação do pedido.</p>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frete</span>
                    <span className="text-green-600 font-medium">A Combinar</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold uppercase">Total Geral</span>
                  <span className="text-xl font-black text-blue-600 tracking-tight">R$ {total.toFixed(2)}</span>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleConfirmOrder}
                  disabled={loading || !defaultAddress || items.length === 0}
                  className="w-full h-12 uppercase tracking-widest font-black text-sm"
                >
                  {loading ? 'Processando...' : 'Confirmar Compra'}
                  {!loading && <CheckCircle className="ml-2 w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
