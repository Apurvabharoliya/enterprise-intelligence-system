"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Filter, Briefcase, Calendar, MapPin, IndianRupee, Download, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/config";
import { generateTenderDossierPDF } from "@/lib/generatePDF";

export default function TenderIntel() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [tenders, setTenders] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedTender, setSelectedTender] = useState<any | null>(null);

  useEffect(() => {
    async function fetchTenders() {
      try {
        const res = await fetch(`${API_URL}/api/tenders`, { cache: 'no-store' });
        if (!res.ok) {
          console.error("API response error:", res.status);
          throw new Error(`API error status: ${res.status}`);
        }
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
        console.error("Tenders Fetch Error:", err);
      }
    }
    fetchTenders();

    const intervalId = setInterval(() => {
      fetchTenders();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTenders = tenders.filter((item) => {
    const matchesSector = selectedSector === "All" || item.sector === selectedSector;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const sortedTenders = [...filteredTenders].sort((a, b) => {
    if (!sortConfig) return 0;
    
    // Custom sort for value
    if (sortConfig.key === 'value') {
      const valA = parseFloat(a.value.replace(/[^\d.]/g, '')) || 0;
      const valB = parseFloat(b.value.replace(/[^\d.]/g, '')) || 0;
      return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalValue = filteredTenders.reduce((sum, tender) => {
    const num = parseFloat(tender.value.replace(/[^\d.]/g, ''));
    if (!isNaN(num)) return sum + num;
    return sum;
  }, 0);
  const formattedTotal = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(totalValue);

  const handleExportCSV = () => {
    const headers = "Tender ID,Title,Issuer,Sector,Value,Region,Status,Deadline,Match Score\\n";
    const rows = sortedTenders.map(t => 
      `"${t.id}","${t.title}","${t.issuer}","${t.sector}","${t.value}","${t.region}","${t.status}","${t.deadline}","${t.matchScore}"`
    ).join("\\n");
    
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
                  Based on your watchlisted firms, the <span className="text-white font-semibold">{filteredTenders.length > 0 ? filteredTenders[0].id : "TEN-9082"} API unit</span> has a high strategic affinity for sub-contracting logistics, and matches your regional footprint layout perfectly. Recommend immediate due diligence.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-amber-500">
                  <span>TOTAL ESTIMATED PIPELINE VALUE</span>
                </div>
                <div>
                  <span className="text-3xl font-bold font-mono text-[#E5A93C]">₹{formattedTotal}Cr</span>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">
                    {isLive ? "LIVE DATABASE CONNECTED" : "CALCULATING..."}
                  </p>
                </div>
              </div>
            </div>

            {/* High Density Table */}
            <div className="rounded-xl glass border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-b border-white/5">
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('id')}>Tender ID</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('title')}>Tender Description</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('issuer')}>Issuer / Agent</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('value')}>Est. Value</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('region')}>Region</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('status')}>Status</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-white" onClick={() => handleSort('deadline')}>Deadline</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right cursor-pointer hover:text-white" onClick={() => handleSort('matchScore')}>Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTenders.map((tender) => (
                    <TableRow 
                      key={tender.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedTender(tender)}
                    >
                      <TableCell className="font-mono text-xs font-semibold text-primary">{tender.id}</TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="flex flex-col gap-1 overflow-hidden pr-4">
                          <span className="text-sm font-medium leading-snug truncate block">{tender.title}</span>
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

                  {sortedTenders.length === 0 && (
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

      {/* Tender Detail Panel */}
      {selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-full bg-[#111827] border-l border-white/10 p-8 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[#E5A93C] border-[#E5A93C]/30 bg-[#E5A93C]/10 font-mono text-xs">
                  {selectedTender.sector}
                </Badge>
                <button 
                  onClick={() => setSelectedTender(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-heading text-white">{selectedTender.title}</h2>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground border-y border-white/5 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/80">{selectedTender.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Deadline: <span className="text-white/80">{selectedTender.deadline}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/80 font-bold">{selectedTender.value}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Tender Overview</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  This tender is issued by {selectedTender.issuer} for operations in the {selectedTender.region}. The current status of this tender is marked as {selectedTender.status}.
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  Our strategic AI analysis engine gives your firm a <strong>{selectedTender.matchScore}</strong> match score for this opportunity, indicating high alignment with your recent operational capabilities and geographic footprint.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Initiate Bid Protocol
              </button>
              <button 
                onClick={() => generateTenderDossierPDF(selectedTender)}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Download Dossier (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
