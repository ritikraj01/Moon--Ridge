"use client";

import { motion } from "framer-motion";
import type { VideoBlock } from "@/lib/blog-types";

interface Props {
  block: VideoBlock;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?/]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Cloudinary — direct video URL, use as-is
  if (url.includes("cloudinary.com") || url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return null; // handled separately as <video>
  }

  return url;
}

function isCloudinaryOrDirectVideo(url: string): boolean {
  return url.includes("cloudinary.com") || /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

export default function VideoBlock({ block }: Props) {
  if (!block.url) return null;

  const embedUrl = getEmbedUrl(block.url);
  const isDirect = isCloudinaryOrDirectVideo(block.url);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="my-10"
    >
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-border/30 shadow-xl">
        {isDirect ? (
          <video
            src={block.url}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={block.caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Invalid video URL
          </div>
        )}
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {block.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
