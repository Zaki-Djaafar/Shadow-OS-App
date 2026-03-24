import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

const Ghostwriter = () => {
  const [target, setTarget] = useState('');
  const [offer, setOffer] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `اكتب سكريبت إعلاني احترافي لإنستقرام ريلز. 
          الجمهور المستهدف: ${target}. 
          العرض المقدم: ${offer}. 
          نقطة الألم التي نركز عليها: ${painPoint}. 
          اجعل الأسلوب قديراً (Heiba) ومقنعاً جداً بنظام Shadow OS.`
        }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult("خطأ في الاتصال بالمحرك السحابي. تأكد من إعداد API Key.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 text-green-400 mb-4">
        <Sparkles size={24} />
        <h2 className="text-2xl font-bold tracking-wider">GHOSTWRITER AI</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          placeholder="الجمهور (مثلاً: موظفين مشغولين)" 
          className="bg-black border border-green-900/30 p-3 rounded text-white focus:border-green-500 outline-none"
          value={target} onChange={(e) => setTarget(e.target.value)}
        />
        <input 
          placeholder="العرض (مثلاً: تدريب 1-on-1)" 
          className="bg-black border border-green-900/30 p-3 rounded text-white focus:border-green-500 outline-none"
          value={offer} onChange={(e) => setOffer(e.target.value)}
        />
        <input 
          placeholder="نقطة الألم (مثلاً: ضيق الوقت)" 
          className="bg-black border border-green-900/30 p-3 rounded text-white focus:border-green-500 outline-none"
          value={painPoint} onChange={(e) => setPainPoint(e.target.value)}
        />
      </div>

      <button 
        onClick={generateContent}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded flex items-center justify-center transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
        توليد المحتوى الإعلاني
      </button>

      {result && (
        <div className="mt-6 p-4 bg-zinc-900 border-l-4 border-green-500 rounded text-right whitespace-pre-wrap leading-relaxed">
          {result}
        </div>
      )}
    </div>
  );
};

export default Ghostwriter;
