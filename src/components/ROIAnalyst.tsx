import { useAppContext } from "@/context/AppContext";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calculator, ArrowRight } from "lucide-react";

export function ROIAnalyst() {
  const { followers, setFollowers, engagementRate, setEngagementRate, productPrice, setProductPrice, revenueGap } = useAppContext();

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
