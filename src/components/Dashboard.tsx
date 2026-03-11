import { motion } from "motion/react";
import { Activity, DollarSign, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const stats = [
    { label: "Active Funnels", value: "3", icon: Activity, change: "+12%" },
    { label: "Revenue Gap", value: "$42,500", icon: DollarSign, change: "-5%" },
    { label: "Total Leads", value: "1,240", icon: Users, change: "+18%" },
    { label: "System Efficiency", value: "94%", icon: Zap, change: "+2%" },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>
        <p className="text-shadow-muted mt-2">Overview of active revenue systems.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-shadow-card border border-shadow-border p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-shadow-bg rounded-lg border border-shadow-border">
                <stat.icon className="text-shadow-accent" size={20} />
              </div>
              <span className={cn(
                "text-xs font-mono px-2 py-1 rounded-full",
                stat.change.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">{stat.value}</h3>
            <p className="text-sm text-shadow-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-shadow-accent" />
                <div className="flex-1">
                  <p className="text-sm text-white">New lead captured via 'SYSTEM' keyword</p>
                  <p className="text-xs text-shadow-muted font-mono">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-500 text-sm font-medium">Optimization Required</p>
              <p className="text-shadow-muted text-xs mt-1">Engagement rate dropped by 0.5% on recent post.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

