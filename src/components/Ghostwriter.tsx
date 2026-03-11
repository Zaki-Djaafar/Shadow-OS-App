import { useState } from "react";
import { PenTool, Loader2, Send } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

export function Ghostwriter() {
  const [productName, setProductName] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!productName || !painPoints) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Act as the "Shadow OS" Ghostwriter.
        Write aggressive, direct-response marketing copy for the following product.
        Focus on "Fear of Loss" and "System Efficiency".
        
        Product Name: ${productName}
        Core Pain Points: ${painPoints}
        
        Output Required:
        1. 14-Day Launch Plan (Brief daily actions)
        2. 3 High-Converting IG Stories (Script format)
        3. 2 DM Scripts (Outbound & Inbound)
        
        Tone: Minimalist, authoritative, urgent. No fluff.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setResult(response.text || "Failed to generate copy.");
    } catch (error) {
      console.error("Generation failed", error);
      setResult("Error: Could not connect to Shadow OS AI Core.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <PenTool className="text-shadow-accent" />
          Ghostwriter
        </h2>
        <p className="text-shadow-muted mt-2">Deploy aggressive direct-response assets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-shadow-muted mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. The 4-Hour Body Protocol"
                className="w-full bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-shadow-muted mb-2">Core Pain Points</label>
              <textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder="Describe the audience's fears and frustrations..."
                className="w-full h-48 bg-shadow-bg border border-shadow-border rounded-lg p-3 text-white focus:ring-1 focus:ring-shadow-accent outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !productName || !painPoints}
              className="w-full bg-shadow-accent hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  COMPILING ASSETS...
                </>
              ) : (
                <>
                  <Send size={18} />
                  DEPLOY COPY
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-shadow-card border border-shadow-border p-6 rounded-xl overflow-y-auto max-h-[calc(100vh-200px)]">
          {result ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-shadow-muted opacity-50">
              <PenTool size={48} className="mb-4" />
              <p>Waiting for target parameters...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
