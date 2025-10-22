import type {
  Tumulo,
  TumuloListResponse,
  TumuloResponse,
} from '@/interfaces/Tumulo';

const API_URL = import.meta.env.REACT_APP_API_URL
  ? `${import.meta.env.REACT_APP_API_URL}/tumulos`
  : 'http://localhost:3000/tumulos';

export async function getAllTumulos(): Promise<Tumulo[]> {
  const res = await fetch(`${API_URL}/all`);
  console.log(res);

  if (!res.ok) {
    throw new Error('Erro ao buscar túmulos');
  }
  const response: TumuloListResponse = await res.json();

  if (!response.success) {
    throw new Error('Erro ao buscar túmulos');
  }

  return response.data;
}

export async function getTumuloPorQuery(name: string): Promise<Tumulo[]> {
  const res = await fetch(`${API_URL}?nome=${name}`);
  if (!res.ok) {
    throw new Error('Erro ao buscar túmulos');
  }
  const response: TumuloListResponse = await res.json();

  if (!response.success) {
    throw new Error('Erro ao buscar túmulos');
  }

  return response.data;
}

export async function getTumuloById(id: number): Promise<Tumulo | null> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error('Erro ao buscar túmulo');
  }
  const response: TumuloResponse = await res.json();

  if (!response.success) {
    throw new Error(response.message || 'Erro ao buscar túmulo');
  }

  return response.data;
}

