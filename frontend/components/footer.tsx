import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// components/footer.tsx
export function Footer() {
  return ( 
    <footer className="py-10 border-t text-center text-sm text-muted-foreground bg-[#c0d0f0]/40 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo className="mb-4 [&_span]:text-gray-900 [&_span:last-child]:text-green-600 justify-center" />
            <p className="text-sm text-gray-400 leading-relaxed">
              Desde 2026 oferecendo as melhores soluções em gestão de resíduos para empresas e residências.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contato</h3>
            <div className="flex flex-col items-center gap-4 md:gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>(11) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>contato@lixeiraecia.com.br</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Políticas de Privacidade</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lixeira & Cia · Projeto Integrador Univesp
        </div>
      </div>
    </footer>
  );
}