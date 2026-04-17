import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, DollarSign, Users, Zap, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import ReactMarkdown from "react-markdown";

const HackerLoader = () => {
  const phrases = [
    "INITIALIZING NEURAL LINK...",
    "BYPASSING WHOP SECURE NET...",
    "COMPILING DIRECT RESPONSE NODES...",
    "EXTRACTING CONVERSION METRICS...",
    "ARCHITECTING BLUEPRINT..."
  ];
  const [text, setText] = useState(phrases[0]);
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setText(phrases[i]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center text-shadow-accent font-mono text-center space-y-4">
      <Loader2 size={48} className="animate-spin" />
      <motion.p 
        key={text} 
        initial={{ opacity: 0, y: 5 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="tracking-widest"
      >
        {text}
      </motion.p>
    </div>
  );
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "automation">("overview");
  const { synthesizedProduct, instagramUrl, setInstagramUrl } = useAppContext();
  const [manyChatPlan, setManyChatPlan] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = [
    { label: "Active Funnels", value: "3", icon: Activity, change: "+12%" },
    { label: "Revenue Gap", value: "$42,500", icon: DollarSign, change: "-5%" },
    { label: "Total Leads", value: "1,240", icon: Users, change: "+18%" },
    { label: "System Efficiency", value: "94%", icon: Zap, change: "+2%" },
  ];

  const handleGenerateAutomation = async () => {
    if (!synthesizedProduct) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/manychat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: synthesizedProduct }),
      });
      const data = await response.json();
      setManyChatPlan(data.result || "Failed to generate automation plan.");
    } catch (error) {
      console.error(error);
      setManyChatPlan("Error connecting to server.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>
          <p className="text-shadow-muted mt-2">Overview of active revenue systems.</p>
        </div>
        <div className="flex bg-shadow-bg border border-shadow-border rounded-lg p-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "overview" ? "bg-shadow-card text-white shadow-sm" : "text-shadow-muted hover:text-white")}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("automation")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "automation" ? "bg-shadow-card text-white shadow-sm" : "text-shadow-muted hover:text-white")}
          >
            Automation Blueprint
          </button>
        </div>
      </header>

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Instagram Data Link */}
          <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-shadow-muted mb-2">Primary Instagram Link</label>
              <div className="flex bg-shadow-bg border border-shadow-border py-1 px-2 rounded-lg items-center">
                 <span className="text-shadow-muted px-2">ig://</span>
                 <input
                   type="text"
                   value={instagramUrl}
                   onChange={(e) => setInstagramUrl(e.target.value)}
                   placeholder="e.g. https://instagram.com/shadow_os"
                   className="w-full bg-transparent text-white focus:outline-none p-2 font-mono text-sm"
                 />
              </div>
            </div>
          </div>

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
      )}

      {activeTab === "automation" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-shadow-card border border-shadow-border p-6 rounded-xl min-h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="text-shadow-accent" />
              ManyChat Automation Architecture
            </h3>
            <button
              onClick={handleGenerateAutomation}
              disabled={isGenerating || !synthesizedProduct}
              className="bg-shadow-accent hover:bg-green-600 text-black font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {isGenerating ? "GENERATING..." : "GENERATE FLOW"}
            </button>
          </div>
          
          <div className="flex-1 bg-shadow-bg border border-shadow-border rounded-lg p-4 overflow-y-auto min-h-[300px]">
            {isGenerating ? (
              <HackerLoader />
            ) : !synthesizedProduct ? (
              <div className="h-full flex flex-col items-center justify-center text-shadow-muted text-center opacity-70">
                <p className="font-mono">NO DATA STREAM DETECTED.</p>
                <p className="text-sm">Synthesize a product profile first to architect the flow.</p>
              </div>
            ) : manyChatPlan ? (
              <div className="prose prose-invert prose-green max-w-none font-mono text-sm leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown>{manyChatPlan}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-shadow-muted text-center opacity-70">
                <p className="font-mono">PRODUCT STREAM READY.</p>
                <p className="text-sm">Initiate generation sequence to extract ManyChat flow.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
