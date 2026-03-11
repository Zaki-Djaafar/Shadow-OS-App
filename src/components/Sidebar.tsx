import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calculator, 
  Package, 
  PenTool, 
  Network, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Mode } from '@/types';

interface SidebarProps {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ currentMode, setMode, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { mode: Mode.DASHBOARD, label: 'Command Center', icon: LayoutDashboard },
    { mode: Mode.ROI_ANALYST, label: 'ROI Analyst', icon: Calculator },
    { mode: Mode.PRODUCT_SYNTHESIZER, label: 'Product Synthesizer', icon: Package },
    { mode: Mode.GHOSTWRITER, label: 'Ghostwriter', icon: PenTool },
    { mode: Mode.SYSTEM_ARCHITECT, label: 'System Architect', icon: Network },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-shadow-card border border-shadow-border rounded-md md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-shadow-card border-r border-shadow-border flex flex-col",
          "md:translate-x-0 md:relative"
        )}
      >
        <div className="p-6 border-b border-shadow-border">
          <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-shadow-accent rounded-full animate-pulse" />
            SHADOW OS
          </h1>
          <p className="text-xs text-shadow-muted mt-1 font-mono">v2.4.0 // SYSTEM_ACTIVE</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                setMode(item.mode);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                currentMode === item.mode
                  ? "bg-shadow-accent/10 text-shadow-accent border border-shadow-accent/20"
                  : "text-shadow-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-shadow-border">
          <div className="bg-black/40 p-3 rounded-lg border border-shadow-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-shadow-muted font-mono">SYSTEM STATUS</span>
              <span className="text-xs text-shadow-accent font-mono">ONLINE</span>
            </div>
            <div className="w-full bg-shadow-border h-1 rounded-full overflow-hidden">
              <div className="h-full bg-shadow-accent w-[85%]" />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
