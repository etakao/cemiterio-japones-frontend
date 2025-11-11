import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLng, Marker as LeafletMarker } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';
import { getDistanceAndAngleFromLocation } from '../lib/api';

const userIcon = L.icon({
  iconUrl: '/location.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function UserLocation() {
  const map = useMap();
  const { tumuloSelecionado, carregando, setTumuloSelecionado } = useTumulo();

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
  const updateUserLocation = async (showPopup = false) => {
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
          map.setView(newLatLng, 18); // ✅ Centraliza apenas na primeira vez

          // Quando o popup for fechado, desmarca o túmulo
          marker.on('popupclose', () => setTumuloSelecionado(null));
        }

        if (tumuloSelecionado) {
          try {
            const { distance } = await getDistanceAndAngleFromLocation(
              tumuloSelecionado.id,
              latitude,
              longitude
            );

            userMarker
              ?.bindPopup(
                `Distância até o túmulo: ${distance.toFixed(2)} metros`
              )
              .openPopup();
          } catch (error) {
            console.error('Erro ao calcular distância:', error);
          }
        } else if (showPopup) {
          userMarker?.closePopup();
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
      updateUserLocation(true);
      intervalRef.current = setInterval(() => updateUserLocation(true), 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tumuloSelecionado]);

  return null;
}

