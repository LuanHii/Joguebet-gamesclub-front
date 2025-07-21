"use client";

import { useState, FormEvent } from 'react';

export default function AdicionarJogoPage() {
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState('');
  const [genero, setGenero] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const notaFinal = nota.trim() === '' ? 0 : parseFloat(nota);
    
    const dadosDoJogo = {
      nome,
      nota: notaFinal,
      genero,
    };

    try {
      const response = await fetch(
        'https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/jogos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosDoJogo),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao adicionar o jogo. Verifique os dados e tente novamente.');
      }

      setSuccess('Jogo adicionado com sucesso!');
      setNome('');
      setNota('');
      setGenero('');

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ocorreu um erro desconhecido.');
          }
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Adicionar Novo Jogo
          </h1>

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
              Nome do Jogo
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ex: Elden Ring"
            />
          </div>

          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-slate-300 mb-2">
              Gênero
            </label>
            <input
              type="text"
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ex: RPG de Ação"
            />
          </div>

          <div>
            <label htmlFor="nota" className="block text-sm font-medium text-slate-300 mb-2">
              Nota (0-10)
            </label>
            <input
              type="number"
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              step="0.1"
              min="0"
              max="10"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Deixe em branco para nota 0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adicionando...
              </>
            ) : (
              'Adicionar Jogo'
            )}
          </button>

          {success && <p className="text-green-400 text-center">{success}</p>}
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}