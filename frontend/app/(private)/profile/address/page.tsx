'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { MapPin, MoreVertical, Plus, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAddresses } from "@/hooks/use-addresses"

export default function ProfileAddress() {
  const router = useRouter()
  const { addresses, loading, updateAddress, deleteAddress } = useAddresses()

  const onToggleDefault = async (id: number) => {
    const res = await updateAddress(id, { is_default: true });
    if (!res.success) alert("Erro ao atualizar endereço principal.");
  };

  const onToggleBilling = async (id: number) => {
    const res = await updateAddress(id, { is_billing: true });
    if (!res.success) alert("Erro ao atualizar endereço de faturamento.");
  };

  const onDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esse endereço?")) {
      const res = await deleteAddress(id);
      if (!res.success) {
        alert(res.error?.detail || "Erro ao excluir endereço. Verifique se existem pedidos vinculados.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex justify-center p-4">
      <div className="w-full max-w-[800px] mt-4">
        
        <Breadcrumb className="mb-4 hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">Minha Conta</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile/address">Endereços</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Endereços</h1>
        </div>

        <div className="space-y-4">
          {loading && (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-500" /></div>
          )}
          {!loading && addresses.length === 0 && (
             <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Nenhum endereço cadastrado ainda.</p>
             </div>
          )}

          {addresses.map((address) => (
            <Card key={address.id} className="p-0 overflow-hidden bg-white shadow-sm border border-gray-100 relative rounded-lg">
              <div className="flex flex-col md:flex-row min-h-[160px]">
                {/* Main Content */}
                 <div className="p-5 flex-1 space-y-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-900 text-[16px]">
                      {address.street} {address.number} {address.complement && <span className="font-normal text-gray-700">, {address.complement}</span>}
                    </p>
                    <p className="text-[14px] text-gray-500">
                      CEP {address.zip_code} - {address.city} - {address.state}
                    </p>
                  </div>
                   
                  <div className="flex items-center gap-2 pt-1">
                     <p className="text-[14px] text-gray-500">{address.name}</p>
                     {address.is_billing && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 text-[11px] font-semibold px-2 py-0 h-5 shadow-none">Faturamento (Obrigatório)</Badge>
                    )}
                    {address.is_default && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 text-[11px] font-semibold px-2 py-0 h-5 shadow-none">Principal</Badge>
                     )}
                   </div>
                   
                   <p className="text-[14px] text-gray-500">
                     {address.contact_name} - {address.contact_phone}
                   </p>

                   <div className="pt-2">
                     <button className="text-[14px] text-blue-500 font-medium hover:text-blue-600 flex items-center">
                       Incluir informações adicionais <span className="ml-1 text-lg leading-none">→</span>
                     </button>
                   </div>
                 </div>

                 {/* Switches Side */}
                <div className="border-t border-gray-100 md:border-t-0 md:border-l p-4 flex flex-row md:flex-col items-center justify-center gap-6 min-w-[180px] bg-gray-50/20">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {address.is_default ? "Principal" : "Tornar Principal"}
                       </span>
                       <Switch 
                          checked={address.is_default}
                      onCheckedChange={() => onToggleDefault(address.id)}
                          disabled={address.is_default}
                      className="data-[state=checked]:bg-blue-500 scale-90"
                       />
                    </div>
                    
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                         {address.is_billing ? "Faturamento" : "Tornar Faturamento"}
                       </span>
                       <Switch 
                          checked={address.is_billing}
                      onCheckedChange={() => onToggleBilling(address.id)}
                          disabled={address.is_billing}
                      className="data-[state=checked]:bg-blue-500 scale-90"
                       />
                    </div>
                 </div>

                {/* Actions Side (FAR RIGHT) */}
                <div className="flex items-start p-4 bg-gray-50/20">
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="font-medium" onSelect={() => router.push(`/profile/address/edit/${address.id}`)}>
                          Editar
                        </DropdownMenuItem>
                        {addresses.length > 1 && (
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 font-medium" onSelect={() => onDelete(address.id)}>
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
               </div>
            </Card>
          ))}

          <Button 
            className="w-full mt-4 bg-[#e8f1fd] text-blue-500 hover:bg-[#d6e5ff] shadow-none h-12 rounded-md font-semibold text-[15px]" 
            onClick={() => router.push('/profile/address/new')}
          >
             <Plus className="w-5 h-5 mr-1" /> Adicionar novo endereço
          </Button>

        </div>
      </div>
    </main>
  )
}