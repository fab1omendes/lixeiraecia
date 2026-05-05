"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export default function Painel() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Vendas Totais",
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.revenue.value || 0),
      icon: TrendingUp,
      trend: stats?.revenue.trend || "0% do mês passado"
    },
    {
      title: "Novos Pedidos",
      value: `+${stats?.orders.value || 0}`,
      icon: ShoppingCart,
      trend: stats?.orders.trend || "0% do mês passado"
    },
    {
      title: "Novos Clientes",
      value: `+${stats?.users.value || 0}`,
      icon: Users,
      trend: stats?.users.trend || "0% do mês passado"
    },
    {
      title: "Estoque em Alerta",
      value: stats?.low_stock.value.toString() || "0",
      icon: Package,
      trend: stats?.low_stock.trend || "0 itens abaixo do mínimo",
      trendColor: (stats?.low_stock.value || 0) > 0 ? "text-red-600" : "text-green-600"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm lg:text-base">Bem-vindo ao centro de controle da Lixeira & Cia.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 font-inter">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="font-inter">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 font-medium ${(stat as any).trendColor || "text-blue-600"}`}>
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-outfit">Visão Geral de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
              Gráfico de Pedidos
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-outfit">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
              Logs do Sistema
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
