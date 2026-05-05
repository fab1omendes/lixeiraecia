"use client"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Save
} from "lucide-react";

export default function ConfiguracoesPainel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Configurações do Sistema</h1>
        <p className="text-gray-500 mt-2 text-sm lg:text-base">Gerencie as informações gerais da loja e preferências do sistema.</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-outfit flex items-center gap-2 text-blue-600">
              <Store className="w-5 h-5" />
              Informações da Loja
            </CardTitle>
            <CardDescription>
              Dados que aparecem no rodapé e nos e-mails para os clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nome da Loja</Label>
                <Input id="store-name" defaultValue="Lixeira & Cia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">E-mail de Contato</Label>
                <Input id="store-email" defaultValue="contato@lixeiraecia.com.br" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">Telefone / WhatsApp</Label>
                <Input id="store-phone" defaultValue="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-url">URL do Site</Label>
                <Input id="store-url" defaultValue="https://lixeiraecia.com.br" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-address">Endereço Físico</Label>
              <Input id="store-address" defaultValue="Rua das Industrias, 123 - São Paulo, SP" />
            </div>
            <div className="pt-4 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-outfit flex items-center gap-2 text-blue-600">
              <Globe className="w-5 h-5" />
              Configurações de SEO
            </CardTitle>
            <CardDescription>
              Gerencie como sua loja aparece nos motores de busca (Google, Bing).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Título SEO Padrão</Label>
              <Input id="meta-title" defaultValue="Lixeira & Cia | As Melhores Lixeiras do Brasil" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-desc">Meta Descrição</Label>
              <Input id="meta-desc" defaultValue="Compre lixeiras de alta qualidade para sua casa ou empresa com os melhores preços e entrega rápida." />
            </div>
            <div className="pt-4 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Atualizar SEO
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
