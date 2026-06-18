"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORY_META, type Location } from "./location-data";
import { Mountain, Clock, MapPin } from "lucide-react";

interface LocationCardProps {
  location: Location;
  onExplore?: (slug: string) => void;
}

export default function LocationCard({ location, onExplore }: LocationCardProps) {
  const meta = CATEGORY_META[location.category];
  const img =
    location.images[0] ||
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/50 bg-card/20 hover:bg-card/40 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <Image
          src={img}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${meta.color}`}
        >
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors">
          {location.name}
        </h3>

        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
          {location.altitude && (
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-amber-500" />
              {location.altitude}
            </span>
          )}
          {location.distanceFromLeh && location.distanceFromLeh !== "0 km" && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" />
              {location.distanceFromLeh}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5 flex-1">
          {location.shortDescription}
        </p>

        {/* Best time */}
        {location.bestTimeToVisit && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Best time: <span className="text-foreground font-medium">{location.bestTimeToVisit}</span></span>
          </div>
        )}

        {/* Explore button */}
        <a
          href={`#location-${location.slug}`}
          onClick={() => onExplore?.(location.slug)}
          className="mt-auto w-full py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-semibold text-center hover:bg-amber-500/10 hover:border-amber-500/60 transition-all group/btn"
        >
          Explore More
          <span className="inline-block ml-1 transition-transform group-hover/btn:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}
