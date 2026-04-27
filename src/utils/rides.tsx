import type { MyRide } from "../types/my-ride";

const STORAGE_KEY = "myRides";

function normalizeRide(ride: any): MyRide {
  return {
    ...ride,

    price: Number(ride.price ?? 0),

    totalSeats: Number(ride.totalSeats ?? ride.seats ?? 0),

    availableSeats: Number(
      ride.availableSeats ??
      ride.totalSeats ??
      ride.seats ??
      0
    ),

    requests: Array.isArray(ride.requests)
      ? ride.requests
      : [],

    confirmedPassengers: Array.isArray(
      ride.confirmedPassengers
    )
      ? ride.confirmedPassengers
      : [],

    sameGenderOnly: Boolean(
      ride.sameGenderOnly
    ),

    status: ride.status ?? "active",

    createdAt:
      ride.createdAt ??
      new Date().toISOString(),

    routeId: ride.routeId ?? "",

    routeName:
      ride.routeName ?? "Nova rota",

    departureTimeStart:
      ride.departureTimeStart ??
      ride.timeStart ??
      "",

    departureTimeEnd:
      ride.departureTimeEnd ??
      ride.timeEnd ??
      "",
  };
}

export function getMyRides(): MyRide[] {
  try {
    const data =
      localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) return [];

    return parsed.map(normalizeRide);
  } catch {
    return [];
  }
}

export function saveRide(
  ride: MyRide
): void {
  const rides = getMyRides();

  rides.push(normalizeRide(ride));

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(rides)
  );
}

export function clearRides(): void {
  localStorage.removeItem(STORAGE_KEY);
}