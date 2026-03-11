export enum Mode {
  DASHBOARD = 'DASHBOARD',
  ROI_ANALYST = 'ROI_ANALYST',
  PRODUCT_SYNTHESIZER = 'PRODUCT_SYNTHESIZER',
  GHOSTWRITER = 'GHOSTWRITER',
  SYSTEM_ARCHITECT = 'SYSTEM_ARCHITECT',
}

export interface ROIInput {
  followers: number;
  engagementRate: number;
  productPrice: number;
}

export interface ProductIdea {
  niche: string;
  rawContent: string;
  targetAudience: string;
}

export interface GhostwriterInput {
  productName: string;
  niche: string;
  painPoints: string;
}
