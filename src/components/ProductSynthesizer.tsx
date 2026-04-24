import { useState } from "react";
import { Package, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppContext } from "@/context/AppContext";

export function ProductSynthesizer() {
  const { niche, setNiche, synthesizedProduct, setSynthesizedProduct } = useAppContext();
  const [rawContent, setRawContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!niche || !rawContent) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, rawContent }),
      });
      const data = await response.json();
      setSynthesizedProduct(data.result || "Failed to generate content.");
    } catch (error) {
      console.error("Generation failed", error);
      setSynthesizedProduct("Error: Could not connect to Shadow OS AI Core.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Package className="text-shadow-accent" />
          Product Synthesizer
        </h2>
        <p className="text-shadow-muted mt-2">Transform raw expertise into structured digital assets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-shadow-muted mb-2">Target Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Busy Dads over 40"
                className="w-full bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-shadow-muted mb-2">Raw Content / Expertise</label>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste brain dump, notes, or rough ideas here..."
                className="w-full h-64 bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !niche || !rawContent}
              className="w-full bg-shadow-accent hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  SYNTHESIZING...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  GENERATE STRUCTURE
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl overflow-y-auto max-h-[calc(100vh-200px)]">
          {synthesizedProduct ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{synthesizedProduct}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-shadow-muted opacity-50">
              <Package size={48} className="mb-4" />
              <p>Waiting for input data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
