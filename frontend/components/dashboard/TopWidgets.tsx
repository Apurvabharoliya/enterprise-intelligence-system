"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, AlertTriangle, Briefcase } from "lucide-react";

const stats = [
  {
    title: "Breaking News",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Live Tenders",
    value: "3,842",
    change: "+4.1%",
    trend: "up",
    icon: Briefcase,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "AI Opportunities",
    value: "142",
    change: "+28.4%",
    trend: "up",
    icon: TrendingUp,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "High Risk Alerts",
    value: "18",
    change: "-2.3%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function TopWidgets() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card className="glass overflow-hidden relative group border-white/5 hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-xl-bl-full -z-10 transition-transform group-hover:scale-110 ${stat.bg}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-[#555555] font-sans">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl-md ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono tracking-tight">{stat.value}</div>
              <p className="text-xs text-[#555555] mt-1 flex items-center gap-1 font-mono">
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                  {stat.change}
                </span>
                {" "}from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
