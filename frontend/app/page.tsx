"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowRight, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  ChevronDown, 
  TrendingUp, 
  Zap, 
  Building2, 
  Layers, 
  Sparkles, 
  Maximize2,
  RefreshCw,
  Clock,
  Compass
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const textWordsRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Magnetic Button Logic
  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const ctaSpringX = useSpring(ctaX, springConfig);
  const ctaSpringY = useSpring(ctaY, springConfig);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ctaX.set(x * 0.35);
    ctaY.set(y * 0.35);
  };

  const handleCtaMouseLeave = () => {
    ctaX.set(0);
    ctaY.set(0);
  };

  // 1. Live Particles Canvas inside Hero Background
  useEffect(() => {
    if (!welcomeComplete) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speedY: number; opacity: number }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Populate particles
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(17, 17, 17, 0.15)";
      
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17, 17, 17, ${p.opacity})`;
        ctx.shadowColor = "#111111";
        ctx.shadowBlur = 4;
        ctx.fill();
      });

      // Subtle high-tech horizontal sweep line
      const sweepY = (Date.now() / 25) % (canvas.height * 2.5);
      if (sweepY < canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(canvas.width, sweepY);
        ctx.strokeStyle = "rgba(17, 17, 17, 0.03)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [welcomeComplete]);

  // 2. Welcome Preloader and GSAP Timeline Setup
  useEffect(() => {
    const preloaderTimeline = gsap.timeline({
      onComplete: () => {
        gsap.to(".preloader-wrap", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => setWelcomeComplete(true)
        });
      }
    });

    preloaderTimeline.fromTo(".preloader-text-1", 
      { opacity: 0, scale: 0.9, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
    );

    preloaderTimeline.to(".preloader-text-1", 
      { opacity: 0, y: -20, filter: "blur(4px)", duration: 0.4, delay: 0.6 }
    );

    preloaderTimeline.fromTo(".preloader-text-2", 
      { opacity: 0, scale: 0.9, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
    );

    preloaderTimeline.to(".preloader-text-2", 
      { opacity: 0, y: -20, filter: "blur(4px)", duration: 0.4, delay: 0.8 }
    );

    preloaderTimeline.fromTo(".preloader-core-message",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    );

    preloaderTimeline.to(".preloader-core-message", 
      { opacity: 0, y: -50, duration: 0.6, delay: 1.2 }
    );
  }, []);

  // 3. Main Page GSAP Triggers (Runs after Preloader completes)
  useEffect(() => {
    if (!welcomeComplete) return;

    // Smooth Scroll initialization (Lenis)
    let lenis: any;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    })();

    // Navbar Entry Reveal
    gsap.fromTo(navbarRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    ScrollTrigger.create({
      start: "top -80",
      onEnter: () => {
        navbarRef.current?.classList.add("scrolled");
      },
      onLeaveBack: () => {
        navbarRef.current?.classList.remove("scrolled");
      }
    });

    // Hero Background Parallax
    gsap.fromTo(".hero-bg", 
      { yPercent: 0 },
      {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Hero Text Stagger
    gsap.fromTo(".hero-title-char", 
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.04, ease: "power4.out", delay: 0.2 }
    );

    gsap.fromTo(".hero-sub", 
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 }
    );

    // About Manifesto Typography Scroll Reveal
    if (textWordsRef.current) {
      const text = textWordsRef.current;
      const textContent = text.textContent || "";
      const words = textContent.split(" ");
      text.innerHTML = words.map(word => `<span class="about-word inline-block mr-[0.3em] text-[#D9CFC1] transition-colors duration-300 font-light">${word}</span>`).join("");
      
      const wordSpans = text.querySelectorAll(".about-word");
      
      gsap.to(wordSpans, {
        color: "#111111",
        fontWeight: "900",
        stagger: 0.08,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.5,
        }
      });
    }

    // --- Elegant Card Stacking (Vertical Deck Pinning) ---
    const cards = gsap.utils.toArray(".sector-card");
    cards.forEach((card: any, index: number) => {
      // Don't scale down the very last card
      if (index === cards.length - 1) return;

      gsap.to(card, {
        scale: 0.93,
        yPercent: -4,
        opacity: 0.45,
        filter: "blur(2px)",
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight}`,
          scrub: true,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        }
      });
    });

    // Stagger Metrics Grid Entrance
    gsap.fromTo(".grid-card", 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".grid-cards-trigger",
          start: "top 75%",
        }
      }
    );

    // Magnetic Reactor Glow growing on Scroll
    gsap.fromTo(".reactor-core",
      { scale: 0.85, opacity: 0.3, filter: "drop-shadow(0 0 20px rgba(17,17,17,0.15))" },
      {
        scale: 1.15,
        opacity: 0.85,
        filter: "drop-shadow(0 0 80px rgba(17,17,17,0.65))",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top bottom",
          end: "top 20%",
          scrub: true
        }
      }
    );

    return () => {
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [welcomeComplete]);

  return (
    <div className="bg-[#FAF7F2] text-[#111111] min-h-screen overflow-x-hidden font-sans selection:bg-[#111111]/20 selection:text-[#111111]">
      
      {/* 1. Preloader Overlay */}
      {!welcomeComplete && (
        <div className="preloader-wrap fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFFFF] [clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_0%_100%)]">
          <div className="text-center px-4 max-w-2xl relative z-10 flex flex-col items-center">
            
            <div className="preloader-text-1 font-mono text-[#FF3366] text-xs uppercase tracking-[0.3em] mb-4">
              Secure Stream Established
            </div>
            
            <h2 className="preloader-text-2 font-heading text-lg md:text-xl text-[#33CCFF] tracking-wider font-bold mb-8">
              Gas / EPC / Pharmaceutical Core API
            </h2>

            <div className="preloader-core-message flex flex-col items-center gap-6">
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#FFCC00] to-transparent" />
              <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-extrabold tracking-tight uppercase leading-none">
                DECISION MAKER<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] via-[#FFCC00] to-[#00FF99]">REDISTRIBUTED.</span>
              </h1>
              <p className="font-mono text-xs text-[#555555] tracking-widest uppercase mt-4">
                Booting IntelliSector System Core
              </p>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(51,204,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(51,204,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3366] via-[#FFCC00] to-[#00FF99] shadow-[0_0_20px_rgba(255,51,102,0.4)] animate-bounce" />
        </div>
      )}

      {/* 2. Floating Navbar */}
      <header 
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 flex items-center justify-between px-6 md:px-12 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#111111] to-[#333333] flex items-center justify-center shadow-lg shadow-[#D9CFC1] border border-[#D9CFC1]">
            <Layers className="w-4 h-4 text-[#111111] font-extrabold" />
          </div>
          <span className="font-heading font-black text-lg tracking-wider text-[#111111]">
            INTELLI<span className="text-[#111111] font-light">SECTOR</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 pointer-events-auto font-mono text-xs uppercase tracking-widest text-[#333333]">
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#111111] transition-colors hover:shadow-[0_2px_0_rgba(17,17,17,0.5)] cursor-pointer">MANIFESTO</a>
          <a href="#sectors" onClick={(e) => { e.preventDefault(); document.getElementById('sectors')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#111111] transition-colors cursor-pointer">SECTOR CORES</a>
          <a href="#impact" onClick={(e) => { e.preventDefault(); document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#111111] transition-colors cursor-pointer">CAPACITIES</a>
          <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#111111] transition-colors cursor-pointer">CONNECT</a>
        </nav>

        <div className="pointer-events-auto">
          <Link href="/dashboard">
            <button className="relative group px-5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9CFC1] hover:border-[#111111] transition-all duration-300 font-mono text-xs uppercase tracking-widest text-[#111111] overflow-hidden backdrop-blur-sm cursor-pointer">
              <span className="relative z-10 flex items-center gap-2 group-hover:text-[#FAF7F2] transition-colors font-bold">
                Command Center <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <div className="absolute inset-0 bg-[#111111] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
            </button>
          </Link>
        </div>
      </header>

      {/* 3. Hero Section (Parallax Tech Grid Overlay) */}
      <section 
        ref={heroRef}
        className="relative h-screen flex flex-col justify-center px-6 md:px-24 overflow-hidden border-b border-[#D9CFC1]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />

        <div className="hero-bg absolute inset-0 -z-20 w-full h-[125%] origin-top">
          <div className="absolute inset-0 bg-[#FAF7F2] z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.012)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-[#111111]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-[#333333]/5 rounded-full blur-3xl" />
        </div>

        {/* Tech cyber corners */}
        <div className="absolute top-24 left-12 font-mono text-[9px] text-[#333333]/40 hidden lg:block tracking-widest leading-relaxed">
          SECURE SECTOR STREAM GRID 2.10<br />
          COORDINATES: 22.3072° N, 73.1812° E
        </div>
        <div className="absolute bottom-24 right-12 font-mono text-[9px] text-[#333333]/40 hidden lg:block text-right tracking-widest leading-relaxed">
          UPTIME STATUS: ACTIVE NODE<br />
          ENCRYPTION: SHIELDED SSL
        </div>

        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/5 border border-[#D9CFC1] text-[10px] font-mono tracking-widest text-[#111111] mb-6 uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#111111]" /> Advanced Institutional Surveillance
          </div>
          
          <h1 className="font-heading text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.95] text-[#111111]">
            {Array.from("PREDICTIVE").map((char, index) => (
              <span key={index} className="hero-title-char inline-block">{char}</span>
            ))}
            <br />
            <span className="text-gradient">INDUSTRIAL INTEL</span>
          </h1>

          <p className="hero-sub font-sans text-base md:text-lg text-[#333333] max-w-2xl mt-8 font-light leading-relaxed">
            Consolidating multi-channel signals, AI audit observations, and global pipeline metrics across 
            <span className="text-[#111111] font-medium"> Gas Distribution</span>, 
            <span className="text-[#111111] font-medium"> EPC Infrastructure</span>, and 
            <span className="text-[#111111] font-medium"> Pharmaceutical API Labs</span>.
          </p>

          <div className="hero-sub mt-10 flex flex-wrap gap-4">
            <Link href="/dashboard">
              <button className="px-8 py-4 rounded-xl bg-[#111111] text-[#FAF7F2] font-extrabold text-xs tracking-widest uppercase hover:bg-[#FAF7F2] hover:text-[#111111] border hover:border-[#111111] transition-colors duration-300 shadow-xl shadow-[#D9CFC1] flex items-center gap-3 cursor-pointer">
                Enter Command Center <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#about">
              <button className="px-8 py-4 rounded-xl bg-[#FAF7F2]/5 border border-[#111111] hover:bg-[#111111] hover:text-[#FAF7F2] text-[#111111] font-extrabold text-xs tracking-widest uppercase transition-colors duration-300 cursor-pointer">
                Read Manifesto
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#333333]/60">Initiate System</span>
          <ChevronDown className="w-4 h-4 text-[#111111] animate-bounce" />
        </div>
      </section>

      {/* 4. About Manifesto (Creative Grid & Typography) */}
      <section 
        id="about"
        ref={aboutRef}
        className="relative py-36 px-6 md:px-24 bg-[#FAF7F2] border-b border-[#D9CFC1] overflow-hidden flex flex-col justify-center min-h-[85vh]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="absolute -left-20 top-1/4 text-[#111111]/[0.02] font-heading font-black text-[15rem] leading-none whitespace-nowrap transform -rotate-90 pointer-events-none select-none">
          MANIFESTO
        </div>
        <div className="absolute right-0 bottom-0 text-[#111111]/[0.02] font-heading font-black text-[12rem] leading-none whitespace-nowrap pointer-events-none select-none">
          THE VISION
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-[#FAF7F2] mb-8 bg-[#111111] inline-block px-4 py-2 rounded-full shadow-lg">
            // Core Operational Ethos
          </div>

          <p 
            ref={textWordsRef}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-snug"
          >
            We process millions of multi-channel industrial data points every minute. From pipeline expansions and regulatory filings to API manufacturing certifications and high-value EPC tenders. Our intelligence layer maps high-impact events, generates verified executive summaries, and delivers instant secure notification alerts directly to decision-makers. No noise. Pure signal.
          </p>
        </div>
      </section>

      {/* 5. Ongoing Sectors Stack Section (Vertical Pinning Stacking) */}
      <div 
        id="sectors"
        className="relative bg-[#FAF7F2]"
      >
        {/* Section title (pinned or standard heading) */}
        <div className="py-12 bg-[#FAF7F2] border-b border-[#D9CFC1] text-center">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#111111]">// Sector Intelligence Cores</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase text-[#111111] mt-2">Active Surveillance Streams</h2>
        </div>

        {/* Card Stacks */}
        <div className="sectors-stack relative w-full flex flex-col">
          
          {/* Card 1: Gas Distribution & LNG */}
          <section className="sector-card sticky top-0 w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white border-b border-[#D9CFC1] relative overflow-hidden">
            <div className="absolute top-12 right-12 font-mono text-sm text-[#111111] border border-[#111111]/20 px-3 py-1 bg-[#111111]/5 rounded-xl">01 / 03</div>
            
            <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#111111]/10 flex items-center justify-center text-[#111111] border border-[#111111]/20 shadow-md">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111111] font-semibold">// Gas Distribution & LNG</span>
                <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-[#111111] leading-none">
                  Smart Grids &<br />
                  <span className="text-[#111111]">LNG Sourcing</span>
                </h2>
                <p className="text-[#333333] text-sm md:text-base font-light leading-relaxed">
                  Surveillance on regional pipeline gas pressure levels, new city gas network distribution licenses, global cargo vessels arrivals, and tariff modification filings.
                </p>
                <div className="flex gap-3 font-mono text-[10px]">
                  <span className="px-3 py-1.5 rounded-full bg-[#111111]/5 border border-[#111111]/20 text-[#111111]">Grid Flow Logging</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#111111]/5 border border-[#111111]/20 text-[#111111]">PNGRB Filing Scrape</span>
                </div>
              </div>
              <div className="relative h-80 lg:h-[26rem] rounded-2xl border border-[#111111]/20 bg-[#FAF7F2] overflow-hidden flex flex-col justify-between p-8 group shadow-2xl shadow-[#D9CFC1]/40">
                {/* Visual telemetry grid inside the card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.02)_1px,transparent_1px)] bg-[size:15px_15px]" />
                <div className="flex justify-between items-start font-mono text-[9px] text-[#111111]/60 relative z-10">
                  <span>FLOW DIAGNOSTIC MATRIX</span>
                  <span>LIVE CORRELATION NODE</span>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 relative z-10">
                  <Activity className="w-14 h-14 text-[#111111] animate-pulse mb-3" />
                  <div className="text-3xl font-mono font-bold text-[#111111] tracking-wider">99.84 GCal/h</div>
                  <span className="text-[10px] text-[#555555] font-mono mt-1">MAIN SYSTEM PRESSURE BOUNDARY</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-[#555555] pt-4 border-t border-[#D9CFC1] relative z-10">
                  <span>GRID SYNC: SUCCESSFUL</span>
                  <span className="text-[#111111] animate-pulse">● STREAM LIVE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: EPC & Infrastructure */}
          <section className="sector-card sticky top-0 w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white border-b border-[#D9CFC1] relative overflow-hidden">
            <div className="absolute top-12 right-12 font-mono text-sm text-[#333333] border border-[#333333]/20 px-3 py-1 bg-[#333333]/5 rounded-xl">02 / 03</div>
            
            <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#333333]/10 flex items-center justify-center text-[#333333] border border-[#333333]/20 shadow-md">
                  <Building2 className="w-6 h-6 animate-bounce" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#333333] font-semibold">// EPC & Infrastructure</span>
                <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-[#111111] leading-none">
                  Mega Builds &<br />
                  <span className="text-[#333333]">Tender Pipelines</span>
                </h2>
                <p className="text-[#333333] text-sm md:text-base font-light leading-relaxed">
                  Aggregation of industrial tenders, bid logs, Joint Venture forms, and material cost indicators. Surveillance on heavy structures, bullet corridors, and refining divisions.
                </p>
                <div className="flex gap-3 font-mono text-[10px]">
                  <span className="px-3 py-1.5 rounded-full bg-[#333333]/5 border border-[#333333]/20 text-[#333333]">Contract Logs</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#333333]/5 border border-[#333333]/20 text-[#333333]">Bid Evaluation Core</span>
                </div>
              </div>
              <div className="relative h-80 lg:h-[26rem] rounded-2xl border border-[#333333]/20 bg-[#FAF7F2] overflow-hidden flex flex-col justify-between p-8 shadow-2xl shadow-[#D9CFC1]/40">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(51,51,51,0.02)_1px,transparent_1px)] bg-[size:15px_15px]" />
                <div className="flex justify-between items-start font-mono text-[9px] text-[#333333]/60 relative z-10">
                  <span>BID AGGREGATION SYSTEM</span>
                  <span>SURVEILLANCE MODE ON</span>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 relative z-10">
                  <Layers className="w-14 h-14 text-[#333333] mb-3" />
                  <div className="text-3xl font-mono font-bold text-[#111111] tracking-wider">₹1,20,000 Cr</div>
                  <span className="text-[10px] text-[#555555] font-mono mt-1">AGGREGATED RUNNING VALUE UNDER CAP</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-[#555555] pt-4 border-t border-[#D9CFC1] relative z-10">
                  <span>LOGS MATCHED: 104 TENDERS</span>
                  <span className="text-[#333333]">SURVEILLANCE NODE ACTIVE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: Pharmaceutical & API Manufacturing */}
          <section className="sector-card sticky top-0 w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white border-b border-[#D9CFC1] relative overflow-hidden">
            <div className="absolute top-12 right-12 font-mono text-sm text-[#555555] border border-[#555555]/20 px-3 py-1 bg-[#555555]/5 rounded-xl">03 / 03</div>
            
            <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#555555]/10 flex items-center justify-center text-[#555555] border border-[#555555]/20 shadow-md">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#555555] font-semibold">// Pharmaceutical & API</span>
                <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-[#111111] leading-none">
                  API Syntheses &<br />
                  <span className="text-[#555555]">FDA Compliance</span>
                </h2>
                <p className="text-[#333333] text-sm md:text-base font-light leading-relaxed">
                  Real-time extraction of FDA observations, patents expirations, biological drug developments, chemical feedstock pricing, and compliance audits for watched units.
                </p>
                <div className="flex gap-3 font-mono text-[10px]">
                  <span className="px-3 py-1.5 rounded-full bg-[#555555]/5 border border-[#555555]/20 text-[#555555]">FDA Form 483 Sweep</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#555555]/5 border border-[#555555]/20 text-[#555555]">Batch Synthesis Monitor</span>
                </div>
              </div>
              <div className="relative h-80 lg:h-[26rem] rounded-2xl border border-[#555555]/20 bg-[#FAF7F2] overflow-hidden flex flex-col justify-between p-8 shadow-2xl shadow-[#D9CFC1]/40">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(85,85,85,0.02)_1px,transparent_1px)] bg-[size:15px_15px]" />
                <div className="flex justify-between items-start font-mono text-[9px] text-[#555555]/60 relative z-10">
                  <span>REGULATORY SECURITY AUDIT</span>
                  <span>COMPLIANCE INDEX ACTIVE</span>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 relative z-10">
                  <ShieldAlert className="w-14 h-14 text-[#555555] animate-pulse mb-3" />
                  <div className="text-3xl font-mono font-bold text-[#111111] tracking-wider">0 Warning Observations</div>
                  <span className="text-[10px] text-[#555555] font-mono mt-1">TOTAL WATCHED SITES CLEAN</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-[#555555] pt-4 border-t border-[#D9CFC1] relative z-10">
                  <span>LAST SWEEP: 5 MINS AGO</span>
                  <span className="text-[#555555] animate-pulse">● MONITORING</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* 6. Social Impact & System Capacities (High-Tech Bento Grid UI) */}
      <section 
        id="impact"
        className="grid-cards-trigger relative py-36 px-6 md:px-24 bg-[#F2EFE9] border-t border-[#D9CFC1] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100%_40px] opacity-20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#111111]">// Performance Diagnostics</span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase text-[#111111]">System Capacity Metrics</h2>
            <div className="w-16 h-[1px] bg-[#111111] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Metric 1 */}
            <div className="grid-card p-8 rounded-2xl bg-[#FAF7F2]/[0.02] border border-[#D9CFC1] hover:border-[#111111]/40 hover:bg-[#FAF7F2]/[0.04] transition-all duration-300 flex flex-col justify-between h-80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#111111]/[0.02] rounded-xl-bl-full -z-10 transition-all group-hover:scale-125" />
              <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#111111]/30 group-hover:border-[#111111]" />
              <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#111111]/30 group-hover:border-[#111111]" />

              <div className="flex justify-between items-start">
                <TrendingUp className="w-8 h-8 text-[#111111] group-hover:rotate-12 transition-transform" />
                <span className="font-mono text-[9px] text-[#555555] uppercase tracking-widest">INGESTION SPEED</span>
              </div>
              <div className="space-y-2">
                <div className="font-heading text-5xl font-extrabold font-mono text-[#111111] tracking-tight">&lt; 1.2s</div>
                <h4 className="font-heading font-bold text-sm text-[#111111] uppercase tracking-wider mt-2">Data ingestion latency</h4>
                <p className="text-[#333333] text-xs font-light leading-relaxed">
                  Real-time pipeline flows and industrial tender bid openings appear instantaneously on analytical channels.
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="grid-card p-8 rounded-2xl bg-[#FAF7F2]/[0.02] border border-[#D9CFC1] hover:border-[#111111]/40 hover:bg-[#FAF7F2]/[0.04] transition-all duration-300 flex flex-col justify-between h-80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#111111]/[0.02] rounded-xl-bl-full -z-10 transition-all group-hover:scale-125" />
              <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#111111]/30 group-hover:border-[#111111]" />
              <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#111111]/30 group-hover:border-[#111111]" />

              <div className="flex justify-between items-start">
                <Sparkles className="w-8 h-8 text-[#111111] group-hover:rotate-12 transition-transform" />
                <span className="font-mono text-[9px] text-[#555555] uppercase tracking-widest">AI RECALL RATE</span>
              </div>
              <div className="space-y-2">
                <div className="font-heading text-5xl font-extrabold font-mono text-[#111111] tracking-tight">99.4%</div>
                <h4 className="font-heading font-bold text-sm text-[#111111] uppercase tracking-wider mt-2">LLM Digest Accuracy</h4>
                <p className="text-[#333333] text-xs font-light leading-relaxed">
                  Advanced fine-tuned NLP nodes summarize regulatory guidelines and complex tender PDFs without hallucinations.
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="grid-card p-8 rounded-2xl bg-[#FAF7F2]/[0.02] border border-[#D9CFC1] hover:border-[#555555]/40 hover:bg-[#FAF7F2]/[0.04] transition-all duration-300 flex flex-col justify-between h-80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#555555]/[0.02] rounded-xl-bl-full -z-10 transition-all group-hover:scale-125" />
              <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#555555]/30 group-hover:border-[#555555]" />
              <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#555555]/30 group-hover:border-[#555555]" />

              <div className="flex justify-between items-start">
                <Activity className="w-8 h-8 text-[#555555] group-hover:rotate-12 transition-transform" />
                <span className="font-mono text-[9px] text-[#555555] uppercase tracking-widest">MONITORED STREAMS</span>
              </div>
              <div className="space-y-2">
                <div className="font-heading text-5xl font-extrabold font-mono text-[#111111] tracking-tight">1,500+</div>
                <h4 className="font-heading font-bold text-sm text-[#111111] uppercase tracking-wider mt-2">Active Surveillance Sources</h4>
                <p className="text-[#333333] text-xs font-light leading-relaxed">
                  Scraping public records offices, tender boards, patent portals, shipping registers, and stock charts every second.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Interactive Call-To-Action (Magnetic Reactor Pulse background) */}
      <section 
        id="cta"
        className="cta-section relative py-36 px-6 md:px-24 bg-[#F2EFE9] overflow-hidden flex flex-col items-center justify-center text-center border-t border-[#D9CFC1]"
      >
        {/* Pulsing Fusion Reactor Core Glow in the background */}
        <div className="reactor-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#111111]/10 blur-[120px] -z-10 pointer-events-none transition-all duration-300" />
        
        <div className="max-w-3xl relative z-10 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[#111111]/10 flex items-center justify-center text-[#111111] border border-[#111111]/20 animate-pulse">
            <Layers className="w-5 h-5" />
          </div>
          
          <h2 className="font-heading text-4xl md:text-7xl font-black uppercase text-[#111111] leading-none tracking-tight">
            SECURE YOUR<br />
            <span className="text-gradient">INDUSTRIAL EDGE</span>
          </h2>
          
          <p className="text-[#333333] text-sm md:text-base max-w-xl font-light leading-relaxed">
            Transition your corporate intelligence workflow from slow manual tracking to continuous, automated notification alert grids. Deploy immediate surveillance nodes.
          </p>

          <Link href="/dashboard" className="relative mt-8 block pointer-events-auto">
            <button 
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              className="relative px-10 py-5 bg-[#111111] text-[#FAF7F2] font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-[#FAF7F2] hover:text-[#111111] border border-transparent hover:border-[#111111] transition-colors duration-300 shadow-2xl shadow-[#D9CFC1]/40 shadow-gray-300 overflow-hidden cursor-pointer"
            >
              <motion.div
                className="relative z-10 flex items-center gap-3"
                style={{ x: ctaSpringX, y: ctaSpringY }}
              >
                Access Command Center <ArrowRight className="w-4 h-4" />
              </motion.div>
            </button>
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="w-full max-w-6xl mx-auto border-t border-[#D9CFC1] mt-36 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[#333333]/40 text-[9px] font-mono tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-pulse" />
            <span>INTELLI-SECTOR CORE SYSTEM v2.10</span>
          </div>
          <div>
            <span>© 2026 INTELLI-SECTOR CORES. SYSTEMS ENCRYPTED.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#111111] transition-colors">Surveillance APIs</a>
            <a href="#" className="hover:text-[#111111] transition-colors">SSL Audit Certs</a>
          </div>
        </div>
      </section>
    </div>
  );
}
