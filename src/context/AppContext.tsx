import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppState {
  instagramUrl: string;
  setInstagramUrl: (val: string) => void;

  followers: number;
  setFollowers: (val: number) => void;
  engagementRate: number;
  setEngagementRate: (val: number) => void;
  productPrice: number;
  setProductPrice: (val: number) => void;
  revenueGap: number;
  
  productName: string;
  setProductName: (val: string) => void;
  painPoints: string;
  setPainPoints: (val: string) => void;
  
  niche: string;
  setNiche: (val: string) => void;
  
  synthesizedProduct: string;
  setSynthesizedProduct: (val: string) => void;
  
  ghostwriterResult: string;
  setGhostwriterResult: (val: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Helper to load state from localStorage safely
function getInitialState<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (stored !== null) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [instagramUrl, setInstagramUrl] = useState<string>(() => getInitialState('shadowOs_instagramUrl', ''));
  const [followers, setFollowers] = useState<number>(() => getInitialState('shadowOs_followers', 10000));
  const [engagementRate, setEngagementRate] = useState<number>(() => getInitialState('shadowOs_engagementRate', 3.5));
  const [productPrice, setProductPrice] = useState<number>(() => getInitialState('shadowOs_productPrice', 49));
  
  const [productName, setProductName] = useState<string>(() => getInitialState('shadowOs_productName', ''));
  const [painPoints, setPainPoints] = useState<string>(() => getInitialState('shadowOs_painPoints', ''));
  const [niche, setNiche] = useState<string>(() => getInitialState('shadowOs_niche', ''));
  const [synthesizedProduct, setSynthesizedProduct] = useState<string>(() => getInitialState('shadowOs_synthesizedProduct', ''));
  const [ghostwriterResult, setGhostwriterResult] = useState<string>(() => getInitialState('shadowOs_ghostwriterResult', ''));

  // Sync state to local storage whenever critical state changes
  useEffect(() => {
    localStorage.setItem('shadowOs_instagramUrl', JSON.stringify(instagramUrl));
    localStorage.setItem('shadowOs_followers', JSON.stringify(followers));
    localStorage.setItem('shadowOs_engagementRate', JSON.stringify(engagementRate));
    localStorage.setItem('shadowOs_productPrice', JSON.stringify(productPrice));
    localStorage.setItem('shadowOs_productName', JSON.stringify(productName));
    localStorage.setItem('shadowOs_painPoints', JSON.stringify(painPoints));
    localStorage.setItem('shadowOs_niche', JSON.stringify(niche));
    localStorage.setItem('shadowOs_synthesizedProduct', JSON.stringify(synthesizedProduct));
    localStorage.setItem('shadowOs_ghostwriterResult', JSON.stringify(ghostwriterResult));
  }, [instagramUrl, followers, engagementRate, productPrice, productName, painPoints, niche, synthesizedProduct, ghostwriterResult]);

  const revenueGap = Math.round(followers * (engagementRate / 100) * productPrice);

  return (
    <AppContext.Provider value={{
      instagramUrl, setInstagramUrl,
      followers, setFollowers,
      engagementRate, setEngagementRate,
      productPrice, setProductPrice,
      revenueGap,
      productName, setProductName,
      painPoints, setPainPoints,
      niche, setNiche,
      synthesizedProduct, setSynthesizedProduct,
      ghostwriterResult, setGhostwriterResult
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
