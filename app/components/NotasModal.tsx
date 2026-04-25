"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Jogo, Membro } from '@/types';
import { useState, useEffect } from 'react';

interface NotasModalProps {
  isOpen: boolean;
  onClose: () => void;
  jogo: Jogo | null;
}

const getNotaColor = (nota: number) => {
  if (nota >= 8) return 'text-green-400';
  if (nota >= 6) return 'text-yellow-400';
  return 'text-red-400';
};

const getNotaBg = (nota: number) => {
  if (nota >= 8) return 'from-green-500/20 to-green-500/5 border-green-500/30';
  if (nota >= 6) return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
  return 'from-red-500/20 to-red-500/5 border-red-500/30';
};

const MiniScoreRing = ({ nota }: { nota: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (nota / 10) * circumference;
  const colorClass = getNotaColor(nota);

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle
        cx="24"
        cy="24"
        r={radius}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="3"
        fill="transparent"
      />
      <motion.circle
        cx="24"
        cy="24"
        r={radius}
        className={colorClass}
        stroke="currentColor"
        strokeWidth="3"
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
};

export function NotasModal({ isOpen, onClose, jogo }: NotasModalProps) {
  const [membrosDisponiveis, setMembrosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros')
      .then(res => res.json())
      .then(data => {
        const parsedData: Membro[] = typeof data === 'string' ? JSON.parse(data) : data;
        setMembrosDisponiveis(parsedData.map(m => m.nome));
      })
      .catch(err => console.error("Erro ao buscar membros:", err));
  }, []);

  if (!jogo) return null;

  const notasIndividuais = jogo.notasIndividuais || {};
  const membrosComNota = membrosDisponiveis.filter(m => notasIndividuais[m]);
  const membrosSemNota = membrosDisponiveis.filter(m => !notasIndividuais[m]);
  const mediaFinal = parseFloat(String(jogo.nota));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-6 shadow-2xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-bold text-white">
                      {jogo.nome}
                    </Dialog.Title>
                    <p className="text-sm text-slate-400 capitalize mt-1">{jogo.genero}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                      <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                      <motion.circle
                        cx="32" cy="32" r="24"
                        className={getNotaColor(mediaFinal)}
                        stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 24}
                        initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                        animate={{ strokeDashoffset: (2 * Math.PI * 24) - (mediaFinal / 10) * (2 * Math.PI * 24) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${getNotaColor(mediaFinal)}`}>
                      {mediaFinal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {jogo.dataSorteio && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 flex items-center gap-2">
                    <span className="text-slate-400 text-sm">📅</span>
                    <span className="text-slate-300 text-sm">
                      Sorteado em {new Date(jogo.dataSorteio + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}

                {membrosComNota.length > 0 ? (
                  <div className="space-y-2">
                    {membrosComNota.map((membro, index) => {
                      const notaData = notasIndividuais[membro];
                      const valor = notaData.valor;
                      return (
                        <motion.div
                          key={membro}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${getNotaBg(valor)} border backdrop-blur-sm`}
                        >
                          <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            <MiniScoreRing nota={valor} />
                            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getNotaColor(valor)}`}>
                              {valor.toFixed(1)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{membro}</p>
                            {notaData.comentario && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate italic">
                                &quot;{notaData.comentario}&quot;
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                    {membrosSemNota.length > 0 && (
                      <div className="pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500">
                          Sem nota: {membrosSemNota.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">Nenhuma nota individual registrada.</p>
                    <p className="text-slate-500 text-xs mt-1">Nota geral: {mediaFinal.toFixed(2)}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
