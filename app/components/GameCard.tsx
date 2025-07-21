"use client";

import { motion } from 'framer-motion';
import { Jogo } from '@/types'; // 1. IMPORTAMOS O TIPO JOGO DA PASTA TYPES (usando o atalho '@')

// 2. A INTERFACE AGORA ESTÁ ÚNICA E CORRETA
interface GameCardProps {
  jogo: Jogo;
  onEditClick: () => void; 
}

const getNotaColor = (nota: number) => {
  if (nota >= 8) return 'bg-green-500';
  if (nota >= 6) return 'bg-yellow-500';
  return 'bg-red-500';
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function GameCard({ jogo, onEditClick }: GameCardProps) {
  const notaNumerica = parseFloat(String(jogo.nota));
  const notaCor = getNotaColor(notaNumerica);

  return (
    <motion.article
      onClick={onEditClick} // Evento de clique está aqui
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold text-white mb-1">{jogo.nome}</h2>
          <p className="text-slate-400 capitalize">{jogo.genero}</p>
        </div>
        <div
          className={`flex-shrink-0 text-white text-2xl font-bold rounded-full flex items-center justify-center w-20 h-20 shadow-inner-lg ${notaCor}`}
        >
          {notaNumerica.toFixed(1)}
        </div>
      </div>
    </motion.article>
  );
}