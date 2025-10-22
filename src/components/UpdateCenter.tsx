import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';

export default function UpdateCenter() {
  const map = useMap();
  const { tumuloSelecionado, setTumuloSelecionado } = useTumulo();

  useEffect(() => {
    if (!map || !tumuloSelecionado) return;

    const coords = tumuloSelecionado.geom.coordinates[0];
    const center: LatLngExpression = [
      coords.reduce((sum, [, lat]) => sum + lat, 0) / coords.length,
      coords.reduce((sum, [lng]) => sum + lng, 0) / coords.length,
    ];

    map.setView(center, map.getZoom(), { animate: true });

    const timeout = setTimeout(() => {
      const popupContent = `
        <div style="max-width: 250px;">
          <img src="${
            tumuloSelecionado.fotoUrl
              ? tumuloSelecionado.fotoUrl
              : 'foto-placeholder.jpg'
          }" alt="Foto de ${
        tumuloSelecionado.nome
      }" style="width: 100%; height: auto; aspect-ratio: 1/1; object-fit: cover; margin-bottom: 8px; border-radius: 8px;" />
      <p><strong>Nome:</strong> ${tumuloSelecionado.nome} ${
        tumuloSelecionado.kanji ? `<em>(${tumuloSelecionado.kanji})</em>` : ''
      }</p>
          <p><strong>Data de Nascimento:</strong> ${
            tumuloSelecionado.dataNascimento
          }</p>
          <p><strong>Data de Falecimento:</strong> ${
            tumuloSelecionado.dataFalecimento
          }</p>
          <p><strong>Local de Origem:</strong> ${
            tumuloSelecionado.localOrigem
          }</p>
          <p><strong>Parente:</strong> ${tumuloSelecionado.nomeParente}</p>
        </div>
      `;

      const popup = L.popup({
        closeOnClick: false,
        closeButton: true,
        autoClose: true,
      })
        .setLatLng(center)
        .setContent(popupContent);

      map.openPopup(popup);
    }, 200);

    const handlePopupClose = () => {
      setTumuloSelecionado(null);
    };

    map.on('popupclose', handlePopupClose);

    return () => {
      clearTimeout(timeout);
      map.off('popupclose', handlePopupClose);
      map.closePopup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tumuloSelecionado, map]);

  return null;
}

