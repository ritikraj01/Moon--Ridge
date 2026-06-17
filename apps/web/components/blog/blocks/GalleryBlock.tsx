"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryBlock } from "@/lib/blog-types";

interface Props {
  block: GalleryBlock;
}

export default function GalleryBlock({ block }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const columns = block.columns ?? 3;
  const images = block.images ?? [];

  if (images.length === 0) return null;

  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns];

  const prev = () => setLightboxIdx((i) => (i === null ? null : i === 0 ? images.length - 1 : i - 1));
  const next = () => setLightboxIdx((i) => (i === null ? null : i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className={`grid ${colClass} gap-3 my-10`}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIdx(idx)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
          >
            <Image
              src={img.url}
              alt={img.altText || img.caption || `Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs text-center">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              {images[lightboxIdx] && (
                <>
                  <div className="relative w-full aspect-[16/10]">
                    <Image
                      src={images[lightboxIdx]!.url}
                      alt={images[lightboxIdx]!.altText || `Gallery ${lightboxIdx + 1}`}
                      fill
                      className="object-contain rounded-2xl"
                      sizes="100vw"
                      priority
                    />
                  </div>
                  {images[lightboxIdx]!.caption && (
                    <p className="text-center text-white/70 text-sm mt-3">{images[lightboxIdx]!.caption}</p>
                  )}
                  <p className="text-center text-white/40 text-xs mt-1">{lightboxIdx + 1} / {images.length}</p>
                </>
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
