"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HeroBlock } from "@/lib/blog-types";

interface Props {
  block: HeroBlock;
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`;
  return null;
}

export default function HeroBlock({ block }: Props) {
  const embedUrl = block.videoUrl ? getVideoEmbedUrl(block.videoUrl) : null;

  return (
    <div className="relative h-[70vh] min-h-[480px] rounded-3xl overflow-hidden mb-12 -mx-4 md:-mx-8 lg:-mx-16">
      {/* Background */}
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full object-cover"
          allow="autoplay; fullscreen"
          frameBorder="0"
          title="Hero Video"
          style={{ pointerEvents: "none", width: "100%", height: "100%" }}
        />
      ) : block.imageUrl ? (
        <Image
          src={block.imageUrl}
          alt={block.title || "Hero image"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {(block.author || block.readTime) && (
            <div className="flex items-center justify-center gap-3 mb-4 text-sm text-white/70">
              {block.author && <span>{block.author}</span>}
              {block.author && block.readTime && <span className="text-white/40">·</span>}
              {block.readTime && <span>{block.readTime}</span>}
            </div>
          )}
          {block.title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              {block.title}
            </h2>
          )}
          {block.subtitle && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">{block.subtitle}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
