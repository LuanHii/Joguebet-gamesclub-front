"use client";

import React from 'react';

const participantes = [
  {
    nome: 'Luan',
    descricao: 'Desenvolvedor Fullstack, apaixonado em programar e viciado em videogames.',
    imageUrl: '/imagens/Luan.jpg'
  },
  {
    nome: 'Karen',
    descricao: 'Desenvolvedora nata, hello kitty de academia e desenhista nas horas vagas.',
    imageUrl: '/imagens/Karen.jpg'
  },
  {
    nome: 'Peco',
    descricao: 'Designer, desenvolvedor e apreciador de álcool.',
    imageUrl: '/imagens/Peco.jpg'
  },
  {
    nome: 'Leonardo',
    descricao: 'Desenvolvedor C#, amante do caos e da confusão.',
    imageUrl: '/imagens/Leonardo.jpeg'
  },
  {
    nome: 'Duda',
    descricao: 'Desenvolvedora astuta e Gerente das jogartinas noturnas.',
    imageUrl: '/imagens/duda.jpg'
  },
  {
    nome: 'Piter',
    descricao: 'Desenvolvedor, designer e apenas um cara tranquilo.',
    imageUrl: '/imagens/Piter.jpg'
  }
];

export default function App() {
  return (
    // Container principal que centraliza o conteúdo verticalmente e adiciona um fundo escuro.
     <div className="flex items-center justify-center min-h-screen p-8 bg-gray-900 text-white font-sans bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-6xl">
        {/* Título principal com gradiente de cor. */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          Nossos Participantes
        </h1>
        
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
                className="w-32 h-32 rounded-full object-cover border-4 border-sky-500 mb-4"
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
