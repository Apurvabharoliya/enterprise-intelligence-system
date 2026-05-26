"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, MapPin, Activity, Clock, ShieldAlert, AlertTriangle } from "lucide-react";
import { API_URL } from "@/lib/config";

export default function EventTracker() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [activeEvent, setActiveEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("list");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_URL}/api/events`, { cache: 'no-store' });
        if (!res.ok) {
          console.error("API response error:", res.status);
          throw new Error(`API error status: ${res.status}`);
        }
        if (res.ok) {
          const data = await res.json();
          const mappedEvents = data.map((e: any) => {
            const sectorColors: Record<string, string> = { "pharma": "#8B5CF6", "gas": "#10B981", "epc": "#F59E0B" };
            const sectorNames: Record<string, string> = { "pharma": "Pharma API", "gas": "Gas & LNG", "epc": "EPC & Infra" };
            return {
              id: String(e.id),
              title: e.title,
              date: e.date,
              sector: sectorNames[e.type] || e.type,
              backgroundColor: sectorColors[e.type] || "#3B82F6",
              borderColor: sectorColors[e.type] || "#3B82F6",
              desc: e.desc || `Detailed description for ${e.title} event.`,
              severity: e.severity,
              location: e.location || "TBA",
              status: e.status || "Upcoming",
            };
          }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setEvents(mappedEvents);
          setActiveEvent(mappedEvents.find((e: any) => e.status === "Upcoming") || mappedEvents[0]);
          setIsLive(true);
        }
      } catch (err) {
        console.error("Events Fetch Error:", err);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((item) => {
    return selectedSector === "All" || item.sector === selectedSector;
  });

  const getCountdown = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return "Today";
    return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const pastEvents = filteredEvents.filter(e => e.status === "Completed").reverse();
  const upcomingEvents = filteredEvents.filter(e => e.status === "Upcoming");

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-sans text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold font-heading tracking-tight flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Strategic Event Tracker
              </span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex rounded-lg bg-white/5 p-1 border border-white/5 font-mono text-xs">
              {["All", "Gas & LNG", "EPC & Infra", "Pharma API"].map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-4 py-1.5 rounded transition-all duration-300 ${selectedSector === sector ? "bg-emerald-500/20 text-emerald-400 font-bold shadow-lg shadow-emerald-500/10" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
                >
                  {sector}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setView("calendar")}
                className={`px-3 py-1.5 text-xs font-mono rounded ${view === "calendar" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
              >
                Calendar
              </button>
              <button 
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-xs font-mono rounded ${view === "list" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
              >
                Live Feed
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth relative">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
            
            {/* Main View Area */}
            <div className="xl:col-span-2 flex flex-col h-[calc(100vh-8rem)]">
              <AnimatePresence mode="wait">
                {view === "calendar" ? (
                  <motion.div 
                    key="calendar"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 p-6 rounded-2xl bg-black/40 border border-white/5 shadow-2xl calendar-premium backdrop-blur-sm"
                  >
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      events={filteredEvents}
                      height="100%"
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek"
                      }}
                      eventClick={(info) => {
                        const ev = events.find(e => e.id === info.event.id);
                        if (ev) setActiveEvent(ev);
                      }}
                      eventContent={(arg) => {
                        return (
                          <div className="flex flex-col p-1 overflow-hidden w-full h-full justify-center">
                             <div className="text-[10px] font-semibold truncate leading-tight">{arg.event.title}</div>
                          </div>
                        );
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col gap-8 overflow-y-auto pr-4 custom-scrollbar"
                  >
                    {/* AI Summary Banner */}
                    <div className="rounded-xl bg-gradient-to-r from-emerald-950/20 via-[#0A1912]/40 to-violet-950/20 border border-white/5 p-5 relative overflow-hidden group mb-2">
                      <div className="absolute top-0 right-0 w-96 h-full bg-[#E5A93C]/5 blur-3xl -z-10" />
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex-shrink-0 animate-pulse">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">Live Event Digest</span>
                            <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-muted-foreground border-white/10"}`}>
                              {isLive ? "ACTIVE TRACKING" : "OFFLINE"}
                            </span>
                          </div>
                          <h3 className="font-heading font-medium text-base text-white">
                            Monitoring {upcomingEvents.length} Upcoming Sector Events
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
                            Continuous surveillance of scheduled industry events, regulatory deadlines, and strategic announcements. AI models are evaluating potential market impacts in real-time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" /> Upcoming Events
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcomingEvents.map((event, i) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={event.id}
                            onClick={() => setActiveEvent(event)}
                            className="relative group perspective"
                            style={{ perspective: "1000px" }}
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-[#E5A93C]/0 to-violet-500/0 rounded-xl blur opacity-0 group-hover:opacity-30 group-hover:via-emerald-500/20 transition duration-700 pointer-events-none" />
                            
                            <div className={`relative h-full flex flex-col justify-between border-white/5 hover:border-emerald-500/30 transition-all duration-500 bg-black/40 backdrop-blur-md overflow-hidden transform-gpu group-hover:-translate-y-1 cursor-pointer p-5 rounded-xl border ${activeEvent?.id === event.id ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-white/5" : ""}`}>
                              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-emerald-500/30 to-transparent transition-colors duration-500" />
                              
                              <div className="flex items-center justify-between text-xs font-mono mb-4">
                                <span className="text-emerald-400 flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5 font-bold">
                                  {getCountdown(event.date)}
                                </span>
                                <span className="px-2.5 py-1 rounded border font-bold text-[10px] tracking-wider uppercase" style={{ borderColor: event.backgroundColor + '40', color: event.backgroundColor, backgroundColor: event.backgroundColor + '10' }}>
                                  {event.sector}
                                </span>
                              </div>
                              
                              <h4 className="text-base font-heading text-white/90 group-hover:text-white transition-colors leading-snug mb-3">
                                {event.title}
                              </h4>
                              
                              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                                {event.desc}
                              </p>

                              <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-4 mt-4 border-t border-white/5">
                                <span className="px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 opacity-70" /> {event.date}
                                </span>
                                <span className="px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1 ml-auto">
                                  <MapPin className="w-3 h-3 opacity-70" /> {event.location}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {upcomingEvents.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                          <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <h3 className="font-heading text-white mb-1">No Upcoming Events</h3>
                          <p className="text-xs text-muted-foreground">Adjust filters to see more intelligence.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-5 h-5" /> Past Events
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
                        {pastEvents.map((event, i) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={event.id}
                            onClick={() => setActiveEvent(event)}
                            className="relative group perspective"
                          >
                            <div className={`relative h-full flex flex-col justify-between border-white/5 transition-all duration-300 bg-black/20 backdrop-blur-md overflow-hidden cursor-pointer p-4 rounded-xl border ${activeEvent?.id === event.id ? "border-white/20 bg-white/5" : "hover:bg-white/5"}`}>
                              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                                <span className="text-muted-foreground flex items-center gap-1.5 px-2 py-1 rounded border border-white/5">
                                  {getCountdown(event.date)}
                                </span>
                              </div>
                              <h4 className="text-sm font-heading text-white/50 line-through decoration-white/20">
                                {event.title}
                              </h4>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Event Details Panel */}
            <div className="h-[calc(100vh-8rem)]">
              <div className="h-full rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-6 flex flex-col relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
                
                <div className="flex justify-between items-center mb-8">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" /> Event Intelligence
                  </span>
                  {isLive && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {activeEvent ? (
                    <motion.div 
                      key={activeEvent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      <div className="mb-6 space-y-4">
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded border font-mono text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: activeEvent.backgroundColor + '40', color: activeEvent.backgroundColor, backgroundColor: activeEvent.backgroundColor + '10' }}>
                            {activeEvent.sector}
                          </span>
                          <span className={`px-2.5 py-1 rounded border font-mono text-[10px] uppercase font-bold tracking-wider ${activeEvent.status === 'Completed' ? 'bg-white/5 border-white/10 text-muted-foreground' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            {activeEvent.status}
                          </span>
                          {activeEvent.severity === 'High' && (
                             <span className="px-2.5 py-1 rounded border font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-500/10 border-rose-500/20 text-rose-400 flex items-center gap-1">
                               <ShieldAlert className="w-3 h-3" /> High Impact
                             </span>
                          )}
                        </div>

                        <h3 className="text-2xl font-heading font-bold text-white leading-tight">
                          {activeEvent.title}
                        </h3>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Date</span>
                            <div className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-emerald-500" />
                              {activeEvent.date}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Location</span>
                            <div className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-500" />
                              {activeEvent.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Executive Summary</h4>
                          <p className="text-sm text-white/80 leading-relaxed">
                            {activeEvent.desc}
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                          <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> AI Risk Assessment
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {activeEvent.status === "Completed" 
                              ? "Event has concluded. Post-event structural analysis indicates standard market absorption with no critical supply chain disruptions." 
                              : "Upcoming event requires monitoring. High probability of localized logistics impact and short-term volatility in respective sector indexes."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/5">
                        <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group">
                          Generate Detailed Report
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50"
                    >
                      <Calendar className="w-12 h-12 text-muted-foreground" />
                      <p className="text-sm font-mono text-muted-foreground">Select an event from the calendar or timeline to view detailed intelligence.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .calendar-premium .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.02);
          --fc-neutral-text-color: #9CA3AF;
          --fc-border-color: rgba(255, 255, 255, 0.05);
          
          --fc-button-text-color: #F3F4F6;
          --fc-button-bg-color: rgba(255, 255, 255, 0.05);
          --fc-button-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-hover-bg-color: rgba(255, 255, 255, 0.1);
          --fc-button-hover-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-active-bg-color: rgba(16, 185, 129, 0.2);
          --fc-button-active-border-color: rgba(16, 185, 129, 0.4);
          
          --fc-event-bg-color: transparent;
          --fc-event-border-color: transparent;
          --fc-event-text-color: #fff;
          
          --fc-today-bg-color: rgba(16, 185, 129, 0.05);
          font-family: var(--font-sans);
        }
        .calendar-premium .fc-theme-standard td, .calendar-premium .fc-theme-standard th {
          border-color: rgba(255, 255, 255, 0.05);
        }
        .calendar-premium .fc-col-header-cell-cushion {
          color: #9CA3AF;
          padding: 12px 8px;
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .calendar-premium .fc-daygrid-day-number {
          color: #F3F4F6;
          padding: 8px;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          opacity: 0.7;
        }
        .calendar-premium .fc-day-today .fc-daygrid-day-number {
          color: #10B981;
          font-weight: bold;
          opacity: 1;
        }
        .calendar-premium .fc .fc-toolbar-title {
          font-family: var(--font-heading);
          color: #F3F4F6;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .calendar-premium .fc-h-event {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0;
          border-radius: 4px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .calendar-premium .fc-h-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.3);
          z-index: 10;
        }
        .calendar-premium .fc-daygrid-event-harness {
          margin-bottom: 4px;
        }
        .calendar-premium .fc-view-harness {
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.02);
        }
      `}} />
    </div>
  );
}
