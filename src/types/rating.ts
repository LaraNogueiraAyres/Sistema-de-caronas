export interface Rating {
  id: string;
  raterId: string;
  raterName: string;
  ratedUserId: string;
  rating: number; // 1-5
  comment: string;
  rideId: string;
  createdAt: string; // ISO date
  role: "driver" | "passenger"; // papel do usuario avaliado na carona
}
