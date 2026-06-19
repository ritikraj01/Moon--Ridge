"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type { MapBlock } from "@/lib/blog-types";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface Props {
  block: MapBlock;
}

export default function MapBlock({ block }: Props) {
  const hasCoordinates = block.latitude !== undefined && block.longitude !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10 rounded-2xl overflow-hidden border border-border/50 bg-card/20 relative"
    >
      {hasCoordinates ? (
        <LeafletMap
          lat={block.latitude!}
          lng={block.longitude!}
          zoom={block.zoom}
          address={block.address}
          caption={block.caption}
        />
      ) : block.embedUrl ? (
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
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-slate-900/50">
          <MapPin size={32} className="text-amber-500/60" />
          <p className="text-sm font-medium">{block.address || "Map location"}</p>
          <p className="text-xs text-muted-foreground/60">Coordinates required to display map</p>
        </div>
      )}
      
      {(!hasCoordinates && block.caption) && (
        <div className="px-4 py-3 border-t border-border/30 text-xs text-muted-foreground text-center">
          {block.caption}
        </div>
      )}
    </motion.div>
  );
}
