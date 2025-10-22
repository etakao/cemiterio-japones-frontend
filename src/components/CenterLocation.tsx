import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

export default function CenterLocation() {
  const map = useMap();
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 22 });

    map.on('locationfound', (e) => {
      setUserPosition(e.latlng);
    });

    map.on('locationerror', () => {
      alert('Não foi possível obter sua localização.');
    });
  }, [map]);

  const backToUserLocation = () => {
    if (userPosition) {
      map.setView(userPosition, 20);
    }
  };

  return (
    <button
      onClick={backToUserLocation}
      className='absolute bottom-10 right-10 cursor-pointer z-[9999] bg-white p-1 rounded-lg'
    >
      <img
        src='/center.svg'
        alt='Center'
        className='w-8 h-8'
      />
    </button>
  );
}

