"use client";

import { motion, AnimatePresence } from 'framer-motion';

interface PoolListProps {
  items: string[];
  onRemove: (index: number) => void;
}

export function PoolList({ items, onRemove }: PoolListProps) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 h-full">
      <h2 className="text-2xl font-bold text-white mb-4">
        Itens no Sorteio ({items.length})
      </h2>
      <div className="max-h-80 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            <p>A lista está vazia.</p>
            <p className="text-sm">Adicione itens para começar o sorteio.</p>
          </div>
        ) : (
          <ul>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.li
                  layout
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex items-center justify-between bg-slate-900/70 rounded-lg mb-2 p-3 text-white"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => onRemove(index)}
                    aria-label={`Remover ${item}`}
                    className="p-1 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}