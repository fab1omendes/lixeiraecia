"use client"

import { useState } from "react";
import { usePromotionsAdmin, PromotionAdmin, CouponAdmin } from "@/hooks/use-promotions-admin";
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
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Tag, 
  Ticket,
  Calendar,
  Percent,
  CircleDollarSign
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PromocoesPainel() {
  const { promotions, coupons, loading, error, deletePromotion } = usePromotionsAdmin();
  const [activeTab, setActiveTab] = useState("promocoes");

  if (loading && promotions.length === 0 && coupons.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Promoções e Cupons</h1>
          <p className="text-gray-500 mt-2 text-sm lg:text-base">Gerencie ofertas especiais e códigos de desconto.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Nova {activeTab === "promocoes" ? "Promoção" : "Cupom"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova {activeTab === "promocoes" ? "Promoção" : "Cupom"}</DialogTitle>
                <DialogDescription>
                  Preencha os dados básicos. Funcionalidade de criação simplificada.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 border-2 border-dashed rounded-lg text-center text-gray-500 italic">
                Formulário de criação será implementado em breve.
              </div>
              <DialogFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button disabled>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100/80 p-1 border border-gray-200">
          <TabsTrigger value="promocoes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Tag className="w-4 h-4 mr-2" />
            Promoções em Produtos
          </TabsTrigger>
          <TabsTrigger value="cupons" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Ticket className="w-4 h-4 mr-2" />
            Cupons de Desconto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promocoes" className="space-y-4">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6">Nome</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right px-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-gray-500">Nenhuma promoção ativa.</TableCell>
                    </TableRow>
                  ) : (
                    promotions.map((p) => (
                      <TableRow key={p.id} className="group hover:bg-gray-50/50">
                        <TableCell className="px-6 py-4 font-semibold text-gray-900">{p.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-blue-700 font-bold">
                            {p.discount_type === 'percentage' ? <Percent className="w-4 h-4" /> : <CircleDollarSign className="w-4 h-4" />}
                            {p.discount_type === 'percentage' ? `${p.discount_value}%` : `R$ ${p.discount_value}`}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={p.is_active ? "bg-green-100 text-green-700 border-none px-3" : "bg-gray-100 text-gray-600 border-none px-3"}>
                            {p.is_active ? "Ativa" : "Pausada"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => deletePromotion(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cupons" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((c) => (
              <Card key={c.id} className="border-none shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-blue-200 text-blue-700 font-bold bg-blue-50/50 px-3 py-1 text-sm tracking-widest font-mono">
                      {c.code}
                    </Badge>
                    <Badge className={c.is_active ? "bg-green-100 text-green-700 border-none" : "bg-gray-100 text-gray-600 border-none"}>
                      {c.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `R$ ${c.discount_value}`}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-tighter">de desconto</span>
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Mínimo:</span>
                      <span className="font-semibold text-gray-700">R$ {c.min_value}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Uso:</span>
                      <span className="font-semibold text-gray-700">{c.used_count} / {c.max_uses || '∞'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-2">
                      <Calendar className="w-3 h-3" />
                      Até {new Date(c.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {coupons.length === 0 && (
              <div className="col-span-full h-40 flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50/50 text-gray-400">
                Nenhum cupom cadastrado.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
