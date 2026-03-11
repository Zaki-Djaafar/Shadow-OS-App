/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ROIAnalyst } from '@/components/ROIAnalyst';
import { ProductSynthesizer } from '@/components/ProductSynthesizer';
import { Ghostwriter } from '@/components/Ghostwriter';
import { SystemArchitect } from '@/components/SystemArchitect';
import { Mode } from '@/types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentMode) {
      case Mode.DASHBOARD:
        return <Dashboard />;
      case Mode.ROI_ANALYST:
        return <ROIAnalyst />;
      case Mode.PRODUCT_SYNTHESIZER:
        return <ProductSynthesizer />;
      case Mode.GHOSTWRITER:
        return <Ghostwriter />;
      case Mode.SYSTEM_ARCHITECT:
        return <SystemArchitect />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-shadow-bg text-shadow-text font-sans flex overflow-hidden">
      <Sidebar 
        currentMode={currentMode} 
        setMode={setCurrentMode} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Mobile Header Spacer */}
        <div className="h-16 md:hidden" />
        
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
