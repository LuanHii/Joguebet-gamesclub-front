"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex max-w-screen-2xl items-center justify-between p-4 md:h-14">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Joguebet</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav
            className={`
              ${isMenuOpen ? 'flex' : 'hidden'} 
              absolute top-full left-0 w-full flex-col items-center gap-6 border-b border-border/40 bg-background/95 py-4 
              md:static md:flex md:w-auto md:flex-row md:items-center md:border-none md:py-0 md:gap-6
            `}
          >
            <Link href="/" className="transition-colors hover:text-foreground/80" onClick={handleLinkClick}>
              Já avaliados
            </Link>
            <Link href="/adicionar" className="transition-colors hover:text-foreground/80" onClick={handleLinkClick}>
              Adicionar Jogo
            </Link>
            <Link href="/sortear" className="transition-colors hover:text-foreground/80" onClick={handleLinkClick}>
              Sortear Jogo
            </Link>
            <Link href="/staff" className="transition-colors hover:text-foreground/80" onClick={handleLinkClick}>
              Membros / Staff
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://drive.google.com/drive/folders/1cVjNYSErLQYRW8Kco2_Dj7vQw4tEHWSS?hl=pt-br" target="_blank">
              <img src="imagens/icone.png" className="h-6 w-6" alt="Ícone Drive" />
            </a>
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}