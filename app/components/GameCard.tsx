"use client";

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Jogo } from '@/types';
import Image from 'next/image';

interface GameCardProps {
  jogo: Jogo;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const getNotaColorClasses = (nota: number) => {
  if (nota >= 8) return { base: 'text-green-400', glow: 'shadow-green-500/50' };
  if (nota >= 6) return { base: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
  return { base: 'text-red-400', glow: 'shadow-red-500/50' };
};

const ScoreRing = ({ nota }: { nota: number }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (nota / 10) * circumference;
  const { base } = getNotaColorClasses(nota);

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
      <circle
        cx="40"
        cy="40"
        r={radius}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="6"
        fill="transparent"
      />
      <motion.circle
        cx="40"
        cy="40"
        r={radius}
        className={base}
        stroke="currentColor"
        strokeWidth="6"
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
};


export function GameCard({ jogo, onEditClick, onDeleteClick }: GameCardProps) {
  const notaNumerica = parseFloat(String(jogo.nota));
  const { base, glow } = getNotaColorClasses(notaNumerica);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover="hover"
      className="relative bg-slate-900 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden group aspect-[3/4]"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px at ${x}px ${y}px, rgba(14, 165, 233, 0.15), transparent 80%)`
          ),
        }}
      />

      {jogo.imageUrl && (
        <div className="absolute inset-0">
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

      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <motion.div variants={{ hidden: { opacity: 0 }, hover: { opacity: 1 } }} className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => handleActionClick(e, onEditClick)}
              aria-label="Editar jogo"
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-slate-300 hover:text-sky-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
            </button>
            <button
              onClick={(e) => handleActionClick(e, onDeleteClick)}
              aria-label="Deletar jogo"
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-slate-300 hover:text-red-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
            </button>
        </motion.div>
        
        <div className="flex justify-between items-end">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{jogo.nome}</h2>
            <p className="text-slate-300 capitalize drop-shadow-lg">{jogo.genero}</p>
          </div>
          <div className="relative flex-shrink-0">
            <ScoreRing nota={notaNumerica} />
            <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${base} drop-shadow-lg ${glow}`}>
              {notaNumerica.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}