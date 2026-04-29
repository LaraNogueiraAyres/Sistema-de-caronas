import type { Rating } from "../types/rating";
import { mockUsers } from "./user";

const driverComments = [
  "Motorista pontual, cuidadoso e muito educado durante todo o trajeto.",
  "Viagem tranquila, carro organizado e combinados cumpridos certinho.",
  "Dirige muito bem e passou bastante seguranca no caminho.",
];

const passengerComments = [
  "Passageiro pontual, educado e respeitou todos os combinados.",
  "Otima companhia na viagem e chegou no ponto no horario marcado.",
  "Pessoa tranquila, comunicativa e muito facil de combinar a carona.",
];

const getRater = (ratedUserId: string, offset: number) => {
  const availableUsers = mockUsers.filter((user) => user.id !== ratedUserId);
  return availableUsers[offset % availableUsers.length];
};

export const mockRatings: Rating[] = mockUsers.flatMap((user, userIndex) => {
  const driverRaters = [
    getRater(user.id, userIndex),
    getRater(user.id, userIndex + 3),
  ];
  const passengerRaters = [
    getRater(user.id, userIndex + 5),
    getRater(user.id, userIndex + 7),
  ];

  const driverRatings: Rating[] = driverRaters.map((rater, ratingIndex) => ({
    id: `rating-${user.id}-driver-${ratingIndex + 1}`,
    raterId: rater.id,
    raterName: rater.name,
    ratedUserId: user.id,
    rating: ratingIndex === 0 ? 5 : 4,
    comment: driverComments[(userIndex + ratingIndex) % driverComments.length],
    rideId: `ride-${user.id}-driver-${ratingIndex + 1}`,
    createdAt: `2026-04-${String(18 - ratingIndex - (userIndex % 5)).padStart(
      2,
      "0",
    )}`,
    role: "driver",
  }));

  const passengerRatings: Rating[] = passengerRaters.map(
    (rater, ratingIndex) => ({
      id: `rating-${user.id}-passenger-${ratingIndex + 1}`,
      raterId: rater.id,
      raterName: rater.name,
      ratedUserId: user.id,
      rating: ratingIndex === 0 ? 5 : 4,
      comment:
        passengerComments[(userIndex + ratingIndex) % passengerComments.length],
      rideId: `ride-${user.id}-passenger-${ratingIndex + 1}`,
      createdAt: `2026-04-${String(10 - ratingIndex - (userIndex % 4)).padStart(
        2,
        "0",
      )}`,
      role: "passenger",
    }),
  );

  return [...driverRatings, ...passengerRatings];
});

export function getRatingsByUserId(userId: string): Rating[] {
  return mockRatings.filter((rating) => rating.ratedUserId === userId);
}

export function getRatingsByUserIdAndRole(
  userId: string,
  role: "driver" | "passenger",
): Rating[] {
  return mockRatings.filter(
    (rating) => rating.ratedUserId === userId && rating.role === role,
  );
}
