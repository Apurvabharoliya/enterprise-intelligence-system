"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out preloader
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    // Scan line animation
    tl.to(lineRef.current, {
      top: "100%",
      duration: 1.5,
      ease: "linear",
      repeat: 1,
      yoyo: true,
    }, 0);

    // Stagger text reveal
    tl.fromTo(
      textRefs.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "power3.out" },
      0.5
    );

    // Glitch / Pulse effect
    tl.to(
      textRefs.current,
      { opacity: 0.7, duration: 0.1, yoyo: true, repeat: 3 },
      "-=0.2"
    );

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F14] font-mono overflow-hidden"
    >
      <div 
        ref={lineRef} 
        className="absolute left-0 right-0 h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] -top-2 z-10"
      />
      
      <div className="relative z-20 flex flex-col items-center gap-6 text-center">
        <div className="flex gap-4">
          <div className="h-4 w-4 bg-emerald-500 animate-pulse rounded-xl-sm" />
          <div className="h-4 w-4 bg-amber-500 animate-pulse delay-100 rounded-xl-sm" />
          <div className="h-4 w-4 bg-violet-500 animate-pulse delay-200 rounded-xl-sm" />
        </div>
        
        <div className="flex flex-col gap-2 mt-8 overflow-hidden text-sm md:text-base tracking-widest uppercase">
          {["Initializing Gas Distribution Intel...", "Syncing EPC & Infrastructure Nodes...", "Loading Pharmaceutical Analytics..."].map((text, i) => (
            <div
              key={text}
              ref={(el) => { textRefs.current[i] = el; }}
              className={`font-semibold ${i === 0 ? "text-emerald-500" : i === 1 ? "text-amber-500" : "text-violet-500"}`}
            >
              {text}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-xs text-[#555555]/60 tracking-widest">
          ESTABLISHING SECURE CONNECTION TO INTELLI-SECTOR
        </div>
      </div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
    </div>
  );
}
