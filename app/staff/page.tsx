"use client";

import React from 'react';

const participantes = [
  {
    nome: 'Luan',
    descricao: 'Maior admirador do Davi Britto, um dos pais fundadores da joguebet.',
    imageUrl: '/imagens/Luan.jpg'
  },
  {
    nome: 'Karen',
    descricao: '"Linda, perfeita, maravilhosa" - Luan ... Palavras dele, mas e as do resto do grupo??',
    imageUrl: '/imagens/karen.jpg'
  },
  {
    nome: 'Peco',
    descricao: 'Dono dos melhores rages contra o Luan, eventualmente vou pensar em algo melhor pra por aqui.',
    imageUrl: '/imagens/Peco.jpg'
  },
  {
    nome: 'Leonardo',
    descricao: 'Criador das melhores personalidades para todos os jogos, um dos gays fundadores da joguebet.',
    imageUrl: '/imagens/Leonardo.jpeg'
  },
  {
    nome: 'Duda',
    descricao: 'Maior entusiasta das partidas noturnas (quando esta presente).',
    imageUrl: '/imagens/duda.jpg'
  },
  {
    nome: 'Piter',
    descricao: 'Apenas um cara tranquilo, com uma vida tranquila e pensamentos tranquilos.',
    imageUrl: '/imagens/Piter.jpg'
  }
];

export default function App() {
  return (
    // Container principal que centraliza o conteúdo verticalmente e adiciona um fundo escuro.
    <div className="flex justify-center min-h-screen p-8 font-sans">
      <div className="w-full max-w-6xl">
        {/* Título principal com gradiente de cor. */}
        <h1 className="text-4xl sm:text-5xl font-extrabold custom-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] mt-3 mb-4 text-center">
          Nossos Participantes
        </h1>
        <br />

        {/* Grade de cartões de participantes. Usa um layout de grade responsivo. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapeia o array de participantes para renderizar um cartão para cada pessoa. */}
          {participantes.map((participante, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300"
            >
              {/* Imagem do perfil com borda e formato circular. */}
              <img
                src={participante.imageUrl}
                alt={`Foto de ${participante.nome}`}
                className="w-32 h-32 rounded-full object-cover border-4 custom-border mb-4"
              />

              {/* Nome do participante. */}
              <h2 className="text-2xl font-bold text-white mb-2">{participante.nome}</h2>

              {/* Descrição do participante. */}
              <p className="text-slate-300">{participante.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
