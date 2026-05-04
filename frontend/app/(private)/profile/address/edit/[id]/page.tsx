'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAddresses } from "@/hooks/use-addresses"

export default function EditAddress({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addresses, loading: loadingAddresses, updateAddress } = useAddresses()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    name: "",
    phone: "",
    withoutNumber: false
  })

  useEffect(() => {
    if (loadingAddresses) return;
    const addr = addresses.find((a: any) => a.id.toString() === id)
    if (addr) {
      setFormData({
        cep: addr.zip_code,
        street: addr.street,
        number: addr.number === "S/N" ? "" : addr.number,
        complement: addr.complement,
        name: addr.contact_name,
        phone: addr.contact_phone,
        withoutNumber: addr.number === "S/N",
        ...({ _city: addr.city, _state: addr.state, _neighborhood: addr.neighborhood } as any)
      })
    }
  }, [id, addresses, loadingAddresses])

  const handleCepFocusOut = async () => {
    if (formData.cep.length >= 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formData.cep.replace(/\D/g,'')}/json/`)
        const data = await res.json()
        if (!data.erro) {
           setFormData(prev => ({ ...prev, street: data.logradouro, _city: data.localidade, _state: data.uf, _neighborhood: data.bairro } as any))
        }
      } catch (e) {}
    }
  }

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await updateAddress(parseInt(id), {
      street: formData.street,
      number: formData.withoutNumber ? "S/N" : formData.number,
      complement: formData.complement,
      zip_code: formData.cep,
      city: (formData as any)._city || "São Paulo",
      state: (formData as any)._state || "SP",
      neighborhood: (formData as any)._neighborhood || "Centro",
    })

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile/address")
      }, 2000);
    } else {
      setError("Erro ao salvar endereço. Verifique os dados e tente novamente.");
      setLoading(false);
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Editar</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex items-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Editar endereço</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 relative">
          
          {/* Alertas */}
          {success && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="font-medium">Endereço atualizado com sucesso! Redirecionando...</p>
            </div>
          )}

          {error && !success && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6 max-w-2xl">
            {/* CEP */}
            <div className="flex flex-col gap-1 relative">
              <Label htmlFor="cep" className="text-gray-600 text-sm">CEP</Label>
              <div className="relative">
                 <Input 
                   id="cep" 
                   value={formData.cep}
                   onChange={e => setFormData({...formData, cep: e.target.value})}
                   onBlur={handleCepFocusOut}
                   className="h-12 w-full pr-[140px]" 
                 />
                 <a href="#" className="absolute right-4 top-3 text-sm text-blue-500 hover:text-blue-600 font-medium whitespace-nowrap">
                   Não sei meu CEP
                 </a>
              </div>
            </div>

            {/* Endereço Base from CEP (Read/Only mockup) */}
            <div className="flex items-center text-sm text-gray-700">
               <MapPin className="w-4 h-4 mr-2" />
               {(formData as any)._city ? `${(formData as any)._city}, ${(formData as any)._state}, ${(formData as any)._neighborhood}` : "São Paulo, SP, Centro"}
            </div>

            {/* Rua / Avenida */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="street" className="text-gray-600 text-sm">Rua / Avenida</Label>
              <Input 
                id="street" 
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
                className="h-12" 
              />
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="number" className="text-gray-600 text-sm">Número</Label>
                <div className="relative">
                  <Input 
                    id="number" 
                    value={formData.withoutNumber ? "" : formData.number}
                    onChange={e => setFormData({...formData, number: e.target.value})}
                    disabled={formData.withoutNumber}
                    className="h-12 w-full pr-[120px]" 
                  />
                  <div className="absolute right-4 top-3 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sem número</span>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300"
                      checked={formData.withoutNumber}
                      onChange={e => setFormData({...formData, withoutNumber: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="complement" className="text-gray-600 text-sm">Complemento (opcional)</Label>
                <Input 
                  id="complement" 
                  value={formData.complement}
                  onChange={e => setFormData({...formData, complement: e.target.value})}
                  className="h-12" 
                  placeholder="Apto, Bloco, etc."
                />
              </div>
            </div>

            {/* Separator / Subtitle */}
            <div className="pt-6">
              <h2 className="text-lg font-semibold text-gray-800">Dados de contato</h2>
              <p className="text-sm text-gray-500 mt-1">Se houver algum problema no envio, você receberá uma ligação neste número.</p>
            </div>

            {/* Nome Completo */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-gray-600 text-sm">Nome completo</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-12" 
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="phone" className="text-gray-600 text-sm">Telefone de contato</Label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm text-gray-500">+55</span>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="h-12 pl-12" 
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSave}
                disabled={loading || loadingAddresses || success}
                className="bg-blue-500 hover:bg-blue-600 min-w-[160px] h-12 font-semibold disabled:opacity-70 transition-all text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : success ? (
                  "Salvo!"
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
