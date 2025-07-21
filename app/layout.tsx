import type { Metadata } from 'next';
import { NavBar } from './components/NavBar';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lista de Jogos',
  description: 'Uma lista de jogos com design moderno e animações.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="antialiased">
      <body className={inter.className}>
      <NavBar></NavBar>
      <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}