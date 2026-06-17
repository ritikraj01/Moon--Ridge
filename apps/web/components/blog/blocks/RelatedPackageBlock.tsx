"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { RelatedPackageBlock } from "@/lib/blog-types";

interface PackageData {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  duration: number;
  pricing: number;
  gallery?: string[];
  description?: string;
}

interface Props {
  block: RelatedPackageBlock;
}

export default function RelatedPackageBlock({ block }: Props) {
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!block.packageSlug) return;
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/slug/${block.packageSlug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPkg)
      .catch(() => setError(true));
  }, [block.packageSlug]);

  if (error || (!pkg && block.packageSlug)) {
    return (
      <div className="my-10 p-6 rounded-2xl border border-border/40 bg-card/10 text-muted-foreground text-sm text-center">
        Package &quot;{block.packageSlug}&quot; not found.
      </div>
    );
  }

  if (!pkg) return null;

  const thumb = pkg.gallery?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="my-12"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">
        ✈ Related Package
      </p>
      <div className="rounded-2xl border border-amber-500/30 bg-card/20 overflow-hidden hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {thumb && (
            <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
              <Image
                src={thumb}
                alt={pkg.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 256px"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">{pkg.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-500" />
                  {pkg.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  {pkg.duration} Days
                </span>
              </div>
              {pkg.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pkg.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-2xl font-bold text-amber-400">
                  ₹{pkg.pricing.toLocaleString("en-IN")}
                </p>
              </div>
              <Link
                href={`/packages/${pkg.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded-xl transition-colors"
              >
                {block.ctaText || "Book This Package"}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
