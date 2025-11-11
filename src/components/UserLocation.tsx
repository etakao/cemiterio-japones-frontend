import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { Marker as LeafletMarker } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';
import { getDistanceAndAngleFromLocation } from '../lib/api';

const userIcon = L.icon({
  iconUrl: '/location.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function UserLocation() {
  const map = useMap();
  const { tumuloSelecionado, carregando } = useTumulo();

  const [userMarker, setUserMarker] = useState<LeafletMarker | null>(null);

  useEffect(() => {
    if (carregando) return;

    map.locate({ setView: false, watch: true, enableHighAccuracy: true });

    const onLocationFound = async (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;

      // Atualiza ou cria o marcador do usuário
      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        setUserMarker(marker);
      }

      // Se houver um túmulo selecionado, mostra popup com distância
      if (tumuloSelecionado) {
        try {
          const { distance } = await getDistanceAndAngleFromLocation(
            tumuloSelecionado.id,
            lat,
            lng
          );

          userMarker
            ?.bindPopup(`Distância até o túmulo: ${distance.toFixed(2)} metros`)
            .openPopup();
        } catch (error) {
          console.error('Erro ao calcular distância:', error);
        }
      } else {
        // Se não há túmulo selecionado, fecha o popup
        userMarker?.closePopup();
      }
    };

    const onLocationError = () => {
      alert('Não foi possível obter sua localização.');
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, [map, carregando, tumuloSelecionado, userMarker]);

  return null;
}

// import { useTumulo } from '../context/TumuloContext.';
// import L from 'leaflet';
// import { useEffect } from 'react';
// import { useMap } from 'react-leaflet';

// const DefaultIcon = L.icon({
//   iconUrl: '/location.png',
//   iconSize: [16, 16],
//   iconAnchor: [10, 10],
//   popupAnchor: [0, -16],
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// export default function UserLocation() {
//   const { carregando } = useTumulo();
//   const map = useMap();

//   useEffect(() => {
//     if (carregando) return;

//     map.locate({
//       setView: false,
//       maxZoom: 22,
//     });

//     map.on('locationfound', (e) => {
//       const radius = e.accuracy;
//       L.marker(e.latlng)
//         .addTo(map)
//         .bindPopup(
//           `Você está aproximadamente a ${radius.toFixed(0)} metros daqui.`
//         )
//         .openPopup();
//     });

//     map.on('locationerror', () => {
//       alert('Não foi possível obter sua localização.');
//     });

//     return () => {
//       map.off('locationfound');
//       map.off('locationerror');
//     };
//   }, [map, carregando]);

//   return null;
// }

