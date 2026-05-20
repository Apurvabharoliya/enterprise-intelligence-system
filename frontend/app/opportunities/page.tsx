"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Lightbulb, Sparkles, Filter, ArrowUpRight, TrendingUp, DollarSign, Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:8000";

const mockOpportunities = [
  {
    id: "OPP-001",
    title: "Gujarat City Gas License Expansion Gap",
    sector: "Gas & LNG",
    confidence: "94%",
    estValue: "$120M - $150M",
    date: "May 20, 2026",
    summary: "Due to delayed CGD bidding allocations in Gujarat Zone B, local industrial clusters in Morbi are experiencing a 15% natural gas demand surplus. Tapping intermediate industrial supply lines offers immediate revenue yields.",
    actionPlan: "Deploy localized storage grid hubs; engage with ceramic manufacturing consortia for medium-term supply logs.",
    priority: "Critical"
  },
  {
    id: "OPP-002",
    title: "Ibuprofen Intermediate Synthesis Domestic Sourcing",
    sector: "Pharma API",
    confidence: "91%",
    estValue: "$80M",
    date: "May 18, 2026",
    summary: "Logistics congestion at Western ports has spiked raw chemical intermediate prices by 15%. Domestic manufacturing of Isobutylbenzene (IBB) is currently highly profitable due to supply chain protection tariffs.",
    actionPlan: "Repurpose existing organic synthesis batch reactors at Western units to manufacture IBB feedstocks locally.",
    priority: "High"
  }
];

export default function AiOpportunities() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [opportunities, setOpportunities] = useState<any[]>(mockOpportunities);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch(`${API_URL}/api/opportunities`);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend API offline, falling back to static local opportunities.");
      }
    }
    fetchOpportunities();
  }, []);

  const filteredOpp = opportunities.filter(o => 
    selectedSector === "All" || o.sector === selectedSector
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#E5A93C]" /> AI Opportunities & Recommendations
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-black/20 p-1 border border-white/5 font-mono text-xs">
              {["All", "Gas & LNG", "EPC & Infra", "Pharma API"].map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1 rounded transition-colors ${selectedSector === sector ? "bg-white/10 text-white font-bold" : "text-muted-foreground hover:text-white"}`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header info */}
            <div className="rounded-xl bg-gradient-to-r from-violet-950/20 via-[#190F24]/40 to-emerald-950/20 border border-white/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-full bg-[#E5A93C]/5 blur-3xl -z-10" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400 flex-shrink-0 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Generative Intelligence Forecast</span>
                    <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 animate-pulse" : "text-muted-foreground border-white/10"}`}>
                      {isLive ? "● SECURE FEED ACTIVE" : "OFFLINE STATIC FORECAST"}
                    </span>
                  </div>
                  <h3 className="font-heading font-medium text-base text-white">
                    Predictive analysis indicates ₹10,000 Cr cumulative procurement value across watched sectors in next 45 days.
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
                    Our NLP scraping layer analyzed central regulatory archives, tariff updates, and shipping logs. We suggest prioritizing local API intermediate synthesis reactor shifts (due to current port delays) and preparing local pipeline storage yards in Morbi.
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-6">
              {filteredOpp.map((opp) => (
                <div 
                  key={opp.id} 
                  className="p-6 rounded-xl glass border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                >
                  {/* Highlight bar */}
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#E5A93C] to-transparent" />

                  {/* Header info */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{opp.id}</span>
                        <Badge className={`${opp.priority === "Critical" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                          {opp.priority}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-bold text-white text-lg leading-snug group-hover:text-[#E5A93C] transition-colors">{opp.title}</h3>
                      <span className="inline-block text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground mt-1">
                        {opp.sector}
                      </span>
                    </div>

                    {/* Analytics Box */}
                    <div className="flex gap-4 font-mono text-xs text-right self-start">
                      <div className="p-3 bg-black/25 rounded border border-white/5 flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase">AI CONFIDENCE</span>
                        <span className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-emerald-400" /> {opp.confidence}</span>
                      </div>
                      <div className="p-3 bg-black/25 rounded border border-white/5 flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase">EST. VALUE RANGE</span>
                        <span className="text-sm font-bold text-white mt-1 flex items-center gap-0.5"><span className="text-[#E5A93C] font-mono mr-0.5 font-bold">₹</span> {opp.estValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main summary */}
                  <p className="text-xs text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-white/5">
                    {opp.summary}
                  </p>

                  {/* Action recommendation */}
                  <div className="mt-4 p-4 rounded bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2.5 text-xs text-emerald-400">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold uppercase tracking-wider font-mono block text-[10px] mb-1">Recommended Action Directives:</span>
                      {opp.actionPlan}
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mt-4 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Detected: {opp.date}</span>
                    <span className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">Deploy Analytical Model <ArrowUpRight className="w-3 h-3" /></span>
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
