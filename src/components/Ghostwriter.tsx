import React, { useState } from 'react';
import { PenTool, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from "@/context/AppContext";

export function Ghostwriter() {
  const { productName, setProductName, painPoints, setPainPoints, followers, revenueGap, ghostwriterResult, setGhostwriterResult } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!productName || !painPoints) return;
    
    setIsGenerating(true);
    try {
      // نرسل الطلب إلى العقل السحابي الذي أنشأناه في مجلد api
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Act as a High-Ticket Direct Response Copywriter (Iman Gadzhi Style).
          Analyze this Product: ${productName}
          Focus on these Pain Points: ${painPoints}
          Current Audience Size: ${followers} followers
          Potential Revenue Leakage: $${revenueGap} monthly
          
          Deliver:
          1. 14-Day Aggressive Launch Plan.
          2. 3 High-Converting IG Reels Scripts (Hook, Body, CTA). Mention the revenue leakage to agitate the pain.
          3. 2 Cold DM Scripts for Outreach.
          
          Tone: Authoritative, Minimalist, Elite. Language: English.`
        }),
      });

      const data = await response.json();
      setGhostwriterResult(data.result || "Failed to generate assets.");
    } catch (error) {
      console.error("Generation failed", error);
      setGhostwriterResult("Error: Cloud Engine is still waking up. Please try again in 10 seconds.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <PenTool className="text-green-500" />
          Ghostwriter AI
        </h2>
        <p className="text-zinc-500 mt-2">Deploy aggressive direct-response assets for the Global Market.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. 6-Figure Fitness Systems"
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Core Pain Points</label>
              <textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder="e.g. Coaches trading time for money, lack of high-ticket clients..."
                className="w-full h-48 bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !productName || !painPoints}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  ANALYZING MARKET...
                </>
              ) : (
                <>
                  <Send size={18} />
                  DEPLOY ASSETS
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl overflow-y-auto max-h-[calc(100vh-250px)]">
          {ghostwriterResult ? (
            <div className="prose prose-invert prose-green max-w-none text-left">
              <ReactMarkdown>{ghostwriterResult}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50 text-center">
              <PenTool size={48} className="mb-4" />
              <p>Waiting for Input Data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
