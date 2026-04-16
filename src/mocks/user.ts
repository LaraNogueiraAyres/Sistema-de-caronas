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

// Mock de outros usuários (para perfis públicos)
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user-2",
    name: "Carlos Silva",
    email: "carlos.silva@email.com",
    gender: "Masculino",
    birthDate: "1995-07-22",
    rating: 4.9,
    totalRatings: 128,
    bio: "Professor de matemática na UFAL. Ofereço caronas regularmente no trajeto Rio Largo - UFAL. Responsável e sempre no horário!",
  },
  {
    id: "user-3",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    gender: "Feminino",
    birthDate: "1999-11-08",
    rating: 4.7,
    totalRatings: 93,
    bio: "Estudante de Medicina. Costumo pegar caronas pela manhã e oferecer no fim da tarde. Amo música e conversas interessantes!",
  },
  {
    id: "user-4",
    name: "João Santos",
    email: "joao.santos@email.com",
    gender: "Masculino",
    birthDate: "1997-04-12",
    rating: 4.6,
    totalRatings: 76,
    bio: "Engenheiro de software e estudante de pós-graduação. Gosto de fazer networking durante as viagens. Sempre com boas playlists!",
  },
  {
    id: "user-5",
    name: "Beatriz Costa",
    email: "beatriz.costa@email.com",
    gender: "Feminino",
    birthDate: "2000-01-30",
    rating: 4.9,
    totalRatings: 154,
    bio: "Veterinária e apaixonada por animais. Dirijo há 5 anos e tenho experiência em caronas compartilhadas. Super cuidadosa e atenciosa!",
  },
  {
    id: "user-6",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    gender: "Masculino",
    birthDate: "1996-09-18",
    rating: 4.5,
    totalRatings: 62,
    bio: "Estudante de Direito. Prefiro viagens tranquilas e gosto de respeitar o espaço de cada um. Sempre disponível para ajudar!",
  },
];