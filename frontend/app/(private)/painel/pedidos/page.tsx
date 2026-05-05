"use client"

import { useState } from "react";
import { useOrdersAdmin, OrderAdmin } from "@/hooks/use-orders-admin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  paid: { label: "Pago", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  canceled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function PedidosPainel() {
  const { orders, loading, error, updateStatus, refresh } = useOrdersAdmin();
  const [selectedOrder, setSelectedOrder] = useState<OrderAdmin | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleUpdateStatus = async (id: number, status: string) => {
    const res = await updateStatus(id, status);
    if (res.success) {
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Gestão de Pedidos</h1>
        <p className="text-gray-500 mt-2 text-sm lg:text-base">Visualize e gerencie todos os pedidos da loja.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-outfit">Histórico de Pedidos</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Pedidos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="canceled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refresh()}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && <p className="p-6 text-red-500 text-sm">{error}</p>}
          
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[100px] font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                <TableHead className="font-semibold text-gray-700">Data</TableHead>
                <TableHead className="font-semibold text-gray-700">Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    Nenhum pedido encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusMap[order.status]?.icon || Clock;
                  return (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-blue-600 font-inter">#{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{order.user.name}</span>
                          <span className="text-xs text-gray-500">{order.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusMap[order.status]?.color} border-none shadow-none flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusMap[order.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-outfit text-xl">Detalhes do Pedido #{order.id}</DialogTitle>
                              <DialogDescription>
                                Informações completas sobre a transação.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold uppercase text-gray-500">Cliente</h4>
                                  <p className="font-medium">{order.user.name}</p>
                                  <p className="text-sm text-gray-600">{order.user.email}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                  <h4 className="text-xs font-bold uppercase text-gray-500">Data</h4>
                                  <p className="font-medium">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase text-gray-500">Endereço de Entrega</h4>
                                <p className="text-sm text-gray-600">
                                  {order.address.street}, {order.address.number}<br />
                                  {order.address.city} - {order.address.state}
                                </p>
                              </div>

                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader className="bg-gray-50">
                                    <TableRow>
                                      <TableHead className="text-xs">Produto</TableHead>
                                      <TableHead className="text-center text-xs">Qtd</TableHead>
                                      <TableHead className="text-right text-xs">Preço</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="text-sm">{item.product_name}</TableCell>
                                        <TableCell className="text-center text-sm font-medium">{item.quantity}</TableCell>
                                        <TableCell className="text-right text-sm">
                                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="bg-gray-50/50">
                                      <TableCell colSpan={2} className="font-bold text-right">Total</TableCell>
                                      <TableCell className="text-right font-bold text-blue-600">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold uppercase text-gray-500">Status Atual</h4>
                                  <Badge className={`${statusMap[order.status]?.color} border-none`}>
                                    {statusMap[order.status]?.label}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  {order.status === 'pending' && (
                                    <>
                                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleUpdateStatus(order.id, 'paid')}>
                                        Marcar como Pago
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(order.id, 'canceled')}>
                                        Cancelar
                                      </Button>
                                    </>
                                  )}
                                  {order.status === 'paid' && (
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(order.id, 'canceled')}>
                                      Cancelar Pedido
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
