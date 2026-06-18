"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CATEGORY_META, type Location } from "./location-data";
import {
  Mountain,
  Clock,
  MapPin,
  Lightbulb,
  Star,
  ArrowRight,
  BookOpen,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditLocationModal from "./EditLocationModal";
import DeleteLocationButton from "./DeleteLocationButton";
import { useAuthStore } from "@/lib/authStore";

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
}

interface RelatedPackage {
  _id: string;
  title: string;
  slug: string;
  pricing?: number;
  duration?: number;
  gallery?: string[];
}

interface LocationDetailProps {
  location: Location & { _id?: string };
  relatedBlogs?: RelatedBlog[];
  relatedPackages?: RelatedPackage[];
}

export default function LocationDetail({
  location,
  relatedBlogs = [],
  relatedPackages = [],
}: LocationDetailProps) {
  const meta = CATEGORY_META[location.category];
  const img =
    location.images[0] ||
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop";

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [isMounted, setIsMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % location.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + location.images.length) % location.images.length);
  };

  return (
    <div
      id={`location-${location.slug}`}
      className="scroll-mt-24 rounded-3xl overflow-hidden border border-border/40 bg-card/10 hover:border-amber-500/20 transition-colors duration-300"
    >
      {/* ── Hero Image ─────────────────────────────────────────────────── */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image
          src={img}
          alt={location.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Category badge — top left */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${meta.color}`}
          >
            {meta.emoji} {meta.label}
          </span>
        </div>

        {/* Admin Edit / Delete buttons — top right */}
        {isMounted && isAdmin && location._id && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="backdrop-blur-md bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 flex items-center gap-1.5">
              <EditLocationModal
                location={location as Location & { _id: string }}
              />
              <div className="w-px h-4 bg-white/20" />
              <DeleteLocationButton
                locationId={location._id}
                locationName={location.name}
              />
            </div>
          </div>
        )}

        {/* Overlay text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {location.name}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {location.altitude && (
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Mountain className="w-4 h-4" /> {location.altitude}
              </span>
            )}
            {location.distanceFromLeh && location.distanceFromLeh !== "0 km" && (
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <MapPin className="w-4 h-4" /> {location.distanceFromLeh} from Leh
              </span>
            )}
            {location.bestTimeToVisit && (
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Clock className="w-4 h-4" /> Best: {location.bestTimeToVisit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Description + Tips */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
              About {location.name}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {location.longDescription}
            </p>
          </div>

          {/* Highlights */}
          {location.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {location.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
                  >
                    <Star className="w-3 h-3" /> {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {location.travelTips.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Travel Tips
              </h3>
              <ul className="space-y-2.5">
                {location.travelTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1 w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 font-bold text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Related Blogs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedBlogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-amber-500/30 bg-card/20 hover:bg-card/40 transition-all"
                  >
                    {blog.thumbnail && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                        <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {blog.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-6">
          {/* Nearby Attractions */}
          {location.nearbyAttractions.length > 0 && (
            <div className="rounded-2xl border border-border/40 bg-card/20 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                Nearby Attractions
              </h3>
              <ul className="space-y-2">
                {location.nearbyAttractions.map((attr) => (
                  <li
                    key={attr}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {attr}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Image Gallery strip */}
          {location.images.length > 1 && (
            <div className="rounded-2xl border border-border/40 bg-card/20 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {location.images.slice(0, 4).map((src, i) => {
                  const isLast = i === 3;
                  const extraImagesCount = location.images.length - 4;
                  return (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 cursor-pointer relative group"
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={src}
                        alt={`${location.name} ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {isLast && extraImagesCount > 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="text-white text-xl font-bold">
                            +{extraImagesCount}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Related Packages
              </h3>
              <div className="space-y-3">
                {relatedPackages.map((pkg) => (
                  <Link
                    key={pkg.slug}
                    href={`/packages/${pkg.slug}`}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-amber-500/20 hover:border-amber-500/50 bg-black/20 hover:bg-black/40 transition-all"
                  >
                    {pkg.gallery?.[0] && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={pkg.gallery[0]} alt={pkg.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors line-clamp-1">
                        {pkg.title}
                      </p>
                      {pkg.duration && (
                        <p className="text-xs text-muted-foreground">{pkg.duration} Days</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View full page CTA */}
          <Link
            href={`/locations/${location.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border/50 hover:border-amber-500/40 text-sm font-semibold text-muted-foreground hover:text-amber-400 transition-all hover:bg-amber-500/5"
          >
            View Full Page
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 transition-colors z-[101]"
            onClick={prevImage}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative max-w-5xl max-h-[90vh] w-full px-16 md:px-24 flex flex-col items-center">
            <img
              src={location.images[currentImageIndex]}
              alt={`${location.name} ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain mx-auto cursor-default shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center text-white/70 text-sm font-medium">
              {currentImageIndex + 1} / {location.images.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 transition-colors z-[101]"
            onClick={nextImage}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
