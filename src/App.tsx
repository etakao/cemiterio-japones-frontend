import { SearchBar } from './components/SearchBar';
import Mapa from './components/Mapa';
import { useTumulo } from './context/TumuloContext.';

function App() {
  const { carregando } = useTumulo();

  return (
    <div className='relative flex w-screen h-dvh'>
      {carregando && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-lg'>
          <img
            src='/aceam.png'
            alt='Carregando'
            className='w-48 h-48 animate-pulse'
          />
        </div>
      )}

      <Mapa />

      <div className='fixed top-6 right-6 z-40'>
        <SearchBar />
      </div>
    </div>
  );
}

export default App;

