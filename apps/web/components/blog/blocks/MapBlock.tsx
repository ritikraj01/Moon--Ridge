"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { MapBlock } from "@/lib/blog-types";

interface Props {
  block: MapBlock;
}

export default function MapBlock({ block }: Props) {
  // Map integration will be added in a future update.
  // For now show a placeholder with the address.

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10 rounded-2xl overflow-hidden border border-border/50 bg-card/20"
    >
      {block.embedUrl ? (
        <iframe
          src={block.embedUrl}
          width="100%"
          height="400"
          className="w-full border-0"
          allowFullScreen
          loading="lazy"
          title={block.caption || "Map"}
        />
      ) : (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <MapPin size={32} className="text-amber-500/60" />
          <p className="text-sm font-medium">{block.address || "Map location"}</p>
          <p className="text-xs text-muted-foreground/60">Map integration coming soon</p>
        </div>
      )}
      {block.caption && (
        <div className="px-4 py-3 border-t border-border/30 text-xs text-muted-foreground text-center">
          {block.caption}
        </div>
      )}
    </motion.div>
  );
}
