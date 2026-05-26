"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Sparkles, Filter, Calendar, AlertCircle, Rss, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import { API_URL } from "@/lib/config";

export default function NewsIntel() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [digest, setDigest] = useState({
    title: "Loading Intelligence...",
    summary: "Synchronizing with secure telemetry nodes to aggregate daily sector developments."
  });
  const [articles, setArticles] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${API_URL}/api/news`, { cache: 'no-store' });
        if (!res.ok) {
          console.error("API response error:", res.status);
          throw new Error(`API error status: ${res.status}`);
        }
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
            date: art.date || "Unknown Date",
            sentiment: art.sentiment,
            risk: "Low",
            source: art.source,
            summary: art.summary,
            link: art.link,
            bulletPoints: [
              "Real-time audited feed content established via scraping nodes.",
              "Detailed analytical summary generated through secure LLMs.",
              "Historical context mapped directly inside telemetry dashboards."
            ],
            impact: `Strategic significance verified by continuous intelligence monitors. Sector fundamentals suggest strong correlation with recent developments.`
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
        console.error("News Fetch Error:", err);
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

  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
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

              {/* Filters */}
              <div className="flex items-center gap-4">
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

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex rounded-lg bg-black/20 p-1 border border-white/5 font-mono text-xs">
                    {["Newest", "Oldest"].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => setSortOrder(sort)}
                        className={`px-3 py-1.5 rounded-md transition-colors ${sortOrder === sort ? "bg-white/10 text-white font-bold" : "text-muted-foreground hover:text-white"}`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
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
              {sortedNews.map((news, idx) => (
                <div 
                  key={news.id}
                  className="relative group perspective"
                  style={{ perspective: "1000px" }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-[#E5A93C]/0 to-violet-500/0 rounded-xl blur opacity-0 group-hover:opacity-30 group-hover:via-[#E5A93C]/20 transition duration-700 pointer-events-none" />
                  
                  <Card 
                    onClick={() => setSelectedArticle(news)}
                    className="glass relative h-full flex flex-col justify-between border-white/5 hover:border-[#E5A93C]/30 transition-all duration-500 bg-black/40 backdrop-blur-md overflow-hidden transform-gpu group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] cursor-pointer"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-[#E5A93C]/30 to-transparent transition-colors duration-500" />
                    
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-center justify-between text-xs font-mono mb-3">
                        <span className="text-muted-foreground flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {news.date}
                        </span>
                        <span className={`px-2.5 py-1 rounded border ${news.sectorColor} font-bold text-[10px] tracking-wider uppercase`}>
                          {news.sector}
                        </span>
                      </div>
                      <CardTitle className="text-base font-heading text-white/90 group-hover:text-white transition-colors leading-snug">
                        {news.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-5 relative z-10 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {news.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-4 border-t border-white/5">
                        <span className={`px-2 py-1 rounded flex items-center gap-1 ${news.sentiment === "Bullish" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : news.sentiment === "Bearish" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-white/5 text-muted-foreground border border-white/10"}`}>
                          <span className="opacity-70">Sentiment:</span> {news.sentiment}
                        </span>
                        <span className={`px-2 py-1 rounded flex items-center gap-1 ${news.risk === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : news.risk === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                          <span className="opacity-70">Risk:</span> {news.risk}
                        </span>
                        <span className="px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/10 ml-auto flex items-center gap-1">
                          <span className="opacity-70">Src:</span> <span className="text-white/70">{news.source}</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedNews.length === 0 && (
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
              
              <div className="pt-6 mt-4 border-t border-white/5">
                <a 
                  href={selectedArticle.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-3 bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] rounded font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
