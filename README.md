# Lixeira e Cia

O **Lixeira e Cia** é uma plataforma web (vitrine e e-commerce) focada na exibição e venda de produtos. O sistema conta com uma interface amigável para os clientes e um painel de controle (dashboard) para o gerenciamento do catálogo e vendas.

## 🚀 Arquitetura e Tecnologias

A aplicação é dividida em dois componentes principais:

### 1. Frontend (Interface do Usuário)
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS e shadcn/ui (Radix UI)
- **Autenticação:** NextAuth.js
- **Gerenciamento de Estado:** Zustand
- **Animações e UI:** Framer Motion, Embla Carousel
- **Ícones:** Lucide React

### 2. Backend (API REST)
- **Framework:** Django & Django REST Framework (DRF)
- **Linguagem:** Python
- **Banco de Dados:** PostgreSQL (via `psycopg2`)
- **Processamento de Imagens:** Pillow
- **Documentação:** Swagger/Redoc (via `drf-spectacular`)
- **Servidor WSGI:** Gunicorn com WhiteNoise (para arquivos estáticos)

---

## 📁 Estrutura do Projeto

```text
lixeiraecia/
├── frontend/           # Aplicação Next.js (Vitrine, Carrinho e Painel de Administração)
├── backend/            # API Django REST Framework
└── LICENSE             # Arquivo de licença do projeto
```

---

## ⚙️ Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 20 ou superior)
- [npm](https://www.npmjs.com/) (Gerenciador de pacotes utilizado pelo projeto frontend)
- Python 3.10 ou superior
- Banco de Dados PostgreSQL

---

## 🛠️ Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/lixeiraecia.git
   cd lixeiraecia
   ```

### Configurando e Executando o Backend

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Crie e ative o ambiente virtual:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   # No Windows: .venv\Scripts\activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as Variáveis de Ambiente:**
   Crie ou edite o arquivo `.env` na pasta `backend` com as credenciais do banco de dados, `SECRET_KEY`, etc.

5. **Execute as migrações e suba o servidor:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   - **Backend API:** http://localhost:8000
   - **Swagger (Docs da API):** http://localhost:8000/api/schema/swagger-ui/ (se configurado)

### Configurando e Executando o Frontend

1. **Em um novo terminal, navegue até a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Verifique as variáveis de ambiente necessárias (como a URL do backend `NEXT_PUBLIC_API_URL` e `NEXTAUTH_SECRET`) e adicione-as em um arquivo `.env` ou `.env.local`.

4. **Suba o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   - **Frontend:** http://localhost:3000
