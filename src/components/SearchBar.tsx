import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getTumuloPorQuery } from '../lib/api';
import { useTumulo } from '../context/TumuloContext.';
import type { Tumulo } from '../interfaces/Tumulo';

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<Tumulo[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { tumuloDetalhado, setTumuloDetalhado } = useTumulo();

  async function fetchFilteredResults(query: string) {
    if (query.length === 0) {
      return [];
    }

    try {
      const results = await getTumuloPorQuery(query);
      return results;
    } catch (error) {
      console.error('Erro ao buscar túmulos:', error);
      return [];
    }
  }

  // Filtrar resultados baseado no termo de busca
  useEffect(() => {
    if (searchTerm == tumuloDetalhado?.nome) return;

    if (searchTerm.length < 2) {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    fetchFilteredResults(searchTerm).then((results) => {
      setFilteredResults(results);
      setShowResults(results.length > 0);
    });
  }, [searchTerm]);

  // Focar no input quando expandir
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowResults(false);
    setSearchTerm('');
  };

  const handleSelectResult = (tumulo: Tumulo) => {
    setSearchTerm(tumulo.nome || '');
    setShowResults(false);
    setIsExpanded(false);
    setTumuloDetalhado(tumulo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCollapse();
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative'
    >
      <div
        className={`
          flex items-center bg-white border border-gray-300 rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-80' : 'w-12 h-12'}
        `}
      >
        {!isExpanded ? (
          <Button
            variant='ghost'
            size='icon'
            onClick={handleExpand}
            className='w-12 h-12 rounded-full hover:bg-gray-100'
          >
            <Search className='h-5 w-5 text-gray-600' />
            <span className='sr-only'>Buscar túmulo</span>
          </Button>
        ) : (
          <>
            <div className='flex-1 px-4 py-2'>
              <Input
                ref={inputRef}
                type='text'
                placeholder='Buscar por nome...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8'
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCollapse}
              className='w-10 h-10 rounded-full hover:bg-gray-100 mr-1'
            >
              <X className='h-4 w-4 text-gray-600' />
              <span className='sr-only'>Fechar busca</span>
            </Button>
          </>
        )}
      </div>

      {/* Resultados da busca */}
      {showResults && filteredResults.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
          {filteredResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className='w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors'
            >
              <div className='font-medium text-gray-900'>
                {result.nome}{' '}
                {result.kanji && (
                  <span className='text-gray-500'>- {result.kanji}</span>
                )}
              </div>
              <div className='text-sm text-gray-500'>
                Fileira: {result.fileira} | Posição: {result.posicao}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {showResults && filteredResults.length === 0 && searchTerm.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500'>
          Nenhum túmulo encontrado para {searchTerm}
        </div>
      )}
    </div>
  );
}

