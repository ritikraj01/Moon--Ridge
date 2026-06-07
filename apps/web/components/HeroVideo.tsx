"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroVideo() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check sessionStorage for user preference
    const savedMutedState = sessionStorage.getItem("heroVideoMuted");
    if (savedMutedState !== null) {
      setIsMuted(savedMutedState === "true");
    }
  }, []);

  useEffect(() => {
    // Update video element when state changes
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    sessionStorage.setItem("heroVideoMuted", String(newMutedState));
  };

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/hero-background.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay to darken video so text is readable */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Sound Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-6 right-6 z-20 text-white hover:bg-black/40 bg-black/20 backdrop-blur-md rounded-full w-12 h-12 border border-white/10 transition-all hover:scale-105"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>
    </>
  );
}
