'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSecurity } from "@/hooks/use-security"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function ProfileSecurity() {
  const router = useRouter()
  const { changePassword, loading } = useSecurity()
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "A senha deve ter no mínimo 8 caracteres."
    if (!/[A-Z]/.test(pwd)) return "A senha deve conter pelo menos uma letra maiúscula."
    if (!/[0-9]/.test(pwd)) return "A senha deve conter pelo menos um número."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "A senha deve conter pelo menos um caractere especial."
    return null
  }

  const handleSave = async () => {
    setError("")
    setSuccess(false)

    if (!formData.current_password) {
      setError("Informe a senha atual.")
      return
    }

    const pwdError = validatePassword(formData.new_password)
    if (pwdError) {
      setError(pwdError)
      newPasswordRef.current?.focus()
      return
    }

    if (formData.new_password !== formData.confirm_new_password) {
      setError("As senhas não coincidem.")
      confirmPasswordRef.current?.focus()
      return
    }

    const res = await changePassword(formData.current_password, formData.new_password)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } else {
      setError(res.error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-4">
      <div className="w-full max-w-4xl">
        
        <Breadcrumb>
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
               <BreadcrumbLink href="/profile/security">Segurança</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 mt-6">
          <h1 className="text-xl font-semibold tracking-tight">Segurança</h1>
        </div>
        <div className="mb-8 mt-6">
          <h2 className="text-lg font-bold tracking-tight">Deseja alterar sua senha?</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-lg">
          {success && (
            <div className="mb-2 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="font-medium">Senha alterada com sucesso! Redirecionando...</p>
            </div>
          )}

          {error && !success && (
            <div className="mb-2 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="current_password">Informe a senha atual</Label>
            <Input 
              id="current_password" 
              type="password" 
              placeholder="Informe a sua senha atual" 
              value={formData.current_password}
              onChange={(e) => setFormData({...formData, current_password: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new_password">Nova senha</Label>
            <Input 
              id="new_password" 
              type="password" 
              placeholder="Informe a nova senha" 
              value={formData.new_password}
              ref={newPasswordRef}
              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
            />
            <p className="text-[11px] text-gray-500">Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm_new_password">Confirmar senha</Label>
            <Input 
              id="confirm_new_password" 
              type="password" 
              placeholder="Repita a nova senha" 
              value={formData.confirm_new_password}
              ref={confirmPasswordRef}
              onChange={(e) => setFormData({...formData, confirm_new_password: e.target.value})}
            />
          </div>
        </div>

        <div className="flex mt-8 gap-4 items-center">
          <Button
            onClick={handleSave}
            disabled={loading || success}
            className="bg-blue-500 hover:bg-blue-600 min-w-[160px] h-12 font-semibold disabled:opacity-70 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : success ? (
              "Salvo!"
            ) : (
              "Gravar Senha"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}