import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calculator, 
  Package, 
  PenTool, 
  Network 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Mode } from '@/types';

interface SidebarProps {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
}

export function Sidebar({ currentMode, setMode }: SidebarProps) {
  const menuItems = [
    { mode: Mode.DASHBOARD, label: 'Command Center', icon: LayoutDashboard },
    { mode: Mode.ROI_ANALYST, label: 'ROI Analyst', icon: Calculator },
    { mode: Mode.PRODUCT_SYNTHESIZER, label: 'Product Synthesizer', icon: Package },
    { mode: Mode.GHOSTWRITER, label: 'Ghostwriter', icon: PenTool },
    { mode: Mode.SYSTEM_ARCHITECT, label: 'System Architect', icon: Network },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0">
      <div className="p-6 border-b border-[#1a1a1a]">
        <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff00] rounded-full shadow-[0_0_10px_#00ff00]" />
          SHADOW OS
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-mono">v2.4.0 // ACTIVE</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              currentMode === item.mode
                ? "bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="bg-black/40 p-3 rounded-lg border border-[#1a1a1a]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-mono">SYSTEM STATUS</span>
            <span className="text-xs text-[#00ff00] font-mono">ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
