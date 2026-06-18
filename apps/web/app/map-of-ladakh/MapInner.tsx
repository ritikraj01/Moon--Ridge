"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { fixLeafletIcons } from "./leaflet-icon-fix";
import { CATEGORY_META, type Location } from "./location-data";

fixLeafletIcons();

// ── Custom emoji-based DivIcon per category ──────────────────────────────────
function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div class="leaflet-emoji-marker" title="${emoji}">${emoji}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

// ── FlyTo controller ─────────────────────────────────────────────────────────
function FlyToController({
  flyTo,
}: {
  flyTo: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.4 });
    }
  }, [flyTo, map]);
  return null;
}

// ── Popup Card ───────────────────────────────────────────────────────────────
function LocationPopup({ loc }: { loc: Location }) {
  const meta = CATEGORY_META[loc.category];
  const img = loc.images[0] || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="map-popup-card">
      {/* Image */}
      <div className="map-popup-img">
        <img src={img} alt={loc.name} loading="lazy" />
        <div className="map-popup-cat-badge">
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="map-popup-body">
        <h3 className="map-popup-title">{loc.name}</h3>
        <div className="map-popup-meta">
          <span>⛰️ {loc.altitude}</span>
          {loc.distanceFromLeh && loc.distanceFromLeh !== "0 km" && (
            <span>📍 {loc.distanceFromLeh} from Leh</span>
          )}
        </div>
        <p className="map-popup-desc">{loc.shortDescription}</p>

        {/* Buttons */}
        <div className="map-popup-actions">
          <a href={`#location-${loc.slug}`} className="map-popup-btn map-popup-btn-primary">
            View Details
          </a>
          <a href="/packages" className="map-popup-btn map-popup-btn-ghost">
            Packages
          </a>
          <a href="/blog" className="map-popup-btn map-popup-btn-ghost">
            Blogs
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main MapInner ─────────────────────────────────────────────────────────────
interface MapInnerProps {
  locations: Location[];
  flyTo: { lat: number; lng: number; zoom: number } | null;
  selectedSlug: string | null;
  onSelectSlug: (slug: string) => void;
}

export default function MapInner({ locations, flyTo, selectedSlug, onSelectSlug }: MapInnerProps) {
  return (
    <>
      {/* Inject custom popup + marker styles */}
      <style>{`
        /* Map container height */
        .ladakh-map { height: 700px; width: 100%; }
        @media (max-width: 1024px) { .ladakh-map { height: 500px; } }
        @media (max-width: 640px)  { .ladakh-map { height: 400px; } }

        /* Leaflet tile layer dark filter */
        .leaflet-tile-pane { filter: brightness(0.85) saturate(1.1); }

        /* Emoji marker */
        .leaflet-emoji-marker {
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.55));
          transition: transform 0.15s;
          user-select: none;
        }
        .leaflet-emoji-marker:hover { transform: scale(1.25); }

        /* Remove default leaflet popup white box chrome */
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }

        /* Popup card */
        .map-popup-card {
          width: 280px;
          border-radius: 16px;
          overflow: hidden;
          background: #0f0f10;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.12);
          font-family: inherit;
        }
        .map-popup-img {
          position: relative;
          height: 140px;
          overflow: hidden;
        }
        .map-popup-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .map-popup-cat-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #f5c366;
        }
        .map-popup-body { padding: 14px 16px 16px; }
        .map-popup-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .map-popup-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #f5c366;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .map-popup-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          margin: 0 0 14px;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .map-popup-actions { display: flex; gap: 6px; }
        .map-popup-btn {
          flex: 1;
          text-align: center;
          padding: 7px 4px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }
        .map-popup-btn-primary {
          background: #f59e0b;
          color: #000;
        }
        .map-popup-btn-primary:hover { background: #d97706; }
        .map-popup-btn-ghost {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
        }
        .map-popup-btn-ghost:hover {
          background: rgba(255,255,255,0.13);
          color: #fff;
        }
      `}</style>

      <MapContainer
        center={[34.15, 77.58]}
        zoom={8}
        className="ladakh-map"
        zoomControl={false}
        scrollWheelZoom
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToController flyTo={flyTo} />

        {locations.map((loc) => {
          const meta = CATEGORY_META[loc.category];
          return (
            <Marker
              key={loc.slug}
              position={[loc.latitude, loc.longitude]}
              icon={createEmojiIcon(meta.emoji)}
              eventHandlers={{ click: () => onSelectSlug(loc.slug) }}
            >
              <Popup maxWidth={300} minWidth={280}>
                <LocationPopup loc={loc} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
