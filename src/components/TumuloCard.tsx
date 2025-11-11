import { Button } from '../components/ui/button';
import type { Tumulo } from '../interfaces/Tumulo';

export default function TumuloCard({
  tumulo,
  setTumuloSelecionado,
}: {
  tumulo: Tumulo;
  setTumuloSelecionado: (tumulo: Tumulo | null) => void;
}) {
  return (
    <div className='w-full'>
      <p className='m-1'>
        Fileira: {tumulo.fileira} | Posição: {tumulo.posicao}
      </p>

      <img
        src={tumulo.fotoUrl ? tumulo.fotoUrl : 'foto-placeholder.jpg'}
        alt={`Foto de ${tumulo.nome}`}
        className='w-4/5 h-auto aspect-square object-cover mx-auto mb-2 rounded-lg'
      />

      <p className='m-1'>
        <strong>Nome:</strong> {tumulo.nome}{' '}
        {tumulo.kanji && <em>({tumulo.kanji})</em>}
      </p>

      <p className='m-1'>
        <strong>Data de Nascimento:</strong> {tumulo.dataNascimento}
      </p>

      <p className='m-1'>
        <strong>Data de Falecimento:</strong> {tumulo.dataFalecimento}
      </p>

      <p className='m-1'>
        <strong>Local de Origem:</strong> {tumulo.localOrigem}
      </p>

      <p className='m-1'>
        <strong>Parente:</strong> {tumulo.nomeParente}
      </p>

      <Button
        onClick={() => setTumuloSelecionado(tumulo)}
        className='mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer'
      >
        Ir
      </Button>
    </div>
  );
}

