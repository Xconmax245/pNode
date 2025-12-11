'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// fix for default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on health status
const createIcon = (color: string) => new L.Icon({
  iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}' width='24' height='24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const healthIcons: Record<string, L.Icon> = {
  healthy: createIcon('#10b981'),
  degraded: createIcon('#f59e0b'),
  down: createIcon('#ef4444'),
};

export default function NodeMap({ nodes = [], node, onNodeClick }: any) {
  // if single node provided, center there
  const targetNode = node || (nodes.length > 0 ? nodes[0] : null);
  const center = targetNode ? [targetNode.location.lat, targetNode.location.lng] : [30, 0];
  const zoom = node ? 10 : 2;

  return (
    <MapContainer center={center as [number, number]} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-md z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {(node ? [node] : nodes).map((n: any) => {
        const locationStr = n.location ? (typeof n.location === 'string' ? n.location : `${n.location.city || ''}, ${n.location.country || ''}`) : 'Unknown';
        const icon = healthIcons[n.health] || healthIcons.healthy;
        
        return (
          <Marker 
            key={n.id} 
            position={[n.location.lat, n.location.lng] as [number, number]}
            icon={icon}
            eventHandlers={{
              click: () => onNodeClick?.(n)
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div style={{ minWidth: 200 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{n.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{locationStr}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{n.latency}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>ms</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{n.storage?.used || 0}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>% used</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{n.uptime}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>% up</div>
                  </div>
                </div>
                <Link 
                  href={`/nodes/${n.id}`}
                  style={{ 
                    display: 'inline-block',
                    fontSize: 12, 
                    color: '#0ea5a4', 
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
