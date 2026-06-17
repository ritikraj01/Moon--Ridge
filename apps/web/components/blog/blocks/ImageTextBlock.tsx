"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ImageTextBlock } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: ImageTextBlock;
}

export default function ImageTextBlock({ block }: Props) {
  const isLeft = block.position === "left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8 my-12 items-center`}
    >
      {/* Image */}
      <div className="w-full md:w-1/2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl group">
          {block.imageUrl ? (
            <Image
              src={block.imageUrl}
              alt={block.altText || ""}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-slate-600 text-sm">No image</span>
            </div>
          )}
        </div>
        {block.caption && (
          <p className="mt-2 text-center text-xs text-muted-foreground italic">{block.caption}</p>
        )}
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2">
        <MarkdownRenderer content={block.content} className="text-base leading-relaxed text-foreground/90" />
      </div>
    </motion.div>
  );
}
