import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { STATIC_LOCATIONS, CATEGORY_META, type LocationCategory } from "../../map-of-ladakh/location-data";
import LocationDetail from "../../map-of-ladakh/LocationDetail";

// ── Data helpers ─────────────────────────────────────────────────────────────
async function getLocation(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations/slug/${slug}`,
      { cache: "no-store" }
    );
    if (res.ok) return res.json();
  } catch {}
  // Fallback to static data
  return STATIC_LOCATIONS.find((l) => l.slug === slug) ?? null;
}

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
      cache: "no-store",
    });
    if (res.ok) return res.json();
  } catch {}
  return [];
}

async function getPackages() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/packages`,
      { cache: "no-store" }
    );
    if (res.ok) return res.json();
  } catch {}
  return [];
}

// ── Static params for SSG ────────────────────────────────────────────────────
export async function generateStaticParams() {
  // Pre-render all static slugs at build time
  return STATIC_LOCATIONS.map((l) => ({ slug: l.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) return { title: "Location Not Found | MoonRidge" };

  const meta = CATEGORY_META[location.category as LocationCategory];
  const img =
    location.images?.[0] ||
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200";

  return {
    title: `${location.name} — ${meta.label} in Ladakh | MoonRidge Travel Guide`,
    description: location.shortDescription,
    openGraph: {
      title: `${location.name} | MoonRidge Ladakh Travel Guide`,
      description: location.shortDescription,
      images: [{ url: img, width: 1200, height: 630, alt: location.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${location.name} | MoonRidge`,
      description: location.shortDescription,
      images: [img],
    },
    alternates: {
      canonical: `https://moonridge.com/locations/${slug}`,
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [location, allBlogs, allPackages] = await Promise.all([
    getLocation(slug),
    getBlogs(),
    getPackages(),
  ]);

  if (!location) notFound();

  const meta = CATEGORY_META[location.category as LocationCategory];

  // Related content matching
  const relatedBlogs = allBlogs.filter(
    (b: any) =>
      location.relatedBlogs?.includes(b.slug) ||
      b.tripLocation?.toLowerCase().includes(location.name.toLowerCase())
  );
  const relatedPackages = allPackages.filter(
    (p: any) =>
      location.relatedPackages?.includes(p.slug) ||
      p.destination?.toLowerCase().includes(location.name.toLowerCase())
  );

  // JSON-LD Structured Data — TouristAttraction
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: location.name,
    description: location.longDescription || location.shortDescription,
    image: location.images?.[0] || "",
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Ladakh, India",
    },
    tourBookingPage: `https://moonridge.com/packages`,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <span className="text-border">/</span>
          <Link href="/map-of-ladakh" className="hover:text-amber-400 transition-colors">
            Map of Ladakh
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">{location.name}</span>
        </nav>
      </div>

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <Link
          href="/map-of-ladakh"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Map of Ladakh
        </Link>
      </div>

      {/* Detail */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <LocationDetail
          location={location}
          relatedBlogs={relatedBlogs.slice(0, 4)}
          relatedPackages={relatedPackages.slice(0, 3)}
        />

        {/* All Locations quick-nav */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-center">
            Explore More Ladakh Destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STATIC_LOCATIONS.filter((l) => l.slug !== slug).map((loc) => {
              const m = CATEGORY_META[loc.category];
              return (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 hover:border-amber-500/40 bg-card/10 hover:bg-card/30 text-center transition-all group"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                    {loc.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
