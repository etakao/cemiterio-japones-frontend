import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const DefaultIcon = L.icon({
  iconUrl: '/location.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function UserLocation() {
  const map = useMap();

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 22,
    });

    map.on('locationfound', (e) => {
      const radius = e.accuracy;
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup(
          `Você está aproximadamente a ${radius.toFixed(0)} metros daqui.`
        )
        .openPopup();
    });

    map.on('locationerror', () => {
      alert('Não foi possível obter sua localização.');
    });
  }, [map]);

  return null;
}

