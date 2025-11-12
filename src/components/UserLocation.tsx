import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLng, Marker as LeafletMarker } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';
import { getDistanceAndAngleFromLocation } from '../lib/api';
import type { DistanceAndAngle } from '@/interfaces/DistanceAndAngle';

const userIcon = L.icon({
  iconUrl: '/location.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function UserLocation() {
  const map = useMap();
  const { tumuloSelecionado, carregando, setTumuloSelecionado } = useTumulo();
  const [distanceAndAngle, setDistanceAndAngle] =
    useState<DistanceAndAngle | null>(null);

  const [userMarker, setUserMarker] = useState<LeafletMarker | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasLocatedInitially = useRef(false);

  // Anima movimento do marcador
  const animateMarkerTo = (
    marker: LeafletMarker,
    newLatLng: LatLng,
    duration = 800
  ) => {
    const startLatLng = marker.getLatLng();
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lat =
        startLatLng.lat + (newLatLng.lat - startLatLng.lat) * progress;
      const lng =
        startLatLng.lng + (newLatLng.lng - startLatLng.lng) * progress;
      marker.setLatLng([lat, lng]);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Obtém localização e atualiza marcador
  const updateUserLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLatLng = L.latLng(latitude, longitude);

        if (userMarker) {
          animateMarkerTo(userMarker, newLatLng);
        } else {
          const marker = L.marker(newLatLng, { icon: userIcon }).addTo(map);
          setUserMarker(marker);
        }

        if (tumuloSelecionado) {
          map.flyTo(newLatLng, 22, { animate: true, duration: 2 });

          try {
            const response = await getDistanceAndAngleFromLocation(
              tumuloSelecionado.id,
              latitude,
              longitude
            );

            setTimeout(() => {
              setDistanceAndAngle(response);
            }, 2000);
          } catch (error) {
            console.error('Erro ao calcular distância:', error);
          }
        }
      },
      (err) => console.error('Erro ao obter localização:', err),
      { enableHighAccuracy: true }
    );
  };

  // Localiza apenas uma vez quando o mapa carregar
  useEffect(() => {
    if (carregando || hasLocatedInitially.current) return;

    hasLocatedInitially.current = true;
    updateUserLocation();
  }, [carregando, map]);

  // Atualiza a cada 4s quando há túmulo selecionado
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (tumuloSelecionado) {
      updateUserLocation();
      intervalRef.current = setInterval(() => updateUserLocation(), 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tumuloSelecionado]);

  if (tumuloSelecionado)
    return (
      <>
        {distanceAndAngle?.distance && (
          <div className='fixed top-5 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded shadow-lg z-[9999] flex items-center gap-3'>
            <div className='flex flex-col'>
              <strong>Túmulo Selecionado: {tumuloSelecionado.nome}</strong>
              <span>
                Distância até o túmulo:{' '}
                {distanceAndAngle
                  ? `${distanceAndAngle.distance.toFixed(2)} metros`
                  : 'Calculando distância...'}
              </span>
            </div>

            <button
              onClick={() => setTumuloSelecionado(null)}
              className='w-6 h-6 top-0 right-0 p-1 bg-red-500 text-white rounded cursor-pointer'
            >
              x
            </button>
          </div>
        )}

        {distanceAndAngle?.angle && (
          <div className='absolute bottom-18 right-5 md:right-6 cursor-pointer z-[9999] bg-white p-3 rounded-lg'>
            <img
              src='arrow-direction.png'
              alt='Direção'
              className={`w-4 h-4 rotate-[${
                distanceAndAngle ? distanceAndAngle.angle : 0
              }deg]`}
            />
          </div>
        )}
      </>
    );
}

