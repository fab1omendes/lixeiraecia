// components/footer.tsx
export function Footer() {
  return (
    <footer className="py-10 border-t text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Lixeira & Cia</p>
      <p>Loja Demo - Projeto Integrador Univesp</p>
    </footer>
  );
}