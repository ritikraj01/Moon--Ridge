"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ImageBlock } from "@/lib/blog-types";

interface Props {
  block: ImageBlock;
}

export default function ImageBlock({ block }: Props) {
  if (!block.imageUrl) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-10 rounded-2xl overflow-hidden"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl group">
        <Image
          src={block.imageUrl}
          alt={block.altText || block.caption || "Blog image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {block.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
