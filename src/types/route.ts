export interface RouteOption {
  id: string;
  name: string;
  distance: string;
  duration: string;
  traffic: "light" | "moderate" | "heavy";
  isFastest: boolean;
  isShortest: boolean;
  description: string;
  waypoints: string[];
}
