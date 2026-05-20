"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Plus, Eye, EyeOff, ShieldAlert, ArrowUpRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:8000";

const mockCompanies = [
  {
    id: "COMP-01",
    name: "GAIL (India) Limited",
    sector: "Gas & LNG",
    ticker: "GAIL.NS",
    price: "₹214.60",
    change: "+2.4%",
    direction: "up",
    marketCap: "$11.4B",
    risk: "Low",
    status: "Bidding for 12th City Gas blocks in Northeast grid.",
    monitored: true
  },
  {
    id: "COMP-02",
    name: "Larsen & Toubro (L&T)",
    sector: "EPC & Infra",
    ticker: "LT.NS",
    price: "₹3,420.50",
    change: "+4.8%",
    direction: "up",
    marketCap: "$56.2B",
    risk: "Low",
    status: "Won $1.1B viaduct engineering bid for Bullet Train corridor.",
    monitored: true
  },
  {
    id: "COMP-03",
    name: "Sun Pharmaceutical Industries",
    sector: "Pharma API",
    ticker: "SUNPHARMA.NS",
    price: "₹1,540.20",
    change: "-1.2%",
    direction: "down",
    marketCap: "$44.8B",
    risk: "Medium",
    status: "FDA procedural inspection concluded at Halol API facility.",
    monitored: true
  },
  {
    id: "COMP-04",
    name: "Linde India Limited",
    sector: "Gas & LNG",
    ticker: "LINDEINDIA.NS",
    price: "₹8,410.00",
    change: "+0.8%",
    direction: "up",
    marketCap: "$8.7B",
    risk: "Low",
    status: "Erection of new industrial cryogenic gas separator.",
    monitored: true
  },
  {
    id: "COMP-05",
    name: "Dr. Reddy's Laboratories",
    sector: "Pharma API",
    ticker: "REDDY.NS",
    price: "₹5,910.40",
    change: "-3.1%",
    direction: "down",
    marketCap: "$11.9B",
    risk: "High",
    status: "Received Form 483 with 3 observations for Srikakulam plant.",
    monitored: true
  }
];

export default function Watchlists() {
  const [watchlist, setWatchlist] = useState(mockCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicker, setNewTicker] = useState("");
  const [isLive, setIsLive] = useState(false);

  // Fetch watchlist from API on mount
  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const res = await fetch(`${API_URL}/api/watchlists`);
        if (res.ok) {
          const data = await res.json();
          setWatchlist(data);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend not running, falling back to local surveillance model data.");
      }
    }
    fetchWatchlist();
  }, []);

  const toggleWatch = async (id: string) => {
    // Optimistic UI updates
    setWatchlist(watchlist.map(c => c.id === id ? { ...c, monitored: !c.monitored } : c));

    try {
      await fetch(`${API_URL}/api/watchlists/${id}/toggle`, {
        method: "PATCH"
      });
    } catch (err) {
      console.warn("Failed to synchronize toggle with backend.");
    }
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker) return;
    
    const tickerClean = newTicker.trim().toUpperCase();

    // Optimistic fallback entry
    const localNewComp = {
      id: `COMP-${watchlist.length + 1}`,
      name: `${tickerClean} Industries`,
      sector: "EPC & Infra",
      ticker: `${tickerClean}.NS`,
      price: "₹150.00",
      change: "0.0%",
      direction: "up",
      marketCap: "$1.2B",
      risk: "Low",
      status: "Added to corporate surveillance queues.",
      monitored: true
    };

    try {
      const res = await fetch(`${API_URL}/api/watchlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: tickerClean, name: `${tickerClean} Industries`, sector: "EPC & Infra" })
      });
      
      if (res.ok) {
        const data = await res.json();
        setWatchlist([...watchlist, data.company]);
      } else {
        setWatchlist([...watchlist, localNewComp]);
      }
    } catch (err) {
      setWatchlist([...watchlist, localNewComp]);
    }
    
    setNewTicker("");
  };

  const filteredCompanies = watchlist.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                placeholder="Search watched companies or tickers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary/50 h-9 font-mono text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleAddTicker} className="flex gap-2">
              <Input 
                placeholder="Enter stock ticker..." 
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="bg-black/25 border-white/10 h-8 font-mono text-xs w-36"
              />
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#E5A93C] text-black text-xs font-mono font-bold hover:bg-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Watch
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-heading tracking-tight flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary" /> Corporate Watchlists
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Real-time stock feeds, market capitalization metrics, and strategic compliance alerts for key players.</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <RefreshCw className={`w-3 h-3 ${isLive ? "animate-spin text-emerald-500" : "text-amber-500"}`} /> 
                {isLive ? "SECURE LIVE FEED ACTIVE" : "OFFLINE FALLBACK MODEL"}
              </span>
            </div>

            {/* Watchlist Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompanies.map(comp => (
                <div 
                  key={comp.id} 
                  className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-56 ${comp.monitored ? "glass border-white/5" : "bg-black/10 border-white/5 opacity-50"}`}
                >
                  {/* Subtle decoration lines */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -z-10" />

                  {/* Header metadata */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-muted-foreground">{comp.ticker}</span>
                      <h3 className="font-heading font-bold text-white text-base leading-none">{comp.name}</h3>
                      <Badge className="bg-white/5 text-[#9CA3AF] border border-white/10 mt-1.5 text-[9px] uppercase font-mono tracking-wider">
                        {comp.sector}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleWatch(comp.id)}
                        className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                        title={comp.monitored ? "Stop Monitoring" : "Resume Monitoring"}
                      >
                        {comp.monitored ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Pricing info */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase">PRICE</span>
                      <span className="text-lg font-bold font-mono text-white mt-1 block">{comp.price}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase">CHANGE (24H)</span>
                      <span className={`text-sm font-bold font-mono mt-1.5 block flex items-center gap-1 ${comp.direction === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                        {comp.direction === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />} {comp.change}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#9CA3AF] block uppercase">RISK INDEX</span>
                      <span className={`text-xs font-bold font-mono mt-2 block flex items-center gap-1 ${comp.risk === "Low" ? "text-emerald-400" : comp.risk === "Medium" ? "text-amber-400" : "text-rose-400"}`}>
                        <ShieldAlert className="w-3.5 h-3.5" /> {comp.risk}
                      </span>
                    </div>
                  </div>

                  {/* Status alert feed */}
                  <div className="pt-3 mt-2 border-t border-dashed border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground truncate max-w-[20rem]">{comp.status}</span>
                    <span className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">Alerts <ArrowUpRight className="w-3 h-3" /></span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
