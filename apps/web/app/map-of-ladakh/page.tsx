import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STATIC_LOCATIONS } from "./location-data";
import LocationCard from "./LocationCard";
import LocationDetail from "./LocationDetail";
import AddLocationModal from "./AddLocationModal";
import MapSectionWrapper from "./MapSectionWrapper";

// Force dynamic rendering — page fetches live API data
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map of Ladakh | MoonRidge — Interactive Travel Guide",
  description:
    "Explore Ladakh on an interactive map. Discover destinations, lakes, monasteries, mountain passes and hidden gems across the Himalayas. Plan your trip with MoonRidge.",
  openGraph: {
    title: "Map of Ladakh | MoonRidge — Interactive Travel Guide",
    description:
      "Explore Ladakh on an interactive map. Discover destinations, lakes, monasteries, mountain passes and hidden gems across the Himalayas.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Map of Ladakh",
      },
    ],
    type: "website",
  },
};

async function getLocations() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPackages() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/packages`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function MapOfLadakhPage() {
  const [apiLocations, allBlogs, allPackages] = await Promise.all([
    getLocations(),
    getBlogs(),
    getPackages(),
  ]);

  // Use API locations if available, otherwise fallback to static data
  const locations =
    Array.isArray(apiLocations) && apiLocations.length > 0
      ? apiLocations
      : STATIC_LOCATIONS;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative h-[72vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop"
          alt="Ladakh mountains"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Interactive Travel Guide
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Map of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
              Ladakh
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Explore destinations, lakes, monasteries, mountain passes and hidden gems across Ladakh.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {[
              { emoji: "📍", count: locations.length, label: "Destinations" },
              { emoji: "🌊", count: locations.filter((l: any) => l.category === "lake").length, label: "Lakes" },
              { emoji: "🛕", count: locations.filter((l: any) => l.category === "monastery").length, label: "Monasteries" },
              { emoji: "⛰️", count: locations.filter((l: any) => l.category === "pass").length, label: "Passes" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3">
                <div className="text-2xl mb-0.5">{stat.emoji}</div>
                <div className="text-white font-bold text-lg leading-none">{stat.count}</div>
                <div className="text-gray-400 text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-amber-400/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
        </div>
      </section>

      {/* ── Map Section ──────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2">
                Interactive Map
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Explore Ladakh
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Click any marker to view details, images and travel tips.
              </p>
            </div>
            <AddLocationModal />
          </div>
        </div>

        <MapSectionWrapper locations={locations} />
      </section>

      {/* ── Featured Locations Grid ───────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-3">
            Discover
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Locations</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every iconic destination in Ladakh, from ancient monasteries to glacier-fed lakes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((loc: any) => (
            <LocationCard key={loc.slug} location={loc} />
          ))}
        </div>
      </section>

      {/* ── Destination Detail Sections ───────────────────────────────── */}
      <section className="py-8 pb-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-3">
            Travel Guide
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Destination Details</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            In-depth guides for every location — history, travel tips, best time to visit, and more.
          </p>
        </div>

        <div className="space-y-10">
          {locations.map((loc: any) => {
            // Match related blogs by slug
            const relatedBlogs = allBlogs.filter(
              (b: any) =>
                loc.relatedBlogs?.includes(b.slug) ||
                b.tripLocation?.toLowerCase().includes(loc.name.toLowerCase())
            );

            // Match related packages by slug
            const relatedPackages = allPackages.filter(
              (p: any) =>
                loc.relatedPackages?.includes(p.slug) ||
                p.destination?.toLowerCase().includes(loc.name.toLowerCase())
            );

            return (
              <LocationDetail
                key={loc.slug}
                location={loc}
                relatedBlogs={relatedBlogs.slice(0, 4)}
                relatedPackages={relatedPackages.slice(0, 3)}
              />
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-background to-background border border-amber-500/20 p-10 md:p-16 text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Ready to Explore?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plan Your Ladakh Adventure
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Browse our curated tour packages or build a custom itinerary tailored to your dream Ladakh trip.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/packages"
              className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Browse Packages
            </Link>
            <Link
              href="/build-trip"
              className="px-8 py-3.5 rounded-full border border-border/60 hover:border-amber-500/40 text-foreground hover:text-amber-400 font-semibold transition-all hover:bg-amber-500/5"
            >
              Customize Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
