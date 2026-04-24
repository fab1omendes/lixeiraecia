import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
