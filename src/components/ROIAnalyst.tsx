import { useAppContext } from "@/context/AppContext";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calculator, ArrowRight, Instagram, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ROIAnalyst() {
  const { 
    followers, setFollowers, 
    engagementRate, setEngagementRate, 
    productPrice, setProductPrice, 
    revenueGap, 
    instagramUrl, setInstagramUrl, 
    setNiche,
    setSynthesizedProduct,
    setProductName,
    setPainPoints,
    setGhostwriterResult
  } = useAppContext();
  const [isScraping, setIsScraping] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScraping) {
      const messages = [
        "Bypassing Firewalls...", 
        "Rotating Proxies...", 
        "Establishing Connection...",
        "Extracting Bio Data...",
        "Synthesizing Digital Products...",
        "Drafting Viral Copy...",
        "Mapping Context Payload..."
      ];
      let i = 0;
      setLoadingMsg(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMsg(messages[i]);
      }, 1500);
    } else {
      setLoadingMsg("");
    }
    return () => clearInterval(interval);
  }, [isScraping]);

  const handleScrape = async () => {
    if (!instagramUrl) return;
    setIsScraping(true);
    try {
      const response = await fetch('/api/fetch-ig-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instagramUrl })
      });
      const data = await response.json();
      if (data.success) {
        setFollowers(data.followers);
        const targetBio = data.bio || `Instagram Profile: ${instagramUrl}`;
        setNiche(targetBio);
        
        // Phase 2: Automatic Product Synthesis
        const synthRes = await fetch('/api/synthesize', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ niche: targetBio, rawContent: `Create 3 digital product ideas based on this profile.`, followers: data.followers })
        });
        const synthData = await synthRes.json();
        if (synthData.result) {
            setSynthesizedProduct(synthData.result);
            
            // Define default context for Ghostwriter
            setProductName("Elite Digital Product / Mentorship");
            setPainPoints("Converting free followers to high-ticket paid users, lack of automated revenue systems.");
            
            // Phase 3: Automatic Ghostwriter Copy Generation
            const currentGap = Math.round(data.followers * (engagementRate / 100) * productPrice);
            const ghostRes = await fetch('/api/analyze', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 content: `Do NOT repeat the input data. You are a High-Level Growth Strategist. 
                 Analyze the following Instagram profile (Followers, Niche, Bio) and provide a viral marketing script. 
                 Be specific to the niche.
                 
                 Profile Stats:
                 Bio/Niche: ${targetBio}
                 Current Audience Size: ${data.followers} followers
                 Potential Revenue Leakage: $${currentGap} monthly
                 
                 Deliver:
                 1. A Viral Hook for an IG Reel
                 2. A Sales Script for Cold DMs
                 
                 Tone: Authoritative, Minimalist, Elite.`
               })
            });
            const ghostData = await ghostRes.json();
            if (ghostData.result) {
                setGhostwriterResult(ghostData.result);
            }
        }
      } else {
        alert(data.error || "Failed to fetch profile");
      }
    } catch (e) {
      alert("System error scraping profile");
    } finally {
      setIsScraping(false);
    }
  };

  // revenueGap is now calculated globally in AppContext

  const data = [
    { name: "Current", value: 0 },
    { name: "Projected", value: revenueGap },
  ];

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Calculator className="text-shadow-accent" />
          ROI Analyst
        </h2>
        <p className="text-shadow-muted mt-2">Calculate revenue leakage based on audience metrics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Input Panel */}
        <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl space-y-6">
          <div className="bg-shadow-bg p-4 rounded-xl border border-shadow-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-shadow-muted mb-2">Automated Data Sync</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="IG Username/URL"
                  className="flex-1 bg-transparent border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none font-mono text-sm"
                />
                <button 
                  onClick={handleScrape}
                  disabled={isScraping || !instagramUrl}
                  className="bg-shadow-accent hover:bg-green-600 text-black px-4 rounded-lg font-bold flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                  {isScraping ? <Loader2 size={18} className="animate-spin" /> : <Instagram size={18} />}
                </button>
              </div>
              {isScraping && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-shadow-accent mt-2 font-mono"
                >
                  {loadingMsg}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-shadow-muted mb-2">Follower Count</label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(Number(e.target.value))}
              className="w-full bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-shadow-muted mb-2">Engagement Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={engagementRate}
              onChange={(e) => setEngagementRate(Number(e.target.value))}
              className="w-full bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-shadow-muted mb-2">Product Price ($)</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none font-mono"
            />
          </div>

          <div className="pt-6 border-t border-shadow-border">
            <div className="bg-shadow-accent/10 p-4 rounded-lg border border-shadow-accent/20">
              <p className="text-xs text-shadow-accent font-mono mb-1">REVENUE GAP DETECTED</p>
              <p className="text-3xl font-bold text-white font-mono">
                ${revenueGap.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 bg-shadow-card border border-shadow-border p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Potential Visualization</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                <YAxis stroke="#666" tick={{ fill: '#666' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-shadow-bg rounded-lg border border-shadow-border flex items-start gap-3">
             <div className="p-2 bg-shadow-accent/10 rounded-full">
               <ArrowRight size={16} className="text-shadow-accent" />
             </div>
             <div>
               <p className="text-sm text-white font-medium">Strategic Insight</p>
               <p className="text-xs text-shadow-muted mt-1">
                 You are currently leaving <span className="text-white font-mono">${revenueGap.toLocaleString()}</span> on the table monthly by not monetizing your engaged audience with a structured product.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
