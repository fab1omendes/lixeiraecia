"use client"

import { useOrders } from "@/hooks/use-orders"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, Truck } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PurchasesPage() {
  const { orders, loading, error } = useOrders()

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' }
      case 'accepted':
        return { label: 'Aceito / Faturado', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
      case 'paid':
        return { label: 'Pago', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
      case 'canceled':
        return { label: 'Cancelado', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
      default:
        return { label: status, icon: Package, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-8 mt-6">
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            Minhas Compras
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe o status dos seus pedidos.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse h-40 bg-gray-50 border-0" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma compra encontrada</h2>
            <p className="text-gray-500">Você ainda não realizou nenhum pedido em nossa loja.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <Card key={order.id} className="overflow-hidden border-gray-200 shadow-sm">
                  <div className={`px-4 py-3 border-b flex justify-between items-center ${statusInfo.bg}`}>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pedido #{order.id}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(order.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-white ${statusInfo.color} shadow-sm border border-white/50`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>
                  
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.product_name}</p>
                              <p className="text-xs text-gray-500">Qtd: {item.quantity} x R$ {item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="font-bold text-gray-900">
                            R$ {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="bg-gray-50 border-t p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Endereço de Entrega</p>
                        <p>{order.address.street}, {order.address.number}</p>
                        <p>{order.address.city} - {order.address.state}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Total do Pedido</p>
                      <p className="text-2xl font-black text-blue-600 tracking-tight">R$ {order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Forma: {order.payment_method || 'A Faturar'}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
