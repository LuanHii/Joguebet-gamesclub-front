export interface NotaIndividual {
  valor: number;
  comentario?: string;
}

export interface Membro {
  id: string;
  nome: string;
  ordem?: number;
  descricao?: string;
  imageUrl?: string | null;
}

export interface Jogo {
  id: string;
  nome: string;
  nota: number | string;
  genero: string;
  imageUrl?: string;
  premios?: string[];
  dataSorteio?: string;
  notasIndividuais?: Record<string, NotaIndividual>;
}