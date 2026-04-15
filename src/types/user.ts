export type Gender = "Masculino" | "Feminino" | "Outro";

export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  birthDate: string; // formato ISO: YYYY-MM-DD
  rating: number;
  totalRatings: number;
  bio: string;
  avatar?: string;
}