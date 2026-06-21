import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPackagePrice,
  formatTravelersLabel,
  getStartingOffer,
} from "@/lib/packagePricing";
import HeroVideo from "@/components/HeroVideo";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop";

async function getPackages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return [];
  }
}

export default async function Home() {
  const packages = await getPackages();
  const featuredPackages = packages.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HeroVideo />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Discover the World&apos;s Best <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
              Hidden Gems
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Experience luxury travel like never before. Handpicked destinations, premium stays, and unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm mx-auto sm:max-w-none animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" asChild className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black rounded-full px-8 py-6 text-lg font-semibold transition-all hover:scale-105">
              <Link href="/packages">Explore Packages</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <Link href="/build-trip">Customize Trip</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-24 bg-background px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Packages</h2>
          <p className="text-muted-foreground text-lg">
            Handpicked tours with real pricing — explore details and book your next trip
          </p>
        </div>

        {featuredPackages.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card/40">
            <p className="text-muted-foreground mb-6">No packages available yet.</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              <Link href="/packages">Browse Packages</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((pkg: {
                _id: string;
                slug: string;
                title: string;
                destination: string;
                duration: number;
                pricing: number;
                numberOfPersons?: number;
                plans?: { name: string; price: number; numberOfPersons?: number }[];
                startingPrice?: number;
                startingNumberOfPersons?: number;
                gallery?: string[];
                averageRating?: number;
                numOfReviews?: number;
              }) => {
                const starting =
                  pkg.startingPrice != null && pkg.startingNumberOfPersons != null
                    ? {
                        price: pkg.startingPrice,
                        numberOfPersons: pkg.startingNumberOfPersons,
                      }
                    : getStartingOffer(pkg.pricing, pkg.plans, pkg.numberOfPersons);

                return (
                  <Link
                    key={pkg._id || pkg.slug}
                    href={`/packages/${pkg.slug}`}
                    className="group relative h-[26rem] rounded-2xl overflow-hidden block"
                  >
                    <Image
                      src={pkg.gallery?.[0] || DEFAULT_COVER}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <Badge className="absolute top-4 right-4 bg-black/75 text-white backdrop-blur-md border border-white/10 font-bold px-2.5 py-1 flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>
                        {pkg.averageRating && pkg.averageRating > 0
                          ? `${pkg.averageRating.toFixed(1)}`
                          : "New"}
                      </span>
                    </Badge>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                        {pkg.destination} · {pkg.duration} Days
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                        {pkg.title}
                      </h3>
                      <div className="mb-4">
                        <span className="text-xs text-zinc-400">Starting from </span>
                        <span className="text-lg font-bold text-white">
                          {formatPackagePrice(starting.price)}
                        </span>
                        <span className="text-xs text-amber-500/90 ml-2">
                          {formatTravelersLabel(starting.numberOfPersons)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                          View Package Details
                        </span>
                        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold transition-transform group-hover:scale-110">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {packages.length > featuredPackages.length && (
              <div className="text-center mt-12">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
                >
                  <Link href="/packages">View All Packages</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
