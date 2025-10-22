export interface Tumulo {
  id: number;
  fotoUrl?: string;
  ordemNb?: string;
  nome?: string;
  kanji?: string;
  idade?: number;
  dataNascimento?: string;
  dataFalecimento?: string;
  localOrigem?: string;
  nomeParente?: string;
  grauParentesco?: string;
  parenteKanji?: string;
  genero?: string;
  codLivro?: string;
  livro?: string;
  ordem?: string;
  fileira?: number;
  posicao?: number;
  geom: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

// Interface para resposta genérica da API
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

// Interface para resposta de lista paginada
export interface TumuloListResponse {
  success: boolean;
  data: Tumulo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para resposta de um único túmulo
export interface TumuloResponse {
  success: boolean;
  data: Tumulo | null;
  message?: string;
}

