"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { LineChart as LucideChart, TrendingUp, DollarSign, Layers } from "lucide-react";

const API_URL = "http://localhost:8000";

const mockMonthlyData = [
  { name: "Jan", gas: 120, epc: 240, pharma: 180 },
  { name: "Feb", gas: 180, epc: 320, pharma: 150 },
  { name: "Mar", gas: 150, epc: 280, pharma: 210 },
  { name: "Apr", gas: 240, epc: 410, pharma: 190 },
  { name: "May", gas: 290, epc: 490, pharma: 230 },
  { name: "Jun", gas: 380, epc: 620, pharma: 310 },
];

const mockRegionalData = [
  { name: "Western Region", value: 680, color: "#10B981" },
  { name: "Southern Region", value: 450, color: "#F59E0B" },
  { name: "Northern Region", value: 310, color: "#8B5CF6" },
  { name: "Eastern Region", value: 240, color: "#EC4899" },
];

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState<any[]>(mockMonthlyData);
  const [regionalData, setRegionalData] = useState<any[]>(mockRegionalData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_URL}/api/analytics`);
        if (res.ok) {
          const data = await res.json();
          setMonthlyData(data.monthly);
          setRegionalData(data.regional);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend API offline, falling back to static local analytics graphs.");
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
              <LucideChart className="w-5 h-5 text-[#E5A93C]" /> Advanced Analytics Dashboard
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Title */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-heading tracking-tight">Macro Industrial Analytics</h2>
                <p className="text-sm text-muted-foreground mt-1">Consolidated analytical models tracking capital expenditures, regional bids, and sectoral performance indicators.</p>
              </div>
              <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 animate-pulse" : "text-muted-foreground border-white/10"}`}>
                {isLive ? "● SECURE PIPELINE ONLINE" : "OFFLINE STATIC METRICS"}
              </span>
            </div>

            {/* Top widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
                  <span>AGGREGATED PROCUREMENT VAL</span>
                  <span className="text-[#E5A93C] font-mono font-bold text-sm">₹</span>
                </div>
                <div>
                  <span className="text-3xl font-bold font-mono text-white">₹40,000 Cr</span>
                  <span className="text-[10px] text-emerald-500 font-mono block mt-1">+14.2% YoY growth</span>
                </div>
              </div>

              <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
                  <span>ACTIVE CONTRACTS WATCHED</span>
                  <Layers className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <span className="text-3xl font-bold font-mono text-white">418 Units</span>
                  <span className="text-[10px] text-muted-foreground font-mono block mt-1">Gas, civil-infra, API labs</span>
                </div>
              </div>

              <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
                  <span>MEDIAN COMPLIANCE RATING</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-3xl font-bold font-mono text-white">98.1%</span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">Stable operational safety</span>
                </div>
              </div>

            </div>

            {/* Recharts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line & Area Sector Growth Chart */}
              <div className="lg:col-span-2 h-96 rounded-xl glass border border-white/5 p-5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                <h3 className="font-heading font-medium text-base mb-4 flex justify-between items-center">
                  <span>Sector Procurement Volumes Trend (₹ Cr)</span>
                  <span className="text-xs font-mono text-muted-foreground">Monthly aggregate</span>
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEpc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        labelClassName="font-mono text-white"
                      />
                      <Area type="monotone" dataKey="gas" stroke="#10B981" fillOpacity={1} fill="url(#colorGas)" strokeWidth={2} />
                      <Area type="monotone" dataKey="epc" stroke="#F59E0B" fillOpacity={1} fill="url(#colorEpc)" strokeWidth={2} />
                      <Line type="monotone" dataKey="pharma" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Regional Bar Distribution */}
              <div className="h-96 rounded-xl glass border border-white/5 p-5 flex flex-col relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10" />
                <h3 className="font-heading font-medium text-base mb-4 flex justify-between items-center">
                  <span>Regional Tenders (₹ Cr)</span>
                  <span className="text-xs font-mono text-muted-foreground">Geographic clusters</span>
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                      <XAxis type="number" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} tickLine={false} width={90} />
                      <Tooltip 
                        contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        labelClassName="font-mono text-white"
                      />
                      <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={14}>
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
