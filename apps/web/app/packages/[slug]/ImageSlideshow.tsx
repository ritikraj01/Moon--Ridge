"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSlideshowProps {
  gallery: string[];
  title: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop";

export default function ImageSlideshow({ gallery, title }: ImageSlideshowProps) {
  const images = gallery && gallery.length > 0 ? gallery : [DEFAULT_IMAGE];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Autoplay effect
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [images.length, isHovered, nextSlide]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {images.map((url, idx) => (
        <div
          key={url + idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={url}
            alt={`${title} - Gallery Slide ${idx + 1}`}
            fill
            className={`object-cover transition-transform duration-[4500ms] ease-out ${
              idx === currentIdx ? "scale-105" : "scale-100"
            }`}
            sizes="100vw"
            priority={idx === 0}
            unoptimized
          />
        </div>
      ))}

      {/* Dark overlay to make text highly readable */}
      <div className="absolute inset-0 bg-black/40 z-20" />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all active:scale-95 group"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all active:scale-95 group"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Pagination Indicator Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIdx ? "w-8 bg-amber-500" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
