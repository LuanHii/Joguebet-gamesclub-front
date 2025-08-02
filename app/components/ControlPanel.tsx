"use client";

import { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlPanelProps {
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

export function ControlPanel({ items, onAddItem, onRemoveItem }: ControlPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const rawInput = inputValue.trim();
    if (!rawInput) return;
    const newItems = rawInput
      .split(/\s*,\s*/) 
      .map(item => item.trim())
      .filter(item => item && !items.includes(item));

    if (newItems.length > 0) {
      newItems.forEach(onAddItem);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">1. Adicionar Jogos</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nome do Jogo"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="w-full bg-slate-700 text-white font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors">
            Adicionar à Lista
          </button>
        </form>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-4">2. Lista do Sorteio ({items.length})</h2>
        <div className="flex-grow overflow-y-auto max-h-[250px] pr-2">
          {items.length === 0 ? (
            <div className="text-center text-slate-400 h-full flex items-center justify-center">
              <p>Adicione jogos para começar!</p>
            </div>
          ) : (
            <ul>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.li
                    layout
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    className="flex items-center justify-between bg-slate-900/70 rounded-lg mb-2 p-3 text-white"
                  >
                    <span className="font-medium">{item}</span>
                    <button onClick={() => onRemoveItem(index)} className="p-1 rounded-full text-slate-400 hover:text-red-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}