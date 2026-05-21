"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { BellRing, Send, MessageSquare, Mail, Check, ShieldAlert, Cpu, Terminal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const initialLogs = [
  { time: "20:01:05", type: "SYSTEM", message: "Initial security handshake established with telemetry gateway." },
  { time: "19:54:12", type: "TELEGRAM", message: "Daily summary dispatch sent successfully to chat group #90872651." },
  { time: "19:42:01", type: "EMAIL", message: "Automated report compiled & delivered to lead.analyst@company.com." },
  { time: "19:15:30", type: "WHATSAPP", message: "Morbi bio-gas pipeline pressure deviation alert pushed to +91 98765 43210." },
];

export default function Notifications() {
  const [testSent, setTestSent] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [telegramToken, setTelegramToken] = useState("bot765123908:AAHjK_Xyz9876...");
  const [telegramChatId, setTelegramChatId] = useState("90872651");
  const [whatsappPhone, setWhatsappPhone] = useState("+91 98765 43210");
  const [emailAddress, setEmailAddress] = useState("lead.analyst@company.com");
  const [logs, setLogs] = useState<any[]>(initialLogs);

  const [toggles, setToggles] = useState({
    telegram: true,
    whatsapp: true,
    email: true,
    fda: true,
    tenders: true,
    tariffs: false
  });

  const handleTestAlert = async (channel: string) => {
    setTestSent(channel);
    let target = "";
    if (channel === "Telegram") target = telegramChatId;
    else if (channel === "WhatsApp") target = whatsappPhone;
    else target = emailAddress;

    const timestamp = new Date().toLocaleTimeString();

    try {
      const res = await fetch(`${API_URL}/api/notifications/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, target, payload: "FDA observation surveillance check" })
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        
        // Add to live log
        setLogs(prev => [
          { time: timestamp, type: channel.toUpperCase(), message: `Test dispatch succeeded: target ID ${target}` },
          ...prev
        ]);
      }
    } catch (err) {
      console.warn("Backend not running, falling back to simulated dispatch payload.");
      const mockResult = {
        success: true,
        message_id: `MSG-MOCK-${Math.floor(Math.random() * 900000 + 100000)}`,
        delivered_payload: `A simulated offline payload summarizing FDA observations was securely sent to the ${channel} node.`
      };
      setTestResult(mockResult);
      
      setLogs(prev => [
        { time: timestamp, type: `${channel.toUpperCase()} (MOCK)`, message: `Offline dispatch simulated successfully: target ${target}` },
        ...prev
      ]);
    }

    setTimeout(() => {
      setTestSent("");
      setTestResult(null);
    }, 6000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-heading tracking-tight flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#E5A93C]" /> Multi-Channel Alerts & Notifications
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Page intro */}
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-heading tracking-tight">Notification Node Configuration</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure active listeners to deliver real-time summarized alerts directly to your operational communication channels.</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20 font-mono text-[10px] uppercase">
                <Cpu className="w-3.5 h-3.5 animate-spin" /> Node Orchestrator Active
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (Inputs, Configurations & Toggles) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 3 Configurations side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Telegram Config */}
                  <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between min-h-[24rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#24A1DE]/5 rounded-bl-full -z-10 transition-transform group-hover:scale-105" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded bg-[#24A1DE]/10 border border-[#24A1DE]/20 flex items-center justify-center text-[#24A1DE]">
                          <Send className="w-5 h-5" />
                        </div>
                        <button 
                          onClick={() => setToggles({ ...toggles, telegram: !toggles.telegram })}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${toggles.telegram ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted-foreground border border-white/10"}`}
                        >
                          {toggles.telegram ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </div>

                      <h3 className="font-heading font-bold text-white text-base">Telegram Secure Bot</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Delivers direct operational updates, bid closing alarms, and audit reports to your channels.
                      </p>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Bot Father Token</label>
                        <Input 
                          value={telegramToken}
                          onChange={(e) => setTelegramToken(e.target.value)}
                          className="bg-black/25 border-white/10 h-8 font-mono text-xs focus-visible:ring-[#24A1DE]/50"
                        />
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Chat ID / Group ID</label>
                        <Input 
                          value={telegramChatId}
                          onChange={(e) => setTelegramChatId(e.target.value)}
                          className="bg-black/25 border-white/10 h-8 font-mono text-xs focus-visible:ring-[#24A1DE]/50"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleTestAlert("Telegram")}
                      className="w-full py-2 bg-white/5 border border-white/10 hover:bg-[#24A1DE]/10 hover:border-[#24A1DE]/30 text-[#F3F4F6] text-xs font-mono font-semibold transition-all mt-6 rounded"
                    >
                      {testSent === "Telegram" ? "✓ Tele-Alert Sent!" : "Send Test Telegram"}
                    </button>
                  </div>

                  {/* WhatsApp Config */}
                  <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between min-h-[24rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/5 rounded-bl-full -z-10 transition-transform group-hover:scale-105" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <button 
                          onClick={() => setToggles({ ...toggles, whatsapp: !toggles.whatsapp })}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${toggles.whatsapp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted-foreground border border-white/10"}`}
                        >
                          {toggles.whatsapp ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </div>

                      <h3 className="font-heading font-bold text-white text-base">WhatsApp Webhook</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Aggregates critical warning logs and regulatory observations directly onto verified mobile nodes.
                      </p>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Recipient Phone Number</label>
                        <Input 
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          className="bg-black/25 border-white/10 h-8 font-mono text-xs focus-visible:ring-[#25D366]/50"
                        />
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">API Webhook Route</label>
                        <Input 
                          disabled
                          value="https://api.intellisector.com/v2/whatsapp"
                          className="bg-black/40 border-white/5 h-8 font-mono text-xs text-muted-foreground/60"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleTestAlert("WhatsApp")}
                      className="w-full py-2 bg-white/5 border border-white/10 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 text-[#F3F4F6] text-xs font-mono font-semibold transition-all mt-6 rounded"
                    >
                      {testSent === "WhatsApp" ? "✓ WhatsApp Sent!" : "Send Test WhatsApp"}
                    </button>
                  </div>

                  {/* Secure Email Config */}
                  <div className="p-5 rounded-xl glass border border-white/5 flex flex-col justify-between min-h-[24rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A93C]/5 rounded-bl-full -z-10 transition-transform group-hover:scale-105" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded bg-[#E5A93C]/10 border border-[#E5A93C]/20 flex items-center justify-center text-[#E5A93C]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <button 
                          onClick={() => setToggles({ ...toggles, email: !toggles.email })}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${toggles.email ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted-foreground border border-white/10"}`}
                        >
                          {toggles.email ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </div>

                      <h3 className="font-heading font-bold text-white text-base">Secure Email Digest</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Receives a daily compiled PDF executive digest reporting all analyzed corporate updates.
                      </p>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Corporate Email</label>
                        <Input 
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="bg-black/25 border-white/10 h-8 font-mono text-xs focus-visible:ring-[#E5A93C]/50"
                        />
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Encryption Standard</label>
                        <Input 
                          disabled
                          value="SSL/TLS Secured (End-To-End)"
                          className="bg-black/40 border-white/5 h-8 font-mono text-xs text-muted-foreground/60"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleTestAlert("Email")}
                      className="w-full py-2 bg-white/5 border border-white/10 hover:bg-[#E5A93C]/10 hover:border-[#E5A93C]/30 text-[#F3F4F6] text-xs font-mono font-semibold transition-all mt-6 rounded"
                    >
                      {testSent === "Email" ? "✓ Email Sent!" : "Send Test Email"}
                    </button>
                  </div>

                </div>

                {/* Surveillance Event Triggers Section */}
                <div className="p-5 rounded-xl glass border border-white/5 space-y-4">
                  <h3 className="font-heading font-bold text-white text-base">Surveillance Event Triggers</h3>
                  <p className="text-xs text-muted-foreground">Select what categories of scraped industrial information automatically initiate multi-channel pushes.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">FDA Compliance</span>
                        <span className="text-[10px] text-muted-foreground font-mono leading-none">Form 483 warnings & audits</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={toggles.fda} 
                        onChange={() => setToggles({ ...toggles, fda: !toggles.fda })} 
                        className="w-4 h-4 rounded border-white/10 bg-black/25 text-[#E5A93C] focus:ring-[#E5A93C]/50 accent-[#E5A93C] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">High Value Tenders</span>
                        <span className="text-[10px] text-muted-foreground font-mono leading-none">Value &gt; ₹1,000 Cr contracts</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={toggles.tenders} 
                        onChange={() => setToggles({ ...toggles, tenders: !toggles.tenders })} 
                        className="w-4 h-4 rounded border-white/10 bg-black/25 text-[#E5A93C] focus:ring-[#E5A93C]/50 accent-[#E5A93C] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">Energy Tariff Reviews</span>
                        <span className="text-[10px] text-muted-foreground font-mono leading-none">PNGRB cap revisions & updates</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={toggles.tariffs} 
                        onChange={() => setToggles({ ...toggles, tariffs: !toggles.tariffs })} 
                        className="w-4 h-4 rounded border-white/10 bg-black/25 text-[#E5A93C] focus:ring-[#E5A93C]/50 accent-[#E5A93C] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Operational Dispatch Log Terminal) */}
              <div className="space-y-6">
                
                {/* Breathtaking Dispatch Terminal */}
                <div className="p-5 rounded-xl glass border border-white/5 h-[34rem] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E5A93C]/5 rounded-full blur-3xl -z-10" />
                  
                  <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="font-mono text-xs text-[#E5A93C] uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Operational Dispatch Log
                      </span>
                      <RefreshCw className="w-3 h-3 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
                    </div>

                    {/* Live Scrolling Terminal */}
                    <div className="flex-1 bg-black/45 rounded-lg border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-y-auto space-y-3.5 scrollbar-thin">
                      {logs.map((log, idx) => (
                        <div key={idx} className="space-y-0.5 border-l border-emerald-500/20 pl-2">
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                            <span>[{log.time}]</span>
                            <span className="text-amber-500 font-bold">{log.type}</span>
                          </div>
                          <p className="text-gray-300">{log.message}</p>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Listening for new sector triggers...
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>SECURE HANDSHAKE STATUS</span>
                      <span className="text-emerald-400 font-bold">SSL VERIFIED</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[88%] animate-pulse" />
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Test success state notification bar at bottom */}
            {testResult && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400 animate-in fade-in slide-in-from-bottom duration-300">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold font-mono text-[10px] uppercase block mb-1">
                    {testResult.message_id ? `Alert Dispatched (${testResult.message_id}):` : "Alert Successfully Pushed:"}
                  </span>
                  {testResult.delivered_payload}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
