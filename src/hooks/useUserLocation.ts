import { useEffect, useState } from 'react';

export function useUserLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.warn('Erro ao obter localização:', err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return location;
}

