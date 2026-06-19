"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issues with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LeafletMap({
  lat,
  lng,
  zoom = 12,
  address,
  caption,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  address?: string;
  caption?: string;
}) {
  return (
    <>
      <style>{`
        .blog-map .leaflet-tile-pane { filter: brightness(0.85) saturate(1.1); }
      `}</style>
      <div className="w-full h-80 relative z-10 blog-map">
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            {(address || caption) && (
              <Popup>
                <div className="text-slate-900 p-1">
                  {address && <strong className="block mb-1 text-sm font-bold">{address}</strong>}
                  {caption && <span className="text-xs">{caption}</span>}
                </div>
              </Popup>
            )}
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}
