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

// --- PEQUENAS MOVIMENTAÇÕES SÃO IGNORADAS (< 2m)
const MIN_MOVE_DISTANCE = 2; // metros

export default function UserLocation() {
  const map = useMap();
  const { tumuloSelecionado, carregando, setTumuloSelecionado } = useTumulo();
  const [distanceAndAngle, setDistanceAndAngle] =
    useState<DistanceAndAngle | null>(null);

  const [userMarker, setUserMarker] = useState<LeafletMarker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastLatLngRef = useRef<LatLng | null>(null);

  // --- Animação suave ---
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

  // --- Função de callback do watchPosition ---
  const handleLocation = async (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const newLatLng = L.latLng(latitude, longitude);

    // --- filtra micro variações < 2m ---
    // if (lastLatLngRef.current) {
    //   const d = map.distance(lastLatLngRef.current, newLatLng);

    //   if (d < MIN_MOVE_DISTANCE) return; // ignora "tremedeira"
    // }
    lastLatLngRef.current = newLatLng;

    if (userMarker) {
      animateMarkerTo(userMarker, newLatLng);
    } else {
      const marker = L.marker(newLatLng, { icon: userIcon }).addTo(map);
      marker.bindPopup('Você está aqui');
      setUserMarker(marker);

      // Primeira vez → centraliza
      map.setView(newLatLng, 20);
    }

    if (tumuloSelecionado) {
      try {
        const response = await getDistanceAndAngleFromLocation(
          tumuloSelecionado.id,
          latitude,
          longitude
        );

        setDistanceAndAngle(response);
      } catch (error) {
        console.error('Erro ao calcular distância:', error);
      }
    }
  };

  useEffect(() => {
    if (carregando) return;

    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    // --- Inicia rastreamento contínuo ---
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleLocation,
      console.error,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      // --- Remove rastreamento ao desmontar (IMPORTANTÍSSIMO) ---
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [carregando, tumuloSelecionado]);

  // --- HUD de distância ---
  if (tumuloSelecionado)
    return (
      <>
        {distanceAndAngle?.distance !== undefined && (
          <div className='fixed top-5 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded shadow-lg z-[9999] flex items-center gap-3'>
            <div className='flex flex-col'>
              <strong>Túmulo: {tumuloSelecionado.nome}</strong>
              <span>
                Distância:{' '}
                {distanceAndAngle
                  ? `${distanceAndAngle.distance.toFixed(2)} m`
                  : 'Calculando...'}
              </span>
            </div>

            <button
              onClick={() => setTumuloSelecionado(null)}
              className='w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center'
            >
              x
            </button>
          </div>
        )}

        {/* Indicador simples da direção (pode personalizar melhor depois) */}
        {distanceAndAngle?.angle !== undefined && (
          <div className='absolute bottom-20 right-5 md:right-6 z-[9999] bg-white p-3 rounded-lg shadow'>
            <img
              src='arrow-direction.png'
              alt='Direção'
              style={{
                width: '16px',
                height: '16px',
                transform: `rotate(${distanceAndAngle.angle}deg)`,
              }}
            />
          </div>
        )}
      </>
    );

  return null;
}
