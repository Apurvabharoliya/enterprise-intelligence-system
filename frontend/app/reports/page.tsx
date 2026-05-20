"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { FileText, Download, Filter, FileSpreadsheet, Eye, RefreshCw, Calendar, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const [sector, setSector] = useState("Gas & LNG");
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const [downloading, setDownloading] = useState("");

  const handleDownload = (format: string) => {
    setDownloading(format);
    
    // Simulate compilation delay then start clean browser download
    setTimeout(() => {
      let content = "";
      let filename = "";
      let mimeType = "";
      
      if (format === "PDF") {
        content = `%PDF-1.4\n%INTELLI-SECTOR COMPLIED EXECUTIVE REPORT\nSECTOR: ${sector.toUpperCase()}\nTIMEFRAME: ${timeframe.toUpperCase()}\nSTATS SUMMARY: Aggregated procurement assets totaling $2.4B under surveillance. 0 Critical warning observations pending.\n%%EOF`;
        filename = `IntelliSector_${sector.replace(/\s/g, "_")}_Executive_Report.pdf`;
        mimeType = "application/pdf";
      } else {
        content = "Sector,Timeframe,Tenders Scraped,Audit Warnings,Value Aggregated\n" + 
                  `"${sector}","${timeframe}",24,3,"$2.4B"`;
        filename = `IntelliSector_${sector.replace(/\s/g, "_")}_Data_Export.csv`;
        mimeType = "text/csv";
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", filename);
      a.click();
      
      setDownloading("");
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E5A93C]" /> Exportable Reports Generator
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Configuration Form Column */}
            <div className="space-y-6">
              <div className="p-5 rounded-xl glass border border-white/5 space-y-5">
                <h3 className="font-heading font-bold text-white text-base">Report Settings</h3>
                <p className="text-xs text-muted-foreground">Select criteria to compile into an encrypted executive analysis pack.</p>
                
                {/* Sector Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase">Target Sector</label>
                  <select 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-black/25 border border-white/10 rounded p-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Gas & LNG">Gas & LNG Distribution</option>
                    <option value="EPC & Infra">EPC & Infrastructure</option>
                    <option value="Pharma API">Pharma & API Manufacturing</option>
                  </select>
                </div>

                {/* Timeframe Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase">Report Timeframe</label>
                  <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full bg-black/25 border border-white/10 rounded p-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Last 24 Hours">Last 24 Hours</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Q1 FY26 Archive">Q1 FY26 Archive</option>
                  </select>
                </div>

                {/* Scope options */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase">Included Modules</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white">
                      <input type="checkbox" defaultChecked /> Scraped News Telemetry
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white">
                      <input type="checkbox" defaultChecked /> Active Bids & Tenders
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white">
                      <input type="checkbox" defaultChecked /> FDA Audits & Observations
                    </label>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-white/5 space-y-2.5">
                  <button 
                    disabled={downloading !== ""}
                    onClick={() => handleDownload("PDF")}
                    className="w-full py-2.5 bg-[#E5A93C] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
                  >
                    {downloading === "PDF" ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling PDF...</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Export Premium PDF</>
                    )}
                  </button>
                  <button 
                    disabled={downloading !== ""}
                    onClick={() => handleDownload("CSV")}
                    className="w-full py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-[#F3F4F6] font-mono font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
                  >
                    {downloading === "CSV" ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Preparing CSV...</>
                    ) : (
                      <><FileSpreadsheet className="w-3.5 h-3.5" /> Export Raw CSV</>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Document Preview Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-xl bg-slate-950 border border-white/5 flex flex-col items-center justify-center min-h-[35rem] shadow-2xl relative overflow-hidden font-serif">
                
                {/* Paper sheet look */}
                <div className="w-full max-w-[28rem] bg-[#F9F9FB] text-[#0F0F11] p-10 rounded shadow-2xl space-y-8 min-h-[36rem] flex flex-col justify-between relative">
                  
                  {/* Watermark logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-[#E5A93C]/10 rounded-full flex items-center justify-center pointer-events-none select-none">
                    <span className="font-sans font-bold text-[10px] tracking-[0.4em] text-[#E5A93C]/15 uppercase">SECURE TELEMETRY</span>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start border-b border-[#0F0F11]/10 pb-4">
                      <div>
                        <h4 className="font-sans font-extrabold text-[11px] tracking-widest uppercase text-[#0F0F11]/50">INTELLI-SECTOR COMPILATION</h4>
                        <h1 className="font-heading text-lg font-bold mt-1 text-[#0F0F11]">Executive Intelligence Pack</h1>
                      </div>
                      <span className="font-sans font-mono text-[9px] bg-[#0F0F11]/5 border border-[#0F0F11]/10 px-2 py-0.5 rounded text-[#0F0F11]/70">CONFIDENTIAL</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                      <div>
                        <span className="text-[9px] text-[#0F0F11]/50 uppercase font-mono block">Target Sector:</span>
                        <span className="font-bold text-[#0F0F11] block mt-0.5">{sector}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#0F0F11]/50 uppercase font-mono block">Timeframe Scope:</span>
                        <span className="font-bold text-[#0F0F11] block mt-0.5">{timeframe}</span>
                      </div>
                    </div>

                    {/* Report Content highlights */}
                    <div className="space-y-4 font-sans text-xs border-t border-dashed border-[#0F0F11]/10 pt-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-emerald-600 font-bold block uppercase">// Sector Overview:</span>
                        <p className="text-[#0F0F11]/80 leading-relaxed text-[11px]">
                          Continuous multi-channel scraping indicates stable operations across regional infrastructure networks. Bidding activity is at a Q2 high.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="font-mono text-[9px] text-amber-600 font-bold block uppercase">// Critical Metrics under watch:</span>
                        <div className="grid grid-cols-3 gap-2 text-center mt-1">
                          <div className="p-2 rounded bg-black/5">
                            <span className="block text-[10px] text-muted-foreground">Tenders</span>
                            <span className="block font-bold text-sm mt-0.5">24</span>
                          </div>
                          <div className="p-2 rounded bg-black/5">
                            <span className="block text-[10px] text-muted-foreground">FDA Logs</span>
                            <span className="block font-bold text-sm mt-0.5">3</span>
                          </div>
                          <div className="p-2 rounded bg-black/5">
                            <span className="block text-[10px] text-muted-foreground">Compliance</span>
                            <span className="block font-bold text-sm mt-0.5 text-emerald-600">98.4%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-sans border-t border-[#0F0F11]/10 pt-4 text-[#0F0F11]/60">
                    <span>E-SIGNATURE VERIFIED SECURE</span>
                    <span>© 2026 INTELLI-SECTOR</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
