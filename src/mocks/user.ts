import type { User } from "../types/user";

// Mock do usuário logado
export const mockCurrentUser: User = {
  id: "user-1",
  name: "Ana Paula",
  email: "anapaularenault@email.com",
  phone: "(82) 99999-8888",
  pix: "anapaularenault@email.com",
  gender: "Feminino",
  birthDate: "1998-03-15",
  rating: 4.8,
  totalRatings: 47,
  bio: "Estudante de Engenharia na UFAL. Gosto de compartilhar caronas e conhecer novas pessoas. Sempre pontual e adoro uma boa conversa durante o trajeto! 🚗",
  privateMode: false,
  savedAddresses: [
    {
      id: "addr-1",
      label: "Casa",
      address: "Rua das Flores, 123 - Ponta Verde, Maceió - AL",
    },
    {
      id: "addr-2",
      label: "Trabalho",
      address: "UFAL - Campus A.C. Simões, Maceió - AL",
    },
  ],
};

// Mock de outros usuários (para perfis públicos)
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user-2",
    name: "Carlos Silva",
    email: "carlos.silva@email.com",
    phone: "(82) 99888-7777",
    pix: "carlos.silva@email.com",
    gender: "Masculino",
    birthDate: "1995-07-22",
    rating: 4.9,
    totalRatings: 128,
    bio: "Professor de matemática na UFAL. Ofereço caronas regularmente no trajeto Rio Largo - UFAL. Responsável e sempre no horário!",
    privateMode: false,
  },
  {
    id: "user-3",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(82) 99777-6666",
    gender: "Feminino",
    birthDate: "1999-11-08",
    rating: 4.7,
    totalRatings: 93,
    bio: "Estudante de Medicina. Costumo pegar caronas pela manhã e oferecer no fim da tarde. Amo música e conversas interessantes!",
    privateMode: true, // Modo privado ativado
  },
  {
    id: "user-4",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(82) 99666-5555",
    pix: "(82) 99666-5555",
    gender: "Masculino",
    birthDate: "1997-04-12",
    rating: 4.6,
    totalRatings: 76,
    bio: "Engenheiro de software e estudante de pós-graduação. Gosto de fazer networking durante as viagens. Sempre com boas playlists!",
    privateMode: false,
  },
  {
    id: "user-5",
    name: "Beatriz Costa",
    email: "beatriz.costa@email.com",
    phone: "(82) 99555-4444",
    pix: "beatriz.costa@email.com",
    gender: "Feminino",
    birthDate: "2000-01-30",
    rating: 4.9,
    totalRatings: 154,
    bio: "Veterinária e apaixonada por animais. Dirijo há 5 anos e tenho experiência em caronas compartilhadas. Super cuidadosa e atenciosa!",
    privateMode: false,
  },
  {
    id: "user-6",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    phone: "(82) 99444-3333",
    gender: "Masculino",
    birthDate: "1996-09-18",
    rating: 4.5,
    totalRatings: 62,
    bio: "Estudante de Direito. Prefiro viagens tranquilas e gosto de respeitar o espaço de cada um. Sempre disponível para ajudar!",
    privateMode: true, // Modo privado ativado
  },
];