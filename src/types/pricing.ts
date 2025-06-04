export interface PeakDay {
  id: number;
  pricing_id: number;
  date: string;
  created_at: string;
}

export interface Pricing {
  id: number;
  distance1: string;
  rate1: number;
  distance2: string;
  rate2: number;
  distance3: string;
  rate3: number;
  distance4: string;
  rate4: number;
  created_at: string;
  peak_days: PeakDay[];
}

export interface PricingResponse {
  data: Pricing;
  message: string;
  success: boolean;
}

export interface PatchPricingPayload {
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  peak_days: string[];
}