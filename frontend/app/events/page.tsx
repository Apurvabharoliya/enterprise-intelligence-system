"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:8000";

const mockEvents = [
  {
    id: 1,
    day: 12,
    title: "FDA Halol Facility Audit Concludes",
    sector: "Pharma API",
    sectorColor: "bg-violet-500",
    desc: "US FDA procedural audit at Sun Pharma Halol facility. Core compliance logging review.",
    time: "09:00 AM",
    severity: "High"
  },
  {
    id: 2,
    day: 18,
    title: "PNGRB Tariff Hearing Grid Additions",
    sector: "Gas & LNG",
    sectorColor: "bg-emerald-500",
    desc: "Petroleum and Natural Gas Board public hearing regarding terminal tariff revisions.",
    time: "11:00 AM",
    severity: "Medium"
  },
  {
    id: 3,
    day: 24,
    title: "Gujarat Hydrogen Cracker Bids Open",
    sector: "EPC & Infra",
    sectorColor: "bg-amber-500",
    desc: "Closing date for the major petrochemical hydrogen installation bids in western sectors.",
    time: "05:00 PM",
    severity: "High"
  }
];

export default function EventTracker() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [activeEvent, setActiveEvent] = useState<any | null>(mockEvents[0]);
  const [events, setEvents] = useState<any[]>(mockEvents);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        if (res.ok) {
          const data = await res.json();
          const mappedEvents = data.map((e: any, index: number) => ({
            id: index + 1,
            day: e.day,
            title: e.title,
            sector: e.type === "pharma" ? "Pharma API" : e.type === "gas" ? "Gas & LNG" : "EPC & Infra",
            sectorColor: e.type === "pharma" ? "bg-violet-500" : e.type === "gas" ? "bg-emerald-500" : "bg-amber-500",
            desc: e.type === "pharma" 
              ? "US FDA procedural audit inspection at corporate facility. Core compliance logging review."
              : e.type === "gas"
              ? "Petroleum and Natural Gas Board public hearing regarding terminal tariff cap revisions."
              : "Closing of technical bids evaluation for the major petrochemical cracker installation contract.",
            time: e.day === 12 ? "09:00 AM" : e.day === 18 ? "11:00 AM" : "05:00 PM",
            severity: e.severity
          }));
          setEvents(mappedEvents);
          setActiveEvent(mappedEvents[0]);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Backend API offline, falling back to local events catalog.");
      }
    }
    fetchEvents();
  }, []);

  const daysInMonth = 31;
  const blankSpots = 4; // Friday is 1st
  const calendarCells = [];
  
  for (let i = 1; i <= blankSpots; i++) {
    calendarCells.push({ day: null, events: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => e.day === d);
    calendarCells.push({ day: d, events: dayEvents });
  }

  const filteredEvents = events.filter((item) => {
    return selectedSector === "All" || item.sector === selectedSector;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
              <span className="text-[#E5A93C] font-mono">📅 May 2026 Calendar</span>
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
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Widget Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-xl glass border border-white/5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading font-medium text-base text-white">May 2026</h3>
                  <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 animate-pulse" : "text-muted-foreground border-white/10"}`}>
                    {isLive ? "● SECURE FEED ONLINE" : "OFFLINE STATIC CALENDAR"}
                  </span>
                </div>
                
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-muted-foreground font-semibold mb-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {calendarCells.map((cell, idx) => (
                    <div 
                      key={idx}
                      className={`min-h-16 md:min-h-20 rounded-lg p-2 flex flex-col justify-between border ${cell.day ? "bg-black/20 border-white/5 hover:border-white/15" : "bg-transparent border-transparent"} transition-colors relative group`}
                    >
                      {cell.day && (
                        <>
                          <span className="text-xs font-mono text-muted-foreground group-hover:text-white">{cell.day}</span>
                          <div className="flex flex-col gap-1 mt-1">
                            {cell.events.map(event => (
                              <div 
                                key={event.id}
                                onClick={() => setActiveEvent(event)}
                                className={`w-full h-1.5 rounded-full ${event.sectorColor} cursor-pointer opacity-80 hover:opacity-100 transition-opacity`}
                                title={event.title}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Details Sidebar */}
            <div className="space-y-6">
              <div className="p-5 rounded-xl glass border border-white/5 h-full flex flex-col justify-between overflow-hidden relative">
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="font-mono text-xs text-[#E5A93C] uppercase tracking-wider">// Event Details</span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                    </span>
                  </div>

                  {activeEvent ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className={`px-2 py-0.5 rounded border ${activeEvent.severity === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                          Priority: {activeEvent.severity}
                        </span>
                        <span className="text-muted-foreground">{activeEvent.time}</span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-white leading-snug">{activeEvent.title}</h4>
                      
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#9CA3AF]">
                          Date: May {activeEvent.day}, 2026
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#9CA3AF]">
                          Sector: {activeEvent.sector}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                        {activeEvent.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground font-mono text-xs">
                      Select an event on the calendar to view diagnostic telemetry.
                    </div>
                  )}
                </div>

                {/* Upcoming List */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Chronological Queue</h3>
                  <div className="space-y-2.5 max-h-[14rem] overflow-y-auto pr-1">
                    {filteredEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer hover:border-white/10 transition-colors flex justify-between items-center ${activeEvent?.id === event.id ? "bg-white/5 border-[#E5A93C]/30" : "bg-black/20 border-white/5"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${event.sectorColor}`} />
                          <span className="font-medium text-white truncate max-w-[10rem]">{event.title}</span>
                        </div>
                        <span className="font-mono text-muted-foreground text-[10px]">May {event.day}</span>
                      </div>
                    ))}
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
