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
  const { addresses, loading, refetch, token } = useAddresses()

  // Sorter to keep billing address first
  const sortedAddresses = [...addresses].sort((a, b) => b.is_billing === a.is_billing ? 0 : b.is_billing ? 1 : -1)

  const handleUpdateAddress = async (id: number, data: any) => {
    if (!token) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/edit`, {
         method: "PUT",
         headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
         body: JSON.stringify(data),
      })
      refetch()
    } catch(e) { console.error(e) }
  }

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm("Tem certeza que deseja excluir esse endereço?")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/delete`, {
           method: "DELETE",
           headers: { "Authorization": `Token ${token}` },
        })
        refetch()
      } catch(e) { console.error(e) }
    }
  }

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

          {sortedAddresses.map((address) => (
            <Card key={address.id} className="p-0 overflow-hidden bg-white shadow-sm border-0 border-b relative rounded-lg">
               <div className="flex flex-col md:flex-row">
                 <div className="p-5 flex-1 space-y-2">
                   
                   <div className="flex justify-between items-start">
                     <p className="font-semibold text-gray-900 text-[15px]">
                       {address.street} {address.number} {address.complement && <span className="font-normal text-gray-800">{address.complement}</span>}
                     </p>
                     
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => router.push(`/profile/address/edit/${address.id}`)}>
                            Editar
                          </DropdownMenuItem>
                          {!address.is_billing && (
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(address.id)}>
                              Excluir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                     </DropdownMenu>
                   </div>
                   
                   <p className="text-[14px] text-gray-500">
                     CEP {address.zip_code} - {address.city} - {address.state}
                   </p>
                   
                   <div className="flex items-center gap-2 pt-2">
                     <p className="text-[14px] text-gray-500">{address.name}</p>
                     {address.is_billing && (
                       <Badge variant="secondary" className="bg-gray-100/50 text-gray-500 hover:bg-gray-100 border text-xs font-medium px-2 shadow-none">Faturamento (Obrigatório)</Badge>
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
                 <div className="border-t border-gray-100 md:border-t-0 md:border-l md:border-gray-50 p-4 flex flex-col items-center justify-center gap-4 min-w-[150px] bg-white md:bg-gray-50/10">
                    <div className="flex flex-col items-center gap-2 w-full">
                       <span className="text-[13px] font-medium text-gray-400 text-center leading-tight">
                         {address.is_default ? "Endereço Principal" : "Tornar Principal"}
                       </span>
                       <Switch 
                          checked={address.is_default}
                          onCheckedChange={(checked) => {
                            if (checked) handleUpdateAddress(address.id, { is_default: true })
                          }}
                          disabled={address.is_default}
                          className="data-[state=checked]:bg-blue-500"
                       />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 w-full pt-2 border-t border-gray-100">
                       <span className="text-[13px] font-medium text-gray-400 text-center leading-tight">
                         {address.is_billing ? "Faturamento" : "Tornar Faturamento"}
                       </span>
                       <Switch 
                          checked={address.is_billing}
                          onCheckedChange={(checked) => {
                            if (checked) handleUpdateAddress(address.id, { is_billing: true })
                          }}
                          disabled={address.is_billing}
                          className="data-[state=checked]:bg-blue-500"
                       />
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