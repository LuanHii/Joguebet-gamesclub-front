"use client";
import { useState, useEffect, FormEvent, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';

interface Jogo {
  id: string;
  nome: string;
  nota: number | string;
  genero: string;
  imageUrl?: string;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jogo: Jogo | null;
  onUpdate: () => void;
}

export function UpdateModal({ isOpen, onClose, jogo, onUpdate }: UpdateModalProps) {
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState('');
  const [genero, setGenero] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jogo) {
      setNome(jogo.nome);
      setNota(String(jogo.nota));
      setGenero(jogo.genero);
      setImagemPreview(jogo.imageUrl || null);
      setError(null);
      setImagem(null);
    }
  }, [jogo]);

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

      const dadosParaAtualizar = {
        nome,
        nota: parseFloat(nota),
        genero,
        imageUrl: finalImageUrl,
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
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
                    <label htmlFor="edit-nota" className="text-sm text-slate-400">Nota</label>
                    <input id="edit-nota" type="number" value={nota} onChange={(e) => setNota(e.target.value)} required step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 mt-1 text-white" />
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