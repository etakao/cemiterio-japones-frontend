import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import {
  X,
  Calendar,
  MapPin,
  Book,
  User,
  Phone,
  Home,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import type { Tumulo } from '../interfaces/Tumulo';

export default function TumuloCard({
  tombstone,
  onClose,
}: {
  tombstone: Tumulo;
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`w-80 shadow-xl border-2 transition-all duration-300 ${
        isExpanded ? 'max-h-96' : 'max-h-none'
      }`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='font-bold text-lg text-gray-900'>
              {tombstone.nome}
            </h3>
            {tombstone.kanji && (
              <p className='text-lg text-gray-600 mt-1'>{tombstone.kanji}</p>
            )}
            <div className='flex items-center gap-2 mt-2'>
              <Badge>Localização</Badge>
              <span className='text-sm text-gray-500'>
                Fileira {tombstone.fileira} - Posição {tombstone.posicao}
              </span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='h-8 w-8'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-3 ${isExpanded ? 'overflow-y-auto max-h-64' : ''}`}
      >
        {/* ... o restante igual ao seu card ... */}
        {/* No final: */}
        <Separator />
        <Button
          variant='ghost'
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full justify-center gap-2'
        >
          {isExpanded ? (
            <>
              <ChevronUp className='h-4 w-4' />
              Menos informações
            </>
          ) : (
            <>
              <ChevronDown className='h-4 w-4' />
              Ver mais informações
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

