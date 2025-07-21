"use client"; 

import { useState, useEffect } from 'react';
import { GameCard } from './components/GameCard';
import { SkeletonCard } from './components/SkeletonCard';
import { UpdateModal } from './components/UpdateModal';
import { Jogo } from '@/types';

export default function HomePage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Jogo | null>(null);

  const fetchJogos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/jogos'); 
      const data = await res.json();
      
      console.log("DADO RECEBIDO:", data);
      console.log("TIPO DO DADO:", typeof data); 
  
      const jogosArray = typeof data === 'string' ? JSON.parse(data) : data;
  
      setJogos(jogosArray || []);
  
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      setJogos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJogos();
  }, []);

  const handleEditClick = (jogo: Jogo) => {
    setSelectedGame(jogo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleUpdateSuccess = () => {
    fetchJogos(); 
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="text-center my-10 md:my-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
          Galeria de Jogos
        </h1>
      </header>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jogos.map((jogo) => (
            <GameCard key={jogo.id} jogo={jogo} onEditClick={() => handleEditClick(jogo)} />
          ))}
        </div>
      )}
      
      <UpdateModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        jogo={selectedGame}
        onUpdate={handleUpdateSuccess}
      />
    </div>
  );
}