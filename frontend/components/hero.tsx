"use client";

export function Hero() {
  return (
    <section className="hidden md:block py-16 md:py-24 bg-gradient-to-r from-green-600 to-green-800 text-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-10">

        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Produtos de Limpeza com Qualidade
          </h1>

          <p className="mb-6 text-sm md:text-lg opacity-90">
            Tudo para limpeza profissional e doméstica em um só lugar.
          </p>

          <button className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold w-full md:w-auto"
            onClick={() => window.location.href = "/store"}>
            Ver produtos
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src="https://colect.com.br/uploads/9-21-05-2021-09-14-55-4232.png"
            className="rounded-xl shadow-xl w-full max-w-sm md:max-w-md"
          />
        </div>

      </div>
    </section>
  );
}