import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SignupForm } from "@/components/signup-form"
import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile");
  }
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  )
}
