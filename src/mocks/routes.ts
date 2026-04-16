import type { RouteOption } from "../types/route";

export const mockRoutes: RouteOption[] = [
  {
    id: "route-1",
    name: "Via Av. Principal",
    distance: "12.3 km",
    duration: "18 min",
    traffic: "light",
    isFastest: true,
    isShortest: false,
    description: "Rota mais rápida com trânsito leve",
    waypoints: [
      "Rua das Flores, 123 - Centro",
      "Av. Principal, 456",
      "Rua Fernandes Lima",
      "UFAL - Campus A.C. Simões"
    ]
  },
  {
    id: "route-2",
    name: "Via Centro",
    distance: "10.8 km",
    duration: "22 min",
    traffic: "moderate",
    isFastest: false,
    isShortest: true,
    description: "Rota mais curta pelo centro da cidade",
    waypoints: [
      "Rua das Flores, 123 - Centro",
      "Av. da Paz",
      "Centro - Praça da República",
      "UFAL - Campus A.C. Simões"
    ]
  },
  {
    id: "route-3",
    name: "Via Litoral",
    distance: "14.5 km",
    duration: "25 min",
    traffic: "light",
    isFastest: false,
    isShortest: false,
    description: "Rota panorâmica com vista para o mar",
    waypoints: [
      "Rua das Flores, 123 - Centro",
      "Av. Álvaro Otacílio",
      "Orla de Pajuçara",
      "Av. Comendador Leão",
      "UFAL - Campus A.C. Simões"
    ]
  }
];
