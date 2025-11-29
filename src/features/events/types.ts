export interface EventInfo {
  id: string;
  title: string;
  date: string; // ISO date
  location: string;
  description: string;
  type: "upcoming" | "past";
  coverImage?: string | null;
  tags?: string[];
}
