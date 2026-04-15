import { Menu, MapPin, Users, Car } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockCurrentUser } from "../mocks/user";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function HomePage() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();

  return (
    <div className="flex-1 flex flex-col min-h-screen lg:overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-12 pb-4 bg-primary text-white relative z-10 flex-shrink-0 lg:px-8 lg:pt-8 lg:pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-right lg:ml-auto">
            <p className="text-sm opacity-90 mb-1">Olá,</p>
            <h1 className="text-xl font-semibold">
              {mockCurrentUser.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1">
        {/* Map placeholder with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                Sua localização
              </p>
            </div>
          </div>
        </div>

        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/30"></div>

        {/* User location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg"></div>
            <div className="absolute inset-0 w-4 h-4 bg-accent rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:flex lg:absolute lg:inset-0 lg:items-center lg:justify-center lg:gap-6 lg:px-8 lg:z-20">
          {/* Left: Location Cards */}
          <div className="space-y-4 w-full max-w-md">
            {/* Origin Card */}
            <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">
                  Origem
                </p>
                <p className="text-sm font-medium text-primary truncate">
                  Rua das Flores, 123 - Centro, São Paulo
                </p>
              </div>
            </div>

            {/* Destination Card */}
            <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 opacity-58">
              <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">
                  Destino
                </p>
                <p className="text-sm font-medium text-primary truncate">
                  UFAL - Universidade Federal de Alagoas
                </p>
              </div>
            </div>
          </div>

          {/* Right: Action Cards */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-primary text-xl font-semibold mb-5">
                O que você deseja fazer?
              </h2>

              <div className="space-y-4">
                {/* Pegar Carona */}
                <button
                  onClick={() => navigate("/find-ride")}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 flex items-center gap-4 active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-primary font-semibold text-lg mb-1">
                      Pegar carona
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Encontre uma carona disponível
                    </p>
                  </div>
                </button>

                {/* Oferecer Carona */}
                <button
                  onClick={() => navigate("/offer-ride")}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all duration-200 flex items-center gap-4 active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center">
                    <Car className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-primary font-semibold text-lg mb-1">
                      Oferecer carona
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Compartilhe sua viagem
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Original floating cards */}
        {/* Origin Card - Floating */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-20 lg:hidden">
          <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">
                Origem
              </p>
              <p className="text-sm font-medium text-primary truncate">
                Rua das Flores, 123 - Centro, São Paulo
              </p>
            </div>
          </div>
        </div>

        {/* Destination Card - Fixed UFAL */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-20 lg:hidden">
          <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 opacity-58">
            <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">
                Destino
              </p>
              <p className="text-sm font-medium text-primary truncate">
                UFAL - Universidade Federal de Alagoas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area - Mobile Only */}
      <div className="px-6 py-6 bg-white rounded-t-3xl -mt-8 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <h2 className="text-primary text-xl font-semibold mb-5">
          O que você deseja fazer?
        </h2>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Pegar Carona */}
          <button
            onClick={() => navigate("/find-ride")}
            className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 flex items-center gap-4 active:scale-[0.98]"
          >
            <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-primary font-semibold text-lg mb-1">
                Pegar carona
              </h3>
              <p className="text-gray-600 text-sm">
                Encontre uma carona disponível
              </p>
            </div>
          </button>

          {/* Oferecer Carona */}
          <button
            onClick={() => navigate("/offer-ride")}
            className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all duration-200 flex items-center gap-4 active:scale-[0.98]"
          >
            <div className="w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center">
              <Car className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-primary font-semibold text-lg mb-1">
                Oferecer carona
              </h3>
              <p className="text-gray-600 text-sm">
                Compartilhe sua viagem
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}