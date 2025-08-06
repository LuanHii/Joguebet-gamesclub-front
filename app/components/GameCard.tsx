"use client";

import { motion } from 'framer-motion';
import { Jogo } from '@/types';
import Image from 'next/image';

interface GameCardProps {
  jogo: Jogo;
  onEditClick: () => void;
  onDeleteClick: () => void;
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

export function GameCard({ jogo, onEditClick, onDeleteClick }: GameCardProps) {
  const notaNumerica = parseFloat(String(jogo.nota));
  const notaCor = getNotaColor(notaNumerica);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="relative bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6 overflow-hidden group"
    >
      <button
        onClick={(e) => handleActionClick(e, onEditClick)}
        aria-label="Editar jogo"
        className="absolute top-3 left-3 p-2 rounded-full text-slate-400 hover:bg-sky-500/20 hover:text-sky-400 transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </button>
      
      <button
        onClick={(e) => handleActionClick(e, onDeleteClick)}
        aria-label="Deletar jogo"
        className="absolute top-3 right-3 p-2 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      {jogo.imageUrl && (
        <div className="relative w-full h-40 mt-8 mb-4 rounded-lg overflow-hidden">
          <Image
            src={jogo.imageUrl}
            alt={`Imagem do jogo ${jogo.nome}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className={`flex justify-between items-start ${!jogo.imageUrl && 'pt-8'}`}>
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold text-white mb-1">{jogo.nome}</h2>
          <p className="text-slate-400 capitalize">{jogo.genero}</p>
        </div>
        <div className={`flex-shrink-0 text-white text-2xl font-bold rounded-full flex items-center justify-center w-20 h-20 shadow-inner-lg ${notaCor}`}>
          {notaNumerica.toFixed(1)}
        </div>
      </div>
    </motion.article>
  );
}