import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';

export default function TumuloSelectedPopup() {
  const map = useMap();
  const { tumuloSelecionado } = useTumulo();

  useEffect(() => {
    if (!map || !tumuloSelecionado) return;

    const coords = tumuloSelecionado.geom.coordinates[0];
    const center: LatLngExpression = [
      coords.reduce((sum, [, lat]) => sum + lat, 0) / coords.length,
      coords.reduce((sum, [lng]) => sum + lng, 0) / coords.length,
    ];

    const timeout = setTimeout(() => {
      const popupContent = `
        <div style="max-width: 250px;">
          <img src="${
            tumuloSelecionado.fotoUrl
              ? tumuloSelecionado.fotoUrl
              : 'foto-placeholder.jpg'
          }" alt="Foto de ${
        tumuloSelecionado.nome
      }" style="width: 100%; max-width: 250px; height: auto; aspect-ratio: 1/1; object-fit: cover; margin: 0 auto; border-radius: 8px;" />
        </div>
      `;

      const popup = L.popup({
        closeOnClick: false,
        closeButton: false,
        autoClose: true,
      })
        .setLatLng(center)
        .setContent(popupContent);

      map.openPopup(popup);
    }, 200);

    return () => {
      clearTimeout(timeout);
      map.closePopup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tumuloSelecionado, map]);

  return null;
}

