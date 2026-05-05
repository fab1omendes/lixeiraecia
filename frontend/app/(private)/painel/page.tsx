

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

export default function Painel() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm lg:text-base">Bem-vindo ao centro de controle da Lixeira & Cia.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Vendas Totais", value: "R$ 45.231,89", icon: TrendingUp, trend: "+20.1% do mês passado" },
          { title: "Novos Pedidos", value: "+235", icon: ShoppingCart, trend: "+180.1% do mês passado" },
          { title: "Novos Clientes", value: "+12,234", icon: Users, trend: "+19.0% do mês passado" },
          { title: "Estoque em Alerta", value: "12", icon: Package, trend: "4 itens abaixo do mínimo" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 font-inter">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="font-inter">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-blue-600 mt-1 font-medium">
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
