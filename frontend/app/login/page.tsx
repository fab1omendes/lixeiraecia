import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
