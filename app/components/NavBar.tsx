import Link from "next/link";
import ThemeToggle from "./ThemeToggle"

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Joguebet</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Já Jogados</Link>
          <Link href="/adicionar" className="transition-colors hover:text-foreground/80 text-foreground">Adicionar Jogo</Link>
          <Link href="/sortear" className="transition-colors hover:text-foreground/80 text-foreground">Sortear Jogo</Link>
          <Link href="/staff" className="transition-colors hover:text-foreground/80 text-foreground">Staff</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}