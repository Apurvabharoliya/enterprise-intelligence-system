"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Sparkles, Filter, Calendar, AlertCircle, Rss } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const API_URL = "http://localhost:8000";

const mockNews = [
  {
    id: 1,
    title: "Morbi Ceramic Cluster Demands 15% Gas Supply Increase",
    sector: "Gas & LNG",
    sectorColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    date: "May 20, 2026",
    sentiment: "Bullish",
    risk: "Low",
    source: "PNGRB Watcher",
    summary: "Local city gas providers are requesting emergency pipeline load increases from the Central grid. High logistics demand pushes regional tariffs.",
    bulletPoints: [
      "Morbi clusters demand high gas capacity allocations.",
      "Requires temporary high-pressure pipelines activations.",
      "PNGRB reviewing tariff adjustments scheduled next week."
    ],
    impact: "Provides short term bullish gas sales volume."
  },
  {
    id: 2,
    title: "Sun Pharma Halol API Plant Concludes Clean Audit",
    sector: "Pharma API",
    sectorColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    date: "May 20, 2026",
    sentiment: "Bullish",
    risk: "Low",
    source: "FDA Sentinel",
    summary: "FDA regulatory officers concluded a 5-day procedural inspection with zero critical form 483 warnings. Unit remains at highest compliance level.",
    bulletPoints: [
      "Observations were minimal and not linked to generic failures.",
      "Maintains continuous export clearances to primary European channels.",
      "Clean status provides strong structural support to API portfolios."
    ],
    impact: "Maintains optimal margins on generic active syntheses."
  },
  {
    id: 3,
    title: "L&T Emerges as Lowest Bidder for Hydrological Power Unit",
    sector: "EPC & Infra",
    sectorColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    date: "May 20, 2026",
    sentiment: "Bullish",
    risk: "Low",
    source: "NHPC Tenders",
    summary: "The civil infrastructure giant submitted a ₹3,140 Crore bid for regional hydrological water corridor projects in Maharashtra. Bidding competitors trailing by 8%.",
    bulletPoints: [
      "L&T infrastructure leads the bid threshold margins.",
      "Project completion schedule target set at 36 months.",
      "Guarantees continuous cement and structural steel procurements."
    ],
    impact: "Fosters steady civil sector segment growth vectors."
  }
];

export default function NewsIntel() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [alertConfigured, setAlertConfigured] = useState(false);
  const [digest, setDigest] = useState({
    title: "Morbi Ceramic demand grid upgrades; record bidding blocks.",
    summary: "AI aggregated summaries indicate local city gas providers requesting emergency pipeline volume loads. High logistics demands push tariffs while Pharma API audits conclude clean."
  });
  const [articles, setArticles] = useState<any[]>(mockNews);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${API_URL}/api/news`);
        if (res.ok) {
          const data = await res.json();
          // Map backend response structures into identical frontend variables
          const mappedArticles = data.articles.map((art: any, index: number) => ({
            id: index + 1,
            title: art.title,
            sector: art.sector,
            sectorColor: art.sector === "Gas & LNG" 
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : art.sector === "Pharma API"
              ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20",
            date: "May 20, 2026",
            sentiment: art.sentiment,
            risk: "Low",
            source: art.source,
            summary: art.summary,
            bulletPoints: [
              "Real-time audited feed content established via scraping nodes.",
              "Detailed analytical summary generated through secure LLMs.",
              "Historical context mapped directly inside telemetry dashboards."
            ],
            impact: `Dynamic impact: ${art.summary.slice(0, 50)}...`
          }));
          
          setArticles(mappedArticles);
          if (data.digest) {
            setDigest({
              title: data.digest.title,
              summary: data.digest.summary
            });
          }
          setIsLive(true);
        }
      } catch (err) {
        console.warn("FastAPI backend down, falling back to local news structures.");
      }
    }
    fetchNews();
  }, []);

  const filteredNews = articles.filter((item) => {
    const matchesSector = selectedSector === "All" || item.sector === selectedSector;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles, entities, regulations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary/50 h-9 font-mono text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-mono font-medium transition-colors cursor-pointer">
                <Rss className="w-3.5 h-3.5" /> Daily Alerts Setup
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-heading text-lg flex items-center gap-2 text-[#E5A93C]">
                    <Sparkles className="w-5 h-5" /> Config AI Daily Digest Alert
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-xs text-muted-foreground">
                    Get an automated, concise summary of regulatory news, tender wins, and compliance warnings delivered to your channels every morning at 08:00 AM local time.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground">Notification Channels</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded border border-white/5 bg-black/25 flex flex-col items-center gap-1 cursor-pointer hover:border-primary/40 text-center">
                        <span className="text-[10px] font-mono text-emerald-400">Telegram Bot</span>
                        <input type="checkbox" defaultChecked className="mt-1" />
                      </div>
                      <div className="p-2.5 rounded border border-white/5 bg-black/25 flex flex-col items-center gap-1 cursor-pointer hover:border-primary/40 text-center">
                        <span className="text-[10px] font-mono text-emerald-400">WhatsApp API</span>
                        <input type="checkbox" defaultChecked className="mt-1" />
                      </div>
                      <div className="p-2.5 rounded border border-white/5 bg-black/25 flex flex-col items-center gap-1 cursor-pointer hover:border-primary/40 text-center">
                        <span className="text-[10px] font-mono text-emerald-400">Secure Email</span>
                        <input type="checkbox" defaultChecked className="mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground">Intelligence Sectors</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400">Gas & LNG</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400">EPC & Infra</Badge>
                      <Badge className="bg-violet-500/20 text-violet-400">Pharma API</Badge>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAlertConfigured(true)}
                    className="w-full py-2.5 bg-[#E5A93C] text-black font-semibold rounded text-sm tracking-wide uppercase hover:bg-white transition-colors"
                  >
                    {alertConfigured ? "✓ Daily Alerts Subscribed" : "Deploy Subscription"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-heading tracking-tight flex items-center gap-2">
                  <Rss className="w-6 h-6 text-primary" /> Sector News Intelligence
                </h2>
                <p className="text-sm text-muted-foreground mt-1">AI-extracted industry signals, regulatory audits, and structural updates.</p>
              </div>

              {/* Sector Selector */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex rounded-lg bg-black/20 p-1 border border-white/5 font-mono text-xs">
                  {["All", "Gas & LNG", "EPC & Infra", "Pharma API"].map((sector) => (
                    <button
                      key={sector}
                      onClick={() => setSelectedSector(sector)}
                      className={`px-3 py-1.5 rounded-md transition-colors ${selectedSector === sector ? "bg-white/10 text-white font-bold" : "text-muted-foreground hover:text-white"}`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-950/20 via-[#0A1912]/40 to-violet-950/20 border border-white/5 p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-full bg-[#E5A93C]/5 blur-3xl -z-10" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#E5A93C]/10 border border-[#E5A93C]/20 rounded-lg text-[#E5A93C] flex-shrink-0 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#E5A93C] uppercase tracking-widest">AI Aggregated Executive Digest</span>
                    <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-muted-foreground border-white/10"}`}>
                      {isLive ? "SECURE FEED ACTIVE" : "OFFLINE STATIC DIGEST"}
                    </span>
                  </div>
                  <h3 className="font-heading font-medium text-base text-white">
                    {digest.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
                    {digest.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((news) => (
                <Card 
                  key={news.id} 
                  className="glass hover:border-white/10 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedArticle(news)}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#E5A93C]/20 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {news.date}
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${news.sectorColor} font-bold text-[10px]`}>
                        {news.sector}
                      </span>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {news.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-2 border-t border-white/5">
                      <span className={`px-2 py-0.5 rounded ${news.sentiment === "Bullish" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : news.sentiment === "Bearish" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-white/5 text-muted-foreground border border-white/10"}`}>
                        Sentiment: {news.sentiment}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${news.risk === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : news.risk === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        Risk: {news.risk}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10 ml-auto">
                        Source: {news.source}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredNews.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-heading font-medium text-white mb-1">No Intelligence Found</h3>
                <p className="text-xs text-muted-foreground">Try adjusting your query or sector filter.</p>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Article Detail Panel */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-full bg-[#111827] border-l border-white/10 p-8 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-[#E5A93C] uppercase tracking-wider">// AI Analysis Insights</span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 hover:bg-white/5 text-muted-foreground hover:text-white rounded"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                  {selectedArticle.date}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[#E5A93C] text-xs font-mono">
                  {selectedArticle.sector}
                </span>
              </div>

              <h1 className="font-heading text-2xl font-bold leading-tight text-white">
                {selectedArticle.title}
              </h1>

              <div className="p-4 rounded bg-black/30 border border-white/5 space-y-2">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">AI Generated Summary</h3>
                <p className="text-sm text-[#F3F4F6] leading-relaxed">
                  {selectedArticle.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Key Structural Points</h3>
                <ul className="space-y-2 text-sm text-[#9CA3AF]">
                  {selectedArticle.bulletPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#E5A93C] font-mono mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Strategic Business Impact</h3>
                <p className="text-sm text-emerald-400 font-medium">
                  {selectedArticle.impact}
                </p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-12 flex gap-4">
              <button className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded font-mono text-xs uppercase tracking-widest transition-colors">
                Share Securely
              </button>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="flex-1 py-3 bg-[#E5A93C] text-black font-bold rounded font-mono text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                Done Auditing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
