"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay"

export function Hero() {
  return (
    <section className="hidden md:block py-16 md:py-24 bg-gradient-to-r from-[#c0d0f0]/80 via-[#d4def6]/80 to-[#eef3fd]/80 backdrop-blur-md">
      <div className="container mx-auto px-2">
        <Carousel
          plugins={[
            Autoplay({
              delay: 12000,
            }),
          ]}
        >
          <CarouselContent>
            <CarouselItem>
              {/* 👇 LIMITA A LARGURA AQUI */}
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* TEXTO */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold mb-6">
                    Produtos de Limpeza com Qualidade
                  </h1>

                  <p className="mb-6 text-sm md:text-lg opacity-90">
                    Tudo para limpeza profissional e doméstica em um só lugar.
                  </p>

                  <button
                    className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold w-full md:w-auto"
                    onClick={() => (window.location.href = "/store")}
                  >
                    Ver produtos
                  </button>
                </div>

                {/* IMAGEM */}
                <div className="flex-1 flex justify-center">
                  <img
                    src="https://colect.com.br/uploads/9-21-05-2021-09-14-55-4232.png"
                    className="rounded-xl shadow-xl w-full max-w-xs md:max-w-sm"
                  />
                </div>

              </div>
            </CarouselItem>
            <CarouselItem>
              {/* 👇 LIMITA A LARGURA AQUI */}
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* TEXTO */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold mb-6">
                    Temos todas as categorias de produtos para a sua Limpeza
                  </h1>

                  <p className="mb-6 text-sm md:text-lg opacity-90">
                    Confira nossos produtos e encontre o que você precisa.
                  </p>

                  <button
                    className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold w-full md:w-auto"
                    onClick={() => (window.location.href = "/store")}
                  >
                    Ver categorias
                  </button>
                </div>

                {/* IMAGEM */}
                <div className="flex-1 flex justify-center">
                  <img
                    src="https://colect.com.br/uploads/9-21-05-2021-09-14-55-4232.png"
                    className="rounded-xl shadow-xl w-full max-w-xs md:max-w-sm"
                  />
                </div>

              </div>
            </CarouselItem>
            <CarouselItem>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="variant-ghost" />
          <CarouselNext className="variant-ghost" />
        </Carousel>
      </div>
    </section>
  );
}
