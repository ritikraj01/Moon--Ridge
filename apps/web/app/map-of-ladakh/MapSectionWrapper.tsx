"use client";

import dynamic from "next/dynamic";
import { type Location } from "./location-data";

// Dynamic import with ssr:false must live in a client component
const MapSection = dynamic(() => import("./MapSection"), {
  ssr: false,
  loading: () => (
    <div className="w-full px-4 md:px-8 max-w-7xl mx-auto">
      <div className="h-[700px] md:h-[700px] rounded-2xl bg-card/20 border border-border/40 flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-muted-foreground text-sm">Loading interactive map…</p>
        </div>
      </div>
    </div>
  ),
});

export default function MapSectionWrapper({ locations }: { locations: Location[] }) {
  return <MapSection locations={locations} />;
}
