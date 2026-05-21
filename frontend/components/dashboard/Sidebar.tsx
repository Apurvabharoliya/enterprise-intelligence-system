"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Newspaper, 
  Briefcase, 
  CalendarDays, 
  Eye, 
  Lightbulb, 
  BellRing, 
  FileText, 
  LineChart, 
  Settings,
  Home,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "News Intel", href: "/news", icon: Newspaper },
  { name: "Tender Intel", href: "/tenders", icon: Briefcase },
  { name: "Event Tracker", href: "/events", icon: CalendarDays },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 rounded-full bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 flex flex-col border-r border-border bg-[#0A0D10]/95 backdrop-blur-xl h-full z-[50]",
        "fixed lg:static top-0 left-0 transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="font-heading font-bold text-xl tracking-wide flex items-center gap-2 hover:opacity-85 transition-opacity">
          <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-emerald-500 via-amber-500 to-violet-500" />
          Intelli<span className="text-muted-foreground font-light">Sector</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <Home className="w-5 h-5 text-rose-400 group-hover:text-white" />
          Exit Command Center
        </Link>
      </div>
    </aside>
    </>
  );
}
