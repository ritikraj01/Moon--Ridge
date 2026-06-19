"use client";

import { motion } from "framer-motion";
import type { AudioPhraseBlock as AudioPhraseBlockType } from "@/lib/blog-types";
import { PhrasePlayButton } from "./PhrasePlayButton";

interface Props {
  block: AudioPhraseBlockType;
}

export default function AudioPhraseBlock({ block }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-6"
    >
      <PhrasePlayButton
        phrase={block.phrase}
        translation={block.translation}
        audioUrl={block.audioUrl}
        note={block.note}
      />
    </motion.div>
  );
}
