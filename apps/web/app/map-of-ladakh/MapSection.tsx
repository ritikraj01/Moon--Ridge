"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search, X, MapPin, Filter } from "lucide-react";
import { CATEGORY_META, FILTER_TABS, STATIC_LOCATIONS, type Location } from "./location-data";

// Dynamically import the actual map to avoid SSR issues
const MapInner = dynamic<{
  locations: Location[];
  flyTo: { lat: number; lng: number; zoom: number } | null;
  selectedSlug: string | null;
  onSelectSlug: (slug: string) => void;
}>(() => import("./MapInner"), { ssr: false });

interface MapSectionProps {
  locations: Location[];
}

export default function MapSection({ locations }: MapSectionProps) {
  const displayLocations = locations.length > 0 ? locations : STATIC_LOCATIONS;
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filtered = displayLocations.filter((loc) => {
    const matchCat = activeFilter === "all" || loc.category === activeFilter;
    return matchCat;
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    if (!val.trim()) return;
    const match = displayLocations.find((l) =>
      l.name.toLowerCase().includes(val.toLowerCase()) ||
      l.slug.toLowerCase().includes(val.toLowerCase())
    );
    if (match) {
      setFlyTo({ lat: match.latitude, lng: match.longitude, zoom: 12 });
      setSelectedSlug(match.slug);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setFlyTo(null);
    setSelectedSlug(null);
  };

  return (
    <section className="w-full">
      {/* Controls Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destination…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border/60 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/60 focus:bg-card transition-all backdrop-blur"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap sm:flex-nowrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                  activeFilter === tab.key
                    ? "bg-amber-500 text-black border-transparent shadow-sm shadow-amber-500/30"
                    : "border-border/60 text-muted-foreground hover:border-amber-500/40 hover:text-amber-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <p className="mt-2 text-xs text-muted-foreground">
          Showing <span className="text-amber-400 font-semibold">{filtered.length}</span> of {displayLocations.length} locations
        </p>
      </div>

      {/* The map itself */}
      <div className="w-full px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-black/40">
          <MapInner
            locations={filtered}
            flyTo={flyTo}
            selectedSlug={selectedSlug}
            onSelectSlug={setSelectedSlug}
          />
        </div>
      </div>
    </section>
  );
}
