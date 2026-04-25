"use client";
import { useState, useEffect, FormEvent, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Jogo, NotaIndividual } from '@/types';
import { AWARD_ICONS } from './GameCard';
import { Membro } from '@/types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jogo: Jogo | null;
  onUpdate: () => void;
}

const calcularMediaLocal = (notas: Record<string, NotaIndividual>): number => {
  const valores = Object.values(notas)
    .map(n => n.valor)
    .filter(v => !isNaN(v) && v > 0);
  if (valores.length === 0) return 0;
  return parseFloat((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2));
};

export function UpdateModal({ isOpen, onClose, jogo, onUpdate }: UpdateModalProps) {
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState('');
  const [genero, setGenero] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [premiosSelecionados, setPremiosSelecionados] = useState<string[]>([]);
  const [anoPremio, setAnoPremio] = useState<number>(new Date().getFullYear());
  const [dataSorteio, setDataSorteio] = useState('');
  const [notasIndividuais, setNotasIndividuais] = useState<Record<string, NotaIndividual>>({});
  const [membrosDisponiveis, setMembrosDisponiveis] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros')
      .then(res => res.json())
      .then(data => {
        const parsedData: Membro[] = typeof data === 'string' ? JSON.parse(data) : data;
        setMembrosDisponiveis(parsedData.map(m => m.nome));
      })
      .catch(err => console.error("Erro ao buscar membros:", err));
  }, []);

  useEffect(() => {
    if (jogo) {
      setNome(jogo.nome);
      setNota(String(jogo.nota));
      setGenero(jogo.genero);
      setImagemPreview(jogo.imageUrl || null);
      setDataSorteio(jogo.dataSorteio || '');
      
      const initialPremios = jogo.premios || [];
      const categories = initialPremios.map(p => p.replace(/\s\d{4}$/, ''));
      const anoMatch = initialPremios.length > 0 ? initialPremios[0].match(/\d{4}$/) : null;
      
      setPremiosSelecionados(categories);
      setAnoPremio(anoMatch ? parseInt(anoMatch[0]) : new Date().getFullYear());
      
      if (jogo.notasIndividuais) {
        setNotasIndividuais({ ...jogo.notasIndividuais });
      } else {
        setNotasIndividuais({});
      }

      setError(null);
      setImagem(null);
    }
  }, [jogo]);

  const handleNotaChange = (membro: string, valor: string) => {
    const numVal = parseFloat(valor);
    setNotasIndividuais(prev => {
      const updated = { ...prev };
      if (valor === '' || isNaN(numVal)) {
        delete updated[membro];
      } else {
        updated[membro] = { valor: numVal, comentario: prev[membro]?.comentario || '' };
      }
      return updated;
    });
  };

  const handleComentarioChange = (membro: string, comentario: string) => {
    setNotasIndividuais(prev => {
      if (!prev[membro]) return prev;
      return { ...prev, [membro]: { ...prev[membro], comentario } };
    });
  };

  const temNotasIndividuais = Object.keys(notasIndividuais).length > 0;
  const mediaPreview = temNotasIndividuais ? calcularMediaLocal(notasIndividuais) : parseFloat(nota) || 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!jogo) return;
    setIsLoading(true);
    setError(null);

    try {
      let finalImageUrl = jogo.imageUrl || null;

      if (imagem) {
        const presignedUrlResponse = await fetch(
          'https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/presigned-url',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: imagem.name, fileType: imagem.type }),
          }
        );
        const { uploadUrl, fileUrl } = await presignedUrlResponse.json();
        
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imagem.type },
          body: imagem,
        });
        
        finalImageUrl = fileUrl;
      }

      const dadosParaAtualizar: Record<string, unknown> = {
        nome,
        nota: temNotasIndividuais ? mediaPreview : parseFloat(nota),
        genero,
        imageUrl: finalImageUrl,
        premios: premiosSelecionados.map(p => `${p} ${anoPremio}`),
        notasIndividuais: temNotasIndividuais ? notasIndividuais : null,
        dataSorteio: dataSorteio || null,
      };

      const response = await fetch(
        `https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/jogos/${jogo.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosParaAtualizar),
        }
      );
      if (!response.ok) throw new Error('Falha ao atualizar o jogo.');
      
      onUpdate();
      onClose();
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                  Editar Jogo: {jogo?.nome}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="edit-nome" className="text-sm text-slate-400">Nome</label>
                    <input id="edit-nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 mt-1 text-white" />
                  </div>
                  <div>
                    <label htmlFor="edit-genero" className="text-sm text-slate-400">Gênero</label>
                    <input id="edit-genero" type="text" value={genero} onChange={(e) => setGenero(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 mt-1 text-white" />
                  </div>

                  <div>
                    <label htmlFor="edit-dataSorteio" className="text-sm text-slate-400">Data do Sorteio</label>
                    <input
                      id="edit-dataSorteio"
                      type="date"
                      value={dataSorteio}
                      onChange={(e) => setDataSorteio(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 mt-1 text-white [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-slate-400">Notas Individuais</label>
                      {temNotasIndividuais && (
                        <span className="text-xs text-sky-400 font-semibold">
                          Média: {mediaPreview.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 bg-slate-900 p-3 border border-slate-700 rounded-md">
                      {membrosDisponiveis.map(membro => (
                        <div key={membro} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300 w-14 flex-shrink-0">{membro}</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              placeholder="—"
                              value={notasIndividuais[membro]?.valor ?? ''}
                              onChange={(e) => handleNotaChange(membro, e.target.value)}
                              className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                            <input
                              type="text"
                              placeholder="Comentário..."
                              value={notasIndividuais[membro]?.comentario ?? ''}
                              onChange={(e) => handleComentarioChange(membro, e.target.value)}
                              className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-nota" className="text-sm text-slate-400">
                      Nota {temNotasIndividuais ? '(calculada automaticamente)' : '(manual)'}
                    </label>
                    <input
                      id="edit-nota"
                      type="number"
                      value={temNotasIndividuais ? mediaPreview.toFixed(2) : nota}
                      onChange={(e) => setNota(e.target.value)}
                      required
                      step="0.01"
                      readOnly={temNotasIndividuais}
                      className={`w-full bg-slate-900 border border-slate-700 rounded-md p-2 mt-1 text-white ${temNotasIndividuais ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mt-1 mb-2">
                      <label className="text-sm text-slate-400">Prêmios / Troféus</label>
                      <div className="flex items-center gap-2">
                        <label htmlFor="edit-anoPremio" className="text-xs text-slate-400">Ano:</label>
                        <input 
                          type="number" 
                          id="edit-anoPremio"
                          value={anoPremio} 
                          onChange={(e) => setAnoPremio(parseInt(e.target.value) || new Date().getFullYear())}
                          className="w-20 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 border border-slate-700 rounded-md">
                      {Object.entries(AWARD_ICONS).map(([premio, icone]) => (
                        <label key={premio} className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-amber-400 transition-colors">
                          <input
                            type="checkbox"
                            className="form-checkbox h-3.5 w-3.5 text-amber-500 rounded border-slate-600 bg-slate-800 focus:ring-amber-500 focus:ring-offset-slate-900"
                            checked={premiosSelecionados.includes(premio)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPremiosSelecionados(prev => [...prev, premio]);
                              } else {
                                setPremiosSelecionados(prev => prev.filter(p => p !== premio));
                              }
                            }}
                          />
                          <span className="text-sm select-none">
                            {icone} {premio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-imagem" className="text-sm text-slate-400">Imagem</label>
                    {imagemPreview && (
                        <div className="mt-2 w-full h-40 relative rounded-lg overflow-hidden">
                            <Image src={imagemPreview} alt="Preview da imagem" fill style={{ objectFit: 'cover' }} />
                        </div>
                    )}
                    <input id="edit-imagem" type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 mt-2" />
                  </div>
                  
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-700 rounded-md">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md disabled:bg-slate-500">
                      {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}