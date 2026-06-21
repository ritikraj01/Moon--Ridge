"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, Volume2 } from "lucide-react";

interface PhrasePlayButtonProps {
  phrase: string;
  translation: string;
  audioUrl: string;
  note?: string;
}

export function PhrasePlayButton({ phrase, translation, audioUrl, note }: PhrasePlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      setIsLoading(true);
      const audio = new Audio(audioUrl);
      audio.preload = "none";
      audioRef.current = audio;

      const onCanPlay = () => {
        setIsLoading(false);
        audio.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      };

      const onWaiting = () => setIsLoading(true);
      const onPlaying = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      const onTimeUpdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      const onError = () => {
        setIsLoading(false);
        setIsPlaying(false);
        alert("Could not load or play this audio phrase. Please check your network connection.");
      };

      audio.addEventListener("canplaythrough", onCanPlay);
      audio.addEventListener("waiting", onWaiting);
      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      audio.load();
    } else {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  useEffect(() => {
    if (audioUrl) {
      const tempAudio = new Audio(audioUrl);
      tempAudio.preload = "metadata";
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && tempAudio.duration !== Infinity) {
          setDuration(tempAudio.duration);
        }
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative overflow-hidden bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 md:px-5 md:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-amber-500/30 transition-all duration-300 shadow-md">
      {/* Playback progress bar background */}
      {progress > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-amber-500/40 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-start gap-3">
        <Volume2 size={18} className={`mt-1 shrink-0 text-amber-500 ${isPlaying ? "animate-pulse" : ""}`} />
        <div className="space-y-1">
          <span className="font-bold text-base text-white tracking-wide uppercase block leading-tight">{phrase}</span>
          <p className="text-sm text-[#d1d5db] font-medium leading-snug">{translation}</p>
          {note && <p className="text-xs text-slate-500 italic pt-0.5 leading-snug">{note}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePlayPause}
        className={`self-start sm:self-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 min-w-[110px] text-xs font-bold uppercase select-none shadow-sm ${
          isPlaying
            ? "bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
            : "bg-amber-500 text-black border-amber-600 hover:bg-amber-400"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Loading</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause size={14} fill="currentColor" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play size={14} fill="currentColor" />
            <span>{duration ? formatTime(duration) : "Play"}</span>
          </>
        )}
      </button>
    </div>
  );
}
