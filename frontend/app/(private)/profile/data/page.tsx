'use client'

import { ProfileForm } from "@/components/profile-data"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { UserRoundPen } from "lucide-react"

export default function ProfileData() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center p-4">
      <div className="w-full max-w-6xl">
        
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
              <BreadcrumbLink href="/profile/data">Meus Dados</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 mt-6 flex items-center">
          <UserRoundPen className="w-5 h-5 mr-2"/> <h1 className="text-xl font-semibold tracking-tight">Dados Pessoais</h1>
        </div>
        <ProfileForm />
      </div>
    </main>
  )
}