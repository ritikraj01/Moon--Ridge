"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Compass, RefreshCw, X } from "lucide-react";

interface Package {
  _id: string;
  slug: string;
  title: string;
  destination: string;
  duration: number;
  pricing: number;
  gallery?: string[];
  highlights?: string[];
  averageRating?: number;
  numOfReviews?: number;
}

interface PackagesListProps {
  initialPackages: Package[];
}

export default function PackagesList({ initialPackages }: PackagesListProps) {
  const [search, setSearch] = useState("");
  
  // Calculate max price from packages
  const absoluteMaxPrice = useMemo(() => {
    if (initialPackages.length === 0) return 100000;
    return Math.max(...initialPackages.map((p) => p.pricing));
  }, [initialPackages]);

  const [priceRange, setPriceRange] = useState(absoluteMaxPrice);
  const [duration1to3, setDuration1to3] = useState(false);
  const [duration4to6, setDuration4to6] = useState(false);
  const [duration7plus, setDuration7plus] = useState(false);

  // Filter package items dynamically in memory
  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      // 1. Search filter
      const matchesSearch = 
        pkg.title.toLowerCase().includes(search.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(search.toLowerCase());

      // 2. Price filter
      const matchesPrice = pkg.pricing <= priceRange;

      // 3. Duration filter
      const hasDurationFilter = duration1to3 || duration4to6 || duration7plus;
      let matchesDuration = true;
      if (hasDurationFilter) {
        matchesDuration = false;
        if (duration1to3 && pkg.duration >= 1 && pkg.duration <= 3) matchesDuration = true;
        if (duration4to6 && pkg.duration >= 4 && pkg.duration <= 6) matchesDuration = true;
        if (duration7plus && pkg.duration >= 7) matchesDuration = true;
      }

      return matchesSearch && matchesPrice && matchesDuration;
    });
  }, [initialPackages, search, priceRange, duration1to3, duration4to6, duration7plus]);

  const hasActiveFilters = search !== "" || priceRange < absoluteMaxPrice || duration1to3 || duration4to6 || duration7plus;

  const handleResetFilters = () => {
    setSearch("");
    setPriceRange(absoluteMaxPrice);
    setDuration1to3(false);
    setDuration4to6(false);
    setDuration7plus(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Filters Sidebar */}
      <div className="space-y-6">
        <Card className="border border-border bg-card/85 backdrop-blur-xl p-6 shadow-xl sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Filters</h3>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                onClick={handleResetFilters}
                className="text-xs text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-2.5 rounded-lg flex items-center gap-1 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">Search Destination</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Ladakh, Bali..." 
                  className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 focus:border-amber-500/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">Max Price</label>
                <span className="text-sm font-bold text-amber-500">₹{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={0}
                max={absoluteMaxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>₹0</span>
                <span>₹{absoluteMaxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">Trip Duration</label>
              <div className="flex flex-col gap-3 mt-2 text-sm text-zinc-300">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={duration1to3}
                    onChange={(e) => setDuration1to3(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 text-amber-500 bg-zinc-950 focus:ring-amber-500/50 cursor-pointer accent-amber-500" 
                  /> 
                  <span className="group-hover:text-amber-500 transition-colors">1 - 3 Days</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={duration4to6}
                    onChange={(e) => setDuration4to6(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 text-amber-500 bg-zinc-950 focus:ring-amber-500/50 cursor-pointer accent-amber-500" 
                  /> 
                  <span className="group-hover:text-amber-500 transition-colors">4 - 6 Days</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={duration7plus}
                    onChange={(e) => setDuration7plus(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 text-amber-500 bg-zinc-950 focus:ring-amber-500/50 cursor-pointer accent-amber-500" 
                  /> 
                  <span className="group-hover:text-amber-500 transition-colors">7+ Days</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Packages Grid */}
      <div className="md:col-span-2 space-y-6">
        {filteredPackages.length === 0 ? (
          <Card className="border border-dashed border-white/10 bg-zinc-900/10 backdrop-blur-xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-500 mb-4">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">No Packages Found</h3>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
              We couldn't find any tour plans that match your exact query. Try resetting your search or adjust the filters.
            </p>
            {hasActiveFilters && (
              <Button 
                onClick={handleResetFilters}
                className="bg-amber-500 hover:bg-amber-600 text-black rounded-full font-semibold px-6 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg._id || pkg.slug} className="overflow-hidden border-white/5 hover:border-amber-500/30 bg-card hover:bg-zinc-900/40 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between h-full group">
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={pkg.gallery?.[0] || "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop"} 
                      alt={pkg.title} 
                      fill 
                      className="object-cover transition-transform duration-750 group-hover:scale-105" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    />
                    <Badge className="absolute top-4 right-4 bg-black/75 text-white backdrop-blur-md border border-white/10 font-bold px-2.5 py-1 flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>
                        {pkg.averageRating && pkg.averageRating > 0
                          ? `${pkg.averageRating.toFixed(1)} (${pkg.numOfReviews})`
                          : "New"}
                      </span>
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-2">{pkg.duration} Days</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors text-white line-clamp-1">{pkg.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2 h-10 leading-relaxed">
                      {pkg.highlights?.join(" • ") || "Incredible scenic routes, guided exploration, and premium comfortable stays."}
                    </p>
                  </CardContent>
                </div>
                <div>
                  <CardContent className="px-6 pb-4 pt-0">
                    <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                      <span className="text-xs text-zinc-500">Starts from</span>
                      <div className="text-2xl font-black text-white">
                        ₹{pkg.pricing?.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ person</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/10" asChild>
                      <Link href={`/packages/${pkg.slug}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
