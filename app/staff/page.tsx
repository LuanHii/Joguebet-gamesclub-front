"use client";

import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Membro } from '@/types';

export default function StaffPage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const fetchMembros = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros');
      const data = await res.json();
      const parsedData: Membro[] = typeof data === 'string' ? JSON.parse(data) : data;
      setMembros(parsedData || []);
    } catch (err) {
      console.error("Erro ao buscar membros:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  const handleOpenModal = (membro?: Membro) => {
    if (membro) {
      setEditingMembro(membro);
      setNome(membro.nome);
      setDescricao(membro.descricao || '');
      setImagemPreview(membro.imageUrl || null);
    } else {
      setEditingMembro(null);
      setNome('');
      setDescricao('');
      setImagemPreview(null);
    }
    setImagem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = editingMembro?.imageUrl || null;

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

      const payload = {
        nome,
        descricao,
        imageUrl: finalImageUrl
      };

      let res;
      if (editingMembro) {
        // Update
        res = await fetch(`https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros/${editingMembro.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create
        res = await fetch('https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Erro ao salvar membro");

      fetchMembros();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Ocorreu um erro ao salvar o membro.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da Joguebet?')) return;

    try {
      const res = await fetch(`https://6u1nmldbfg.execute-api.us-east-2.amazonaws.com/dev/membros/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Erro ao deletar");

      setMembros(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Erro:", err);
      alert("Não foi possível remover o membro.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 font-sans">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold custom-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] mt-3">
            Nossos Participantes
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 md:mt-0 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-900/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Adicionar Membro
          </button>
        </header>

        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Carregando os verdadeiros gamers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {membros.map((participante) => (
              <div
                key={participante.id}
                className="group relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300"
              >
                {/* Ações Hover */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(participante)} className="p-2 bg-slate-900/80 rounded-full text-slate-300 hover:text-sky-400 transition-colors" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(participante.id)} className="p-2 bg-slate-900/80 rounded-full text-slate-300 hover:text-red-400 transition-colors" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>

                <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden border-4 custom-border bg-slate-800 flex items-center justify-center">
                  {participante.imageUrl ? (
                    <Image
                      src={participante.imageUrl}
                      alt={`Foto de ${participante.nome}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="128px"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-slate-500">{participante.nome.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{participante.nome}</h2>
                <p className="text-slate-300 italic">
                  {participante.descricao || "Sem descrição registrada."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                  <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white mb-6">
                    {editingMembro ? 'Editar Membro' : 'Novo Membro'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                      <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Ex: Piter" />
                    </div>

                    <div>
                      <label htmlFor="descricao" className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
                      <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 outline-none resize-none" placeholder="Uma breve descrição sobre a lenda..." />
                    </div>

                    <div>
                      <label htmlFor="imagem" className="block text-sm font-medium text-slate-300 mb-1">Foto de Perfil</label>
                      {imagemPreview && (
                        <div className="mt-2 mb-4 w-24 h-24 relative rounded-full overflow-hidden border-2 border-slate-600 mx-auto">
                          <Image src={imagemPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                        </div>
                      )}
                      <input id="imagem" type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200" />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-700">
                      <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancelar</button>
                      <button type="submit" disabled={isSaving} className="px-6 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:bg-slate-600 transition-colors flex items-center gap-2">
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
