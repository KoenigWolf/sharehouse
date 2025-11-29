export interface HouseRule {
  id: string;
  title: string;
  description: string;
  category: "living" | "cleaning" | "noise" | "safety" | "other";
  effectiveFrom?: string; // ISO date
  details?: string;
}
