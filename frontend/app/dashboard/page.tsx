"use client";

import { useState, useEffect } from "react";
import Preloader from "@/components/preloader/Preloader";
import Sidebar from "@/components/dashboard/Sidebar";
import TopWidgets from "@/components/dashboard/TopWidgets";
import { Search, Bell, Command, Settings, ShieldAlert, ArrowUpRight, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const mockTenderData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 180 },
  { name: "Mar", value: 150 },
  { name: "Apr", value: 240 },
  { name: "May", value: 290 },
  { name: "Jun", value: 380 },
];

const mockSectorHeatmap = [
  { name: "Gas Distribution", value: 450, color: "#10B981" },
  { name: "EPC & Infra", value: 680, color: "#F59E0B" },
  { name: "Pharma API", value: 310, color: "#8B5CF6" },
];

const mockFeed = [
  {
    id: 1,
    time: "May 20, 2026",
    sector: "Gas & LNG",
    title: "GAIL announces new pipeline expansion in Western Grid",
    summary: "Estimated investment at ₹10,000 Cr with tenders opening next month.",
    risk: "Low",
    link: "#",
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  },
  {
    id: 2,
    time: "May 19, 2026",
    sector: "Pharma API",
    title: "FDA approves API facility for Sun Pharma in Gujarat",
    summary: "Successful audit completed. Production to scale by 40% in Q3.",
    risk: "None",
    link: "#",
    color: "border-violet-500/30 text-violet-400 bg-violet-500/5",
  }
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<any[]>(mockFeed);
  const [sectorHeatmap, setSectorHeatmap] = useState<any[]>(mockSectorHeatmap);
  const [tenderData, setTenderData] = useState<any[]>(mockTenderData);
  const [isLive, setIsLive] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " IST");
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " IST");
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [newsRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/api/news`),
          fetch(`${API_URL}/api/analytics`)
        ]);

        if (newsRes.ok && analyticsRes.ok) {
          const newsData = await newsRes.json();
          const analyticsData = await analyticsRes.json();

          // Map news to dashboard feed items
          const mappedFeed = newsData.articles.map((art: any, index: number) => ({
            id: index + 1,
            time: art.date,
            sector: art.sector,
            title: art.title,
            summary: art.summary,
            link: art.link,
            risk: "Low",
            color: art.sector === "Gas & LNG" 
              ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
              : art.sector === "Pharma API"
              ? "border-violet-500/30 text-violet-400 bg-violet-500/5"
              : "border-amber-500/30 text-amber-400 bg-amber-500/5"
          }));
          setFeed(mappedFeed);

          // Map monthly aggregates into line graph values
          const mappedTenders = analyticsData.monthly.map((m: any) => ({
            name: m.name,
            value: m.epc
          }));
          setTenderData(mappedTenders);

          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend API offline, utilizing static local dashboard sets.");
      }
    }
    if (!loading) {
      loadDashboardData();
    }
  }, [loading]);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Sidebar />
          
          <main className="flex-1 flex flex-col relative overflow-hidden">
            {/* Topbar */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-4 w-full max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search intelligence, companies, tenders..." 
                    className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary/50 h-9 font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      <Command className="w-3 h-3" /> K
                    </kbd>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-px h-6 bg-border mx-2" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">SYSTEM ONLINE</span>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Executive Dashboard</h2>
                    <p className="text-sm text-muted-foreground mt-1">Real-time intelligence overview across Gas, EPC, and Pharma sectors.</p>
                  </div>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${isLive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse" : "bg-white/5 text-muted-foreground border-white/10"}`}>
                      {isLive ? "● SECURE FEED LIVE" : "OFFLINE FALLBACK"}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10">
                      {currentDate || "UTC +5:30"}
                    </span>
                  </div>
                </div>

                <TopWidgets />

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Left Column (Charts & Maps) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recharts Heatmap */}
                    <div className="h-96 rounded-xl glass border border-white/5 p-5 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                      <h3 className="font-heading font-medium text-lg mb-4 flex items-center justify-between">
                        <span>Sector Distribution Analysis</span>
                        <span className="text-xs font-mono text-muted-foreground">Market share (%)</span>
                      </h3>
                      <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sectorHeatmap}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} 
                              labelClassName="font-mono text-white"
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                              {sectorHeatmap.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Recharts Line */}
                    <div className="h-96 rounded-xl glass border border-white/5 p-5 flex flex-col relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10" />
                      <h3 className="font-heading font-medium text-lg mb-4 flex items-center justify-between">
                        <span>Tender Value Analytics (₹ Cr)</span>
                        <span className="text-xs font-mono text-primary flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +24% QoQ</span>
                      </h3>
                      <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={tenderData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                              labelClassName="font-mono text-white"
                            />
                            <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Live Feeds) */}
                  <div className="space-y-6">
                    <div className="h-[49rem] rounded-xl glass border border-white/5 p-5 flex flex-col relative overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-medium text-lg flex items-center gap-2">
                          Live Intelligence Feed
                        </h3>
                        <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">AI FILTERED</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {feed.map((item) => (
                          <a 
                            key={item.id} 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#E5A93C]/30 hover:bg-black/60 transition-all duration-300 flex flex-col gap-2 relative group transform-gpu hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] cursor-pointer"
                          >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-[#E5A93C]/30 to-transparent transition-colors duration-500" />
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-muted-foreground">{item.time}</span>
                              <span className={`px-2 py-0.5 rounded border ${item.color}`}>
                                {item.sector}
                              </span>
                            </div>
                            <h4 className="font-heading font-medium text-sm text-white/90 group-hover:text-white transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>
                            <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5 text-[10px] font-mono">
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Sentiment: Positive
                              </span>
                              {item.risk !== "None" && (
                                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3" /> Risk: {item.risk}
                                </span>
                              )}
                            </div>
                          </a>
                        ))}

                        <div className="p-4 rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
                          <p>Waiting for incoming intelligence streams...</p>
                          <span className="mt-1 font-mono text-[10px] text-emerald-500 animate-pulse">● POLLING RSS FEEDS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
