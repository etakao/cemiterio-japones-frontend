import type { Tumulo } from '../interfaces/Tumulo';
import { getAllTumulos } from '../lib/api';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type TumuloContextType = {
  tumulos: Tumulo[];
  setTumulos: (tumulos: Tumulo[]) => void;
  tumulosEncontrados: Tumulo[];
  setTumulosEncontrados: (tumulos: Tumulo[]) => void;
  tumuloDetalhado: Tumulo | null | undefined;
  setTumuloDetalhado: (tumulo: Tumulo | null) => void;
  tumuloSelecionado: Tumulo | null | undefined;
  setTumuloSelecionado: (tumulo: Tumulo | null) => void;
  carregando: boolean;
};

const TumuloContext = createContext<TumuloContextType | undefined>(undefined);

export function TumuloProvider({ children }: { children: ReactNode }) {
  const [tumulos, setTumulos] = useState<Tumulo[]>([]);
  const [tumulosEncontrados, setTumulosEncontrados] = useState<Tumulo[]>([]);
  const [tumuloDetalhado, setTumuloDetalhado] = useState<Tumulo | null>();
  const [tumuloSelecionado, setTumuloSelecionado] = useState<Tumulo | null>();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchTumulos = async () => {
      const response = await getAllTumulos();
      if (!response) {
        throw new Error('Erro ao buscar túmulos');
      }
      setTumulos(response);

      setTimeout(() => {
        setCarregando(false);
      }, 2000);
    };
    fetchTumulos();
  }, []);

  return (
    <TumuloContext.Provider
      value={{
        tumulos,
        setTumulos,
        tumulosEncontrados,
        setTumulosEncontrados,
        tumuloDetalhado,
        setTumuloDetalhado,
        tumuloSelecionado,
        setTumuloSelecionado,
        carregando,
      }}
    >
      {children}
    </TumuloContext.Provider>
  );
}

export function useTumulo() {
  const context = useContext(TumuloContext);
  if (!context) {
    throw new Error('useTumuloContext must be used within a TumuloProvider');
  }
  return context;
}

