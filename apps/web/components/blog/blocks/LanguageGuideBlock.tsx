"use client";

import { motion } from "framer-motion";
import type { LanguageGuideBlock as LanguageGuideBlockType } from "@/lib/blog-types";
import { PhrasePlayButton } from "./PhrasePlayButton";

interface Props {
  block: LanguageGuideBlockType;
}

export default function LanguageGuideBlock({ block }: Props) {
  if (!block.phrases || block.phrases.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10 border border-slate-900 bg-slate-950/40 rounded-2xl px-6 py-5 md:px-8 md:py-6 space-y-5"
    >
      {block.title && (
        <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 border-b border-slate-900 pb-4">
          <span className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-lg" aria-hidden="true">🗣️</span>
          {block.title}
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.phrases.map((phrase, idx) => (
          <PhrasePlayButton
            key={idx}
            phrase={phrase.phrase}
            translation={phrase.translation}
            audioUrl={phrase.audioUrl}
          />
        ))}
      </div>
    </motion.div>
  );
}
