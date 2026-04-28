import type {
  HistoryRideAsPassenger,
  HistoryRideAsDriver,
} from "../types/history";

/* =====================================
   HISTORY AS PASSENGER
   Usuária logada participou como passageira
===================================== */

export const mockHistoryAsPassenger: HistoryRideAsPassenger[] = [
  {
    id: "history-passenger-1",
    date: "2026-04-10",
    departureTimeStart: "07:00",
    departureTimeEnd: "07:30",
    origin: "Centro, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    driver: {
      id: "user-7",
      name: "Lucas Ferreira",
      rating: 4.8,
      totalRatings: 110,
      gender: "Masculino",
      phone: "(82) 99333-2222",
    },

    price: 8.5,

    otherPassengers: [
      {
        id: "user-3",
        name: "Maria Oliveira",
        gender: "Feminino",
        rating: 4.7
      },
      {
        id: "user-8",
        name: "Rafael Mendonça",
        gender: "Masculino",
        rating: 4.6
      },
    ],

    sameGenderOnly: false,

    route: {
      name: "Via BR-104",
      distance: "12.5 km",
      duration: "25 min",
      waypoints: ["Centro", "Av. Fernandes Lima", "BR-104", "UFAL"],
    },

    status: "completed",
  },

  {
    id: "history-passenger-2",
    date: "2026-04-08",
    departureTimeStart: "07:15",
    departureTimeEnd: "07:45",
    origin: "Ponta Verde, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    driver: {
      id: "user-9",
      name: "Juliana Nascimento",
      rating: 5.0,
      totalRatings: 201,
      gender: "Feminino",
      phone: "(82) 98111-3344",
    },

    price: 10.0,

    otherPassengers: [
      {
        id: "user-10",
        name: "Camila Rodrigues",
        gender: "Feminino",
        rating:4.7,
      },
    ],

    sameGenderOnly: true,

    route: {
      name: "Via Av. Álvaro Otacílio",
      distance: "15.2 km",
      duration: "30 min",
      waypoints: [
        "Ponta Verde",
        "Av. Álvaro Otacílio",
        "Tabuleiro",
        "UFAL",
      ],
    },

    status: "completed",
  },

  {
    id: "history-passenger-3",
    date: "2026-04-05",
    departureTimeStart: "06:45",
    departureTimeEnd: "07:15",
    origin: "Farol, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    driver: {
      id: "user-2",
      name: "Carlos Silva",
      rating: 4.9,
      totalRatings: 128,
      gender: "Masculino",
      phone: "(82) 99888-7777",
    },

    price: 12.0,

    otherPassengers: [],

    sameGenderOnly: false,

    route: {
      name: "Via Av. Gustavo Paiva",
      distance: "18.3 km",
      duration: "35 min",
      waypoints: ["Farol", "Mangabeiras", "Av. Gustavo Paiva", "UFAL"],
    },

    status: "completed",
  },
];

/* =====================================
   HISTORY AS DRIVER
   Usuária logada ofereceu caronas
===================================== */

export const mockHistoryAsDriver: HistoryRideAsDriver[] = [
  {
    id: "history-driver-1",
    date: "2026-04-09",
    departureTimeStart: "07:00",
    departureTimeEnd: "07:30",
    origin: "Jatiúca, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    route: {
      name: "Via Av. Fernandes Lima",
      distance: "8.3 km",
      duration: "30 min",
      waypoints: [
        "Jatiúca",
        "Av. Fernandes Lima",
        "Farol",
        "UFAL",
      ],
    },

    price: 9.0,
    totalSeats: 3,

    passengers: [
      {
        id: "user-3",
        name: "Maria Oliveira",
        rating: 4.7,
        gender: "Feminino",
      },
      {
        id: "user-8",
        name: "Rafael Mendonça",
        rating: 4.6,
        gender: "Masculino",
      },
      {
        id: "user-4",
        name: "João Santos",
        rating: 4.6,
        gender: "Masculino",
      },
    ],

    sameGenderOnly: false,
    status: "completed",
  },

  {
    id: "history-driver-2",
    date: "2026-04-07",
    departureTimeStart: "06:30",
    departureTimeEnd: "07:00",
    origin: "Pajuçara, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    route: {
      name: "Via BR-104",
      distance: "11.7 km",
      duration: "30 min",
      waypoints: [
        "Pajuçara",
        "Av. Álvaro Otacílio",
        "BR-104",
        "Tabuleiro",
        "UFAL",
      ],
    },

    price: 7.5,
    totalSeats: 4,

    passengers: [
      {
        id: "user-10",
        name: "Camila Rodrigues",
        rating: 4.7,
        gender: "Feminino",
      },
      {
        id: "user-6",
        name: "Pedro Almeida",
        rating: 4.5,
        gender: "Masculino",
      },
    ],

    sameGenderOnly: false,
    status: "completed",
  },

  {
    id: "history-driver-3",
    date: "2026-04-03",
    departureTimeStart: "07:15",
    departureTimeEnd: "07:45",
    origin: "Gruta de Lourdes, Maceió",
    destination: "UFAL - Campus A.C. Simões",

    route: {
      name: "Via Av. Menino Marcelo",
      distance: "6.1 km",
      duration: "30 min",
      waypoints: [
        "Gruta de Lourdes",
        "Av. Menino Marcelo",
        "Serraria",
        "UFAL",
      ],
    },

    price: 8.0,
    totalSeats: 2,

    passengers: [
      {
        id: "user-5",
        name: "Beatriz Costa",
        rating: 4.9,
        gender: "Feminino",
      },
    ],

    sameGenderOnly: false,
    status: "completed",
  },
];