'use client'

import { ProfileForm } from "@/components/profile-data"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function ProfileCard() {
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
              <BreadcrumbLink href="/profile/card">Meus Cartões</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 mt-6">
          <h1 className="text-xl font-semibold tracking-tight">Meus Cartões</h1>
        </div>
        <ProfileForm />
      </div>
    </main>
  )
}