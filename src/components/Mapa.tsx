import UpdateCenter from './UpdateCenter';
import { useTumulo } from '../context/TumuloContext.';
import type { LatLngExpression } from 'leaflet';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import UserLocation from './UserLocation';
import CenterLocation from './CenterLocation';

export default function Mapa() {
  const { tumulos, tumuloSelecionado, setTumuloSelecionado } = useTumulo();

  const center: LatLngExpression = [-22.0948, -51.4975];

  return (
    <MapContainer
      center={center}
      zoom={20}
      minZoom={0}
      maxZoom={22}
      style={{ height: '100vh', width: '100vw', zIndex: 0 }}
    >
      <TileLayer
        url='https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=uLS5ms4Ua7PgHnXgLldX'
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
        maxZoom={22}
      />

      <TileLayer
        tms={true}
        attribution='&copy; Raster via gdal2tiles'
        url='/tiles/{z}/{x}/{y}.png'
        minZoom={0}
        maxZoom={22}
      />

      <UpdateCenter />

      <UserLocation />

      <CenterLocation />

      {tumulos.map((tumulo) => (
        <Polygon
          key={tumulo.id}
          positions={tumulo.geom.coordinates[0].map(([lng, lat]) => [lat, lng])}
          color='blue'
          interactive
          eventHandlers={{
            click: () => {
              setTumuloSelecionado(tumulo);
            },
          }}
        />
      ))}

      {tumuloSelecionado && (
        <Polygon
          positions={tumuloSelecionado.geom.coordinates[0].map(([lng, lat]) => [
            lat,
            lng,
          ])}
          color='yellow'
          interactive
        />
      )}
    </MapContainer>
  );
}

