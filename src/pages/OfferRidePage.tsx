import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Navigation,
  TrendingUp,
  Zap,
  AlertCircle,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockCurrentUser } from "../mocks/user";
import { mockRoutes } from "../mocks/routes";
import type { RouteOption } from "../types/route";
import { RouteMap } from "./route-map";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function OfferRide() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [origin, setOrigin] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [sameGenderOnly, setSameGenderOnly] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<
    string | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRoutes(true);
  };

  const handleConfirmRoute = () => {
    if (!selectedRoute) return;
    console.log("Publicar carona:", {
      origin,
      destination: "UFAL - Campus A.C. Simões",
      date,
      timeStart,
      timeEnd,
      price,
      seats,
      sameGenderOnly,
      selectedRoute,
    });
    // Aqui implementaria a lógica de publicação
    navigate("/home");
  };

  const getTrafficColor = (traffic: RouteOption["traffic"]) => {
    switch (traffic) {
      case "light":
        return "text-green-600 bg-green-50";
      case "moderate":
        return "text-yellow-600 bg-yellow-50";
      case "heavy":
        return "text-red-600 bg-red-50";
    }
  };

  const getTrafficLabel = (traffic: RouteOption["traffic"]) => {
    switch (traffic) {
      case "light":
        return "Trânsito leve";
      case "moderate":
        return "Trânsito moderado";
      case "heavy":
        return "Trânsito intenso";
    }
  };

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-12 pb-6 bg-[#1D3557] text-white flex-shrink-0 lg:px-8 lg:pt-8 lg:pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              if (showRoutes) {
                setShowRoutes(false);
              } else {
                navigate(-1);
              }
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden lg:block"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">
            {showRoutes ? 'Escolha a melhor rota' : 'Oferecer carona'}
          </h1>
        </div>
      </div>

      {!showRoutes ? (
        /* Form Section */
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:flex lg:items-center lg:justify-center lg:bg-white">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:w-full lg:max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin Input */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  De onde você sai?
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-[#1D3557] rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Digite a origem"
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Destination Input - Fixed to UFAL */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Para onde você vai?
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <MapPin className="w-4 h-4 text-[#E63946]" />
                  </div>
                  <input
                    type="text"
                    value="UFAL - Campus A.C. Simões"
                    disabled
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Data da viagem
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block font-medium">
                  Faixa de horário de partida
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="time"
                      value={timeStart}
                      onChange={(e) =>
                        setTimeStart(e.target.value)
                      }
                      placeholder="Das"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none text-sm"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="time"
                      value={timeEnd}
                      onChange={(e) =>
                        setTimeEnd(e.target.value)
                      }
                      placeholder="Até"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price and Seats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block font-medium">
                    Preço por pessoa
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block font-medium">
                    Vagas disponíveis
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <select
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none appearance-none text-sm"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="1">1 vaga</option>
                      <option value="2">2 vagas</option>
                      <option value="3">3 vagas</option>
                      <option value="4">4 vagas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Same Gender Filter */}
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      Aceitar apenas passageiros do meu gênero
                    </span>
                    <span className="text-xs text-gray-500">
                      Seu gênero: {mockCurrentUser.gender}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSameGenderOnly(!sameGenderOnly)
                    }
                    className={`ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 ${
                      sameGenderOnly
                        ? "bg-[#1D3557]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        sameGenderOnly
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#E63946] font-semibold text-white hover:bg-[#d63340] active:scale-[0.98] transition-all duration-200 mt-6"
              >
                Ver rotas disponíveis
              </button>
            </form>
          </div>

          {/* Info Card */}
          {/* <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                Dica importante
              </p>
              <p className="text-xs text-blue-700">
                Escolha uma rota que seja conveniente para você e seus
                passageiros. Você poderá confirmar a publicação após selecionar
                a melhor opção.
              </p>
            </div>
          </div> */}
        </div>
      ) : (
        /* Routes Section */
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:overflow-hidden">
          {/* Desktop Two-Column Layout */}
          <div className="lg:flex lg:gap-6 lg:h-full">
            {/* Left Column: Summary + Map */}
            <div className="lg:w-2/5 lg:space-y-6 lg:overflow-y-auto lg:pr-4">
              {/* Trip Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 lg:mb-0">
                <h2 className="text-[#1D3557] font-semibold text-lg mb-4">
                  Resumo da viagem
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-[#1D3557] rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        Origem
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {origin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-3 h-3 text-[#E63946] mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        Destino
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        UFAL - Campus A.C. Simões
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Horário
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {timeStart} - {timeEnd}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Preço
                      </p>
                      <p className="text-sm font-medium text-[#E63946]">
                        R$ {parseFloat(price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Route Map */}
              <div className="mb-6">
                <RouteMap
                  routes={mockRoutes}
                  selectedRoute={selectedRoute}
                  onSelectRoute={setSelectedRoute}
                />
              </div>
            </div>

            {/* Right Column: Routes List */}
            <div className="lg:w-3/5 lg:space-y-6 lg:overflow-y-auto">
              {/* Routes Header */}
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-[#1D3557]" />
                <h2 className="text-[#1D3557] font-semibold text-lg">
                  Rotas sugeridas
                </h2>
              </div>

              {/* Routes List */}
              <div className="space-y-4 mb-6">
                {mockRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={`w-full bg-white rounded-2xl p-5 shadow-sm border-2 transition-all text-left ${
                      selectedRoute === route.id
                        ? "border-[#1D3557] shadow-md"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {/* Route Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#1D3557] font-semibold">
                            {route.name}
                          </h3>
                          {route.isFastest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              <Zap className="w-3 h-3" />
                              Mais rápida
                            </span>
                          )}
                          {route.isShortest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              <TrendingUp className="w-3 h-3" />
                              Mais curta
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {route.description}
                        </p>
                      </div>
                      {selectedRoute === route.id && (
                        <CheckCircle2 className="w-6 h-6 text-[#1D3557] flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {/* Route Stats */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {route.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {route.distance}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTrafficColor(
                          route.traffic,
                        )}`}
                      >
                        {getTrafficLabel(route.traffic)}
                      </div>
                    </div>

                    {/* Waypoints */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Pontos de passagem:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {route.waypoints.map((waypoint, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg"
                          >
                            {index + 1}. {waypoint}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmRoute}
                disabled={!selectedRoute}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  selectedRoute
                    ? "bg-[#E63946] hover:bg-[#d63340] active:scale-[0.98]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Publicar carona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}