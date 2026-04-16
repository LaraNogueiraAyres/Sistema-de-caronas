export interface PassengerRequest {
  id: string;
  passenger: {
    id: string;
    name: string;
    gender: string;
    rating: number;
    totalRatings: number;
    phone: string;
  };
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
}

export interface MyRide {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTimeStart: string;
  departureTimeEnd: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  routeId: string;
  routeName: string;
  status: "active" | "completed" | "cancelled";
  sameGenderOnly: boolean;
  requests: PassengerRequest[];
  confirmedPassengers: PassengerRequest[];
  createdAt: string;
}

// Tipo para caronas recebidas (como passageiro)
export interface MyRideAsPassenger {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTimeStart: string;
  departureTimeEnd: string;
  price: number;
  routeName: string;
  status: "pending" | "confirmed" | "cancelled";
  sameGenderOnly: boolean;
  driver: {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    phone: string;
  };
  requestedAt: string;
}