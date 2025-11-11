import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import { useTumulo } from '../context/TumuloContext.';

export default function TumuloDetalhado() {
  const map = useMap();
  const { tumuloDetalhado, setTumuloDetalhado, setTumuloSelecionado } =
    useTumulo();

  useEffect(() => {
    if (!map || !tumuloDetalhado) return;

    const coords = tumuloDetalhado.geom.coordinates[0];
    const center: LatLngExpression = [
      coords.reduce((sum, [, lat]) => sum + lat, 0) / coords.length,
      coords.reduce((sum, [lng]) => sum + lng, 0) / coords.length,
    ];

    map.flyTo(center, map.getZoom(), { animate: true });

    const timeout = setTimeout(() => {
      const popupContent = `
        <div style="max-width: 250px;">
        <p style="margin: 4px auto;">Fileira: ${
          tumuloDetalhado.fileira
        } | Posição: ${tumuloDetalhado.posicao}</p>
          <img src="${
            tumuloDetalhado.fotoUrl
              ? tumuloDetalhado.fotoUrl
              : 'foto-placeholder.jpg'
          }" alt="Foto de ${
        tumuloDetalhado.nome
      }" style="width: 80%; height: auto; aspect-ratio: 1/1; object-fit: cover; margin: 0 auto 8px; border-radius: 8px;" />
      <p style="margin: 4px;"><strong>Nome:</strong> ${tumuloDetalhado.nome} ${
        tumuloDetalhado.kanji ? `<em>(${tumuloDetalhado.kanji})</em>` : ''
      }</p>
          <p style="margin: 4px;"><strong>Data de Nascimento:</strong> ${
            tumuloDetalhado.dataNascimento
          }</p>
          <p style="margin: 4px;"><strong>Data de Falecimento:</strong> ${
            tumuloDetalhado.dataFalecimento
          }</p>
          <p style="margin: 4px;"><strong>Local de Origem:</strong> ${
            tumuloDetalhado.localOrigem
          }</p>
          <p style="margin: 4px;"><strong>Parente:</strong> ${
            tumuloDetalhado.nomeParente
          }</p>
          <button id="btnIrTumulo" style="
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 8px;
            width: 100%;
          ">
            Ir
          </button>
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

      setTimeout(() => {
        const button = document.getElementById('btnIrTumulo');
        if (button) {
          button.addEventListener('click', () => {
            setTumuloSelecionado(tumuloDetalhado);
            map.closePopup();
          });
        }
      }, 100);
    }, 200);

    const handlePopupClose = () => {
      setTumuloDetalhado(null);
    };

    map.on('popupclose', handlePopupClose);

    return () => {
      clearTimeout(timeout);
      map.off('popupclose', handlePopupClose);
      map.closePopup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tumuloDetalhado, map]);

  return null;
}

