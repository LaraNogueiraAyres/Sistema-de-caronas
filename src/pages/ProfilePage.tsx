import { ArrowLeft, Star, User as UserIcon, MapPin, Menu, Phone, CreditCard, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { getCurrentUser } from "../utils/auth";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function Profile() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const user = getCurrentUser();

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-yellow-500 fill-yellow-500"
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-gray-300 fill-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>,
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300 fill-gray-300" />,
        );
      }
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full px-6 pt-12 pb-6 bg-primary text-primary-foreground">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-background/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-background/10 rounded-lg transition-colors hidden lg:block"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Meu Perfil</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] px-6 pt-8 pb-24 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-20 px-6 pb-6 text-center">
            {/* Name */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {user.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(user.rating)}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {user.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({user.totalRatings}{" "}
                {user.totalRatings === 1 ? "avaliação" : "avaliações"})
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Gender */}
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                      Gênero
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {user.gender}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                      Idade
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {calculateAge(user.birthDate)} anos
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                        Telefone
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PIX */}
              {user.pix && (
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                        Chave PIX
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {user.pix}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Member Since */}
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E63946] rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                      Membro desde
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {new Date(user.birthDate).toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {user.bio && (
              <div className="mt-6 text-left">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Sobre mim
                </h3>
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {user.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Verification Badges */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 text-left">
                Verificações
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    E-mail verificado
                  </span>
                </div>
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">
                    Perfil completo
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {user.totalRatings}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Avaliações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor(Math.random() * 50) + 10}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Caronas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor(Math.random() * 12) + 1}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Meses ativo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
