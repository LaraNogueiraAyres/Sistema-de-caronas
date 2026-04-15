export type Gender = "Masculino" | "Feminino" | "Outro";

export interface Driver {
  name: string;
  rating: number;
  totalRatings: number;
  gender: Gender;
}

export interface Ride {
  id: string;
  driver: Driver;
  departure: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  confirmedPassengers: number;
  departureTimeStart: string;
  departureTimeEnd: string;
}