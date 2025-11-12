import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useTumulo } from '../context/TumuloContext.';

export default function CenterLocation() {
  const map = useMap();
  const { carregando } = useTumulo();
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    if (carregando) return;

    map.locate({
      setView: false,
      maxZoom: 22,
    });

    map.on('locationfound', (e) => {
      setUserPosition(e.latlng);
    });

    map.on('locationerror', () => {
      alert('Não foi possível obter sua localização.');
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map, carregando]);

  const travelToUserLocation = () => {
    if (userPosition) {
      map.flyTo(userPosition, 22, {
        animate: true,
        duration: 2,
      });
    }
  };

  return (
    <button
      onClick={travelToUserLocation}
      className='absolute bottom-6 right-6 cursor-pointer z-[9999] bg-white p-1 rounded-lg'
    >
      <img
        src='/center.svg'
        alt='Center'
        className='w-6 h-6 md:w-8 md:h-8'
      />
    </button>
  );
}

