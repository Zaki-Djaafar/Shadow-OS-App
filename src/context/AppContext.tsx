import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
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
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [followers, setFollowers] = useState(10000);
  const [engagementRate, setEngagementRate] = useState(3.5);
  const [productPrice, setProductPrice] = useState(49);
  
  const [productName, setProductName] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [niche, setNiche] = useState("");
  const [synthesizedProduct, setSynthesizedProduct] = useState("");

  const revenueGap = Math.round(followers * (engagementRate / 100) * productPrice);

  return (
    <AppContext.Provider value={{
      followers, setFollowers,
      engagementRate, setEngagementRate,
      productPrice, setProductPrice,
      revenueGap,
      productName, setProductName,
      painPoints, setPainPoints,
      niche, setNiche,
      synthesizedProduct, setSynthesizedProduct
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
