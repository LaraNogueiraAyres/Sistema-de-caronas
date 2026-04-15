import type { User } from "../types/user";

// Mock do usuário logado
export const mockCurrentUser: User = {
  id: "user-1",
  name: "Ana Paula",
  email: "anapaularenault@email.com",
  gender: "Feminino",
  birthDate: "1998-03-15",
  rating: 4.8,
  totalRatings: 47,
  bio: "Estudante de Engenharia na UFAL. Gosto de compartilhar caronas e conhecer novas pessoas. Sempre pontual e adoro uma boa conversa durante o trajeto! 🚗",
};