"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, MapPin, User, ShieldCheck, ChevronRight, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useAddresses } from "@/hooks/use-addresses"

const sections = [
  {
    title: "Conta",
    items: [
      {
        title: "Seu Perfil",
        description: "Dados pessoais e da conta",
        icon: User,
        color: "bg-purple-100 text-purple-600",
        href: "/profile/data",
      },
      {
        title: "Endereços",
        description: "Gerencie seus endereços",
        icon: MapPin,
        color: "bg-green-100 text-green-600",
        href: "/profile/address",
      },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      {
        title: "Cartões",
        description: "Cartões cadastrados",
        icon: CreditCard,
        color: "bg-blue-100 text-blue-600",
        href: "/profile/card",
      },
    ],
  },
  {
    title: "Segurança",
    items: [
      {
        title: "Segurança",
        description: "Configurações de segurança",
        icon: ShieldCheck,
        color: "bg-red-100 text-red-600",
        href: "/profile/security",
      },
    ],
  },
]

export default function Profile() {
  const router = useRouter()
  const { addresses, loading, requiresAttention } = useAddresses();

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
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 mt-6">
          <h1 className="text-xl font-semibold tracking-tight">Gerencie suas informações</h1>
        </div>

        <div className="space-y-8">
          {sections.map((section, sIndex) => (
            <div key={sIndex}>
              {/* Título da seção */}
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h2>
              </div>

              {/* GRID RESPONSIVO: 1 col mobile | 2 col md | 3 col lg */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        onClick={() => router.push(item.href)}
                        className="group cursor-pointer border-0 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all hover:shadow-md hover:bg-gray-100"
                      >
                        <CardHeader className="flex flex-row items-center justify-between gap-4 p-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${item.color} group-hover:text-primary`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex flex-col">
                              <CardTitle className="text-sm font-semibold leading-tight flex items-center gap-2">
                                {item.title}
                                {item.title === "Endereços" && requiresAttention && (
                                  <span className="text-red-500 flex items-center text-xs ml-2" title="Nenhum endereço cadastrado">
                                    <AlertTriangle className="w-4 h-4 mr-1" /> Requer atenção!
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-500">
                                {item.description}
                              </CardDescription>
                            </div>
                          </div>

                          {/* Chevron estilo app */}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </CardHeader>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
