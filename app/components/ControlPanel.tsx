"use client";

import { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Adicionamos a nova propriedade 'onClearItems' à interface
interface ControlPanelProps {
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
  onClearItems: () => void; // Nova função para limpar a lista
  onAddCategory: (category: string) => void;
  categories: string[];
}

// 2. Recebemos a nova função como prop
export function ControlPanel({ items, onAddItem, onRemoveItem, onClearItems, onAddCategory, categories }: ControlPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const rawInput = inputValue.trim();
    if (!rawInput) return;
    const newItems = rawInput
      .split(/\s*[,|\n]\s*/)
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
        <h2 className="text-2xl font-bold text-white mb-4">1. Adicionar Itens</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: Jogo A, Jogo B, Jogo C"
            rows={4}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <p className="text-xs text-slate-400 -mt-2">Você pode adicionar vários itens separados por vírgula ou quebra de linha.</p>
          <button type="submit" className="w-full bg-slate-700 text-white font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors">
            Adicionar à Lista
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Gênero
            {showCategories ? <span>&#9650;</span> : <span>&#9660;</span>}
          </button>
          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}

                className="overflow-y-auto max-h-60 pr-2 mt-2 space-y-2"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onAddCategory(category)}
                    className="w-full text-left px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors text-slate-200 capitalize"
                  >
                    {category.replace('_', ' ')}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">2. Lista ({items.length})</h2>
          <AnimatePresence>
            {items.length > 0 && (
              <motion.button
                onClick={onClearItems}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="text-sm bg-red-800/50 text-red-200 px-3 py-1 rounded-md hover:bg-red-800/80 transition-colors"
              >
                Limpar Lista
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-grow overflow-y-auto max-h-[300px] pr-2">
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