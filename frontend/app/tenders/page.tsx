"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Filter, Briefcase, Calendar, MapPin, IndianRupee, Download, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const mockTenders = [
  {
    id: "TEN-9081",
    title: "Gujarat Pipeline Grid Addition Phase 2",
    issuer: "Gujarat Gas Ltd",
    sector: "Gas & LNG",
    value: "₹1,500Cr",
    region: "Western Region",
    status: "Under Evaluation",
    deadline: "May 25, 2026",
    matchScore: "94%"
  },
  {
    id: "TEN-9082",
    title: "Halol API Biosafety Level-3 Expansion",
    issuer: "Sun Pharmaceutical",
    sector: "Pharma API",
    value: "₹375Cr",
    region: "Southern Region",
    status: "Bidding Open",
    deadline: "Jun 12, 2026",
    matchScore: "88%"
  },
  {
    id: "TEN-9083",
    title: "National Bullet Train Corridor Engineering JV",
    issuer: "NHSRCL",
    sector: "EPC & Infra",
    value: "₹10,000Cr",
    region: "Northern Region",
    status: "Contract Awarded",
    deadline: "Concluded",
    matchScore: "97%"
  },
  {
    id: "TEN-9084",
    title: "Morbi Compressed Bio-Gas Grid Setup",
    issuer: "Adani Gas",
    sector: "Gas & LNG",
    value: "₹540Cr",
    region: "Western Region",
    status: "Bidding Open",
    deadline: "Jun 04, 2026",
    matchScore: "91%"
  }
];

export default function TenderIntel() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [tenders, setTenders] = useState<any[]>(mockTenders);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchTenders() {
      try {
        const res = await fetch(`${API_URL}/api/tenders`);
        if (res.ok) {
          const data = await res.json();
          const mappedTenders = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            issuer: t.sector === "Gas & LNG" ? "Gujarat Gas Ltd" : t.sector === "Pharma API" ? "Sun Pharmaceutical" : "NHSRCL",
            sector: t.sector,
            value: t.value,
            region: t.region,
            status: t.status === "Bidding Open" ? "Open" : t.status === "Under Evaluation" ? "Under Evaluation" : "Awarded",
            deadline: t.deadline,
            matchScore: "94%"
          }));
          setTenders(mappedTenders);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend API offline, falling back to static local tenders.");
      }
    }
    fetchTenders();
  }, []);

  const filteredTenders = tenders.filter((item) => {
    const matchesSector = selectedSector === "All" || item.sector === selectedSector;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = "Tender ID,Title,Issuer,Sector,Value,Region,Status,Deadline,Match Score\n";
    const rows = filteredTenders.map(t => 
      `"${t.id}","${t.title}","${t.issuer}","${t.sector}","${t.value}","${t.region}","${t.status}","${t.deadline}","${t.matchScore}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `IntelliSector_Tenders_${selectedSector}.csv`);
    a.click();
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

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
                placeholder="Search tender ID, issuer, keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary/50 h-9 font-mono text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium transition-colors text-white"
            >
              <Download className="w-3.5 h-3.5" /> {exportSuccess ? "CSV Exported!" : "Export CSV"}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-heading tracking-tight flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" /> Active Tender Intelligence
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Aggregated bid portals tracking critical multi-million dollar industrial requests.</p>
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

            {/* AI Tender Match Alert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 p-5 rounded-xl glass border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A93C]/5 rounded-bl-full -z-10" />
                <h3 className="font-heading font-medium text-base mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E5A93C]" /> AI Match Recommendation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on your watchlisted firms L&T and GAIL, the <span className="text-white font-semibold">TEN-9082 API unit</span> has a high strategic affinity (88% Match Score) for sub-contracting logistics, and <span className="text-white font-semibold">TEN-9081 Gujarat Gas Zone B</span> matches GAIL's regional grid pipeline layout.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-amber-500">
                  <span>TOTAL ESTIMATED PIPELINE VALUE</span>
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-3xl font-bold font-mono text-[#E5A93C]">₹12,415Cr</span>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">
                    {isLive ? "LIVE DATABASE CONNECTED" : "OFFLINE STATIC VALUE"}
                  </p>
                </div>
              </div>
            </div>

            {/* High Density Table */}
            <div className="rounded-xl glass border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-b border-white/5">
                    <TableHead className="font-mono text-xs text-muted-foreground">Tender ID</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Tender Description</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Issuer / Agent</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Est. Value</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Region</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">Deadline</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenders.map((tender) => (
                    <TableRow key={tender.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-primary">{tender.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium leading-snug">{tender.title}</span>
                          <span className="text-[10px] self-start px-2 py-0.5 rounded border font-bold font-mono text-[9px] scale-95 origin-left tracking-wide uppercase mt-1 leading-none shadow-sm shadow-black/10 select-none cursor-default bg-black/20 block border-white/5">
                            {tender.sector}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF] font-medium">{tender.issuer}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-white">{tender.value}</TableCell>
                      <TableCell className="text-xs text-[#9CA3AF] font-mono">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#E5A93C]" /> {tender.region}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={tender.status === "Open" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : tender.status === "Awarded" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}>
                          {tender.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#9CA3AF]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {tender.deadline}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-right font-bold text-emerald-400">{tender.matchScore}</TableCell>
                    </TableRow>
                  ))}

                  {filteredTenders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground font-mono text-xs">
                        No active tenders match the search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
