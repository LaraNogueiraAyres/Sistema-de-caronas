import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  SlidersHorizontal,
  User,
  X,
  CheckCircle2,
  Car,
  Menu,
  ArrowUpDown,
  Bookmark,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockRides } from "../mocks/rides";
import { getCurrentUser } from "../utils/auth";
import type { Ride } from "../types/ride";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function FindRide() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [origin, setOrigin] = useState("");
  const [isReversed, setIsReversed] = useState(false);
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minPassengers, setMinPassengers] = useState("");
  const [sameGenderOnly, setSameGenderOnly] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  const savedAddresses = currentUser?.savedAddresses || [];
  const ufalLocation = "UFAL - Campus A.C. Simões";
  const originValue = isReversed ? ufalLocation : origin;
  const destinationValue = isReversed ? origin : ufalLocation;

  const handleSwapLocations = () => {
    setIsReversed(!isReversed);
  };

  const handleSelectSavedAddress = (address: string) => {
    setOrigin(address);
    setShowSavedAddresses(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };
  useEffect(() => {
    if (showModal || showSuccessMessage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showSuccessMessage]);
  // Filtrar caronas com base nos filtros aplicados
  const filteredRides = mockRides.filter((ride) => {
  // // origem
  // if (
  //   origin &&
  //   !ride.origin.toLowerCase().includes(origin.toLowerCase())
  // ) {
  //   return false;
  // }

  // preço
  if (maxPrice && ride.price > parseFloat(maxPrice)) {
    return false;
  }

  // avaliação
  if (
    minRating &&
    ride.driver.rating < parseFloat(minRating)
  ) {
    return false;
  }

  // passageiros mínimos
  if (
    minPassengers &&
    ride.confirmedPassengers < parseInt(minPassengers)
  ) {
    return false;
  }

  // gênero
  if (
    sameGenderOnly &&
    ride.driver.gender !== currentUser?.gender
  ) {
    return false;
  }

  // horário inicial
  if (timeStart) {
    const rideMinutes =
      parseInt(ride.departureTimeStart.split(":")[0]) * 60 +
      parseInt(ride.departureTimeStart.split(":")[1]);

    const filterMinutes =
      parseInt(timeStart.split(":")[0]) * 60 +
      parseInt(timeStart.split(":")[1]);

    if (rideMinutes < filterMinutes) {
      return false;
    }
  }

  // horário final
  if (timeEnd) {
    const rideMinutes =
      parseInt(ride.departureTimeStart.split(":")[0]) * 60 +
      parseInt(ride.departureTimeStart.split(":")[1]);

    const filterMinutes =
      parseInt(timeEnd.split(":")[0]) * 60 +
      parseInt(timeEnd.split(":")[1]);

    if (rideMinutes > filterMinutes) {
      return false;
    }
  }

  return true;
});

const sortedRides = [...filteredRides].sort((a, b) => {
  const [ah, am] = a.departureTimeStart.split(":").map(Number);
  const [bh, bm] = b.departureTimeStart.split(":").map(Number);

  const minutesA = ah * 60 + am;
  const minutesB = bh * 60 + bm;

  return minutesA - minutesB;
});

  const handleRequestRide = (rideId: string) => {
    const ride = mockRides.find((r) => r.id === rideId);
    if (ride) {
      setSelectedRide(ride);
      setShowModal(true);
    }
  };

  const handleConfirmRequest = () => {
    if (selectedRide) {
      console.log("Solicitar carona:", selectedRide.id);
      // Implementar lógica de solicitação
      setShowModal(false);
      setShowSuccessMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col lg:h-screen lg:overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 pt-12 pb-6 bg-primary text-primary-foreground flex-shrink-0 lg:px-8 lg:pt-8 lg:pb-5">
        <div className="flex items-center gap-4">
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
          <h1 className="text-xl font-semibold">
            Buscar carona
          </h1>
        </div>
      </div>

      {/* Desktop Layout: Search Form + Results Side by Side */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Search Form */}
        <div className="px-6 py-6 bg-background shadow-sm lg:w-96 lg:border-r lg:border-gray-200 lg:overflow-y-auto lg:flex-shrink-0">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Origin and Destination with Swap Button */}
            <div className="space-y-4">
              {/* Origin Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-600 font-medium">
                    De onde você sai?
                  </label>
                  {!isReversed && savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                      className="text-xs text-foreground font-medium flex items-center gap-1 hover:underline"
                    >
                      <Bookmark className="w-3 h-3" />
                      Salvos
                    </button>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      value={isReversed ? ufalLocation : origin}
                      onChange={(e) => !isReversed && setOrigin(e.target.value)}
                      placeholder="De onde você sai?"
                      disabled={isReversed}
                      className={`w-full pl-11 pr-4 py-4 rounded-xl border-2 transition-all outline-none ${
                        isReversed
                          ? "bg-gray-100 border-gray-200 text-gray-600 opacity-60 cursor-not-allowed"
                          : "bg-[#F5F5F5] border-transparent focus:border-primary focus:bg-background"
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="p-3 bg-background border-2 border-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all group shadow-sm flex-shrink-0"
                    title="Inverter origem e destino"
                  >
                    <ArrowUpDown className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
                  </button>
                </div>

                {/* Saved Addresses Dropdown */}
                {!isReversed && showSavedAddresses && savedAddresses.length > 0 && (
                  <div className="mt-2 p-2 bg-background border-2 border-primary rounded-xl shadow-lg">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr.address)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {addr.label}
                        </p>
                        <p className="text-xs text-gray-600">{addr.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <input
                  type="text"
                  value={isReversed ? origin : ufalLocation}
                  onChange={(e) => isReversed && setOrigin(e.target.value)}
                  placeholder="Para onde você vai?"
                  disabled={!isReversed}
                  className={`w-full pl-11 pr-4 py-4 rounded-xl border-2 transition-all outline-none ${
                    !isReversed
                      ? "bg-gray-100 border-gray-200 text-gray-600 opacity-60 cursor-not-allowed"
                      : "bg-[#F5F5F5] border-transparent focus:border-primary focus:bg-background"
                  }`}
                />
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
              />
            </div>

            {/* Time Range */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Faixa de horário que posso sair
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    placeholder="Das"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    placeholder="Até"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filters and Search Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-4 bg-background border-2 border-gray-300 rounded-xl hover:border-primary transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5 text-foreground" />
                <span className="text-foreground font-medium">
                  Filtros
                </span>
              </button>

              <button
                type="submit"
                disabled={!origin}
                className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  origin
                    ? "bg-accent text-accent-foreground hover:bg-accent-hover active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Buscar caronas
              </button>
            </div>
          </form>

          {/* Optional Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-[#F5F5F5] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Preço máximo
                </span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-24 px-3 py-2 rounded-lg bg-background border border-gray-300 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Avaliação mínima
                </span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg bg-background border border-gray-300 text-sm outline-none focus:border-primary"
                >
                  <option value="">Qualquer</option>
                  <option value="4">4+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.8">4.8+ ⭐</option>
                </select>
              </div>

              {/* Minimum Passengers Filter */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Passageiros mínimos
                </span>
                <input
                  type="number"
                  value={minPassengers}
                  onChange={(e) =>
                    setMinPassengers(e.target.value)
                  }
                  placeholder="0"
                  className="w-24 px-3 py-2 rounded-lg bg-background border border-gray-300 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Same Gender Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      Somente motoristas do meu gênero
                    </span>
                    <span className="text-xs text-gray-500">
                      Seu gênero: {currentUser?.gender}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSameGenderOnly(!sameGenderOnly)
                    }
                    className={`ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D3557] focus:ring-offset-2 ${
                      sameGenderOnly
                        ? "bg-primary"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ${
                        sameGenderOnly
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {showResults && (
          <div className="flex-1 px-6 py-6 lg:px-0 lg:py-0 lg:overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-foreground font-semibold text-lg">
                {filteredRides.length} caronas disponíveis
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {originValue || "Sua origem"} → {destinationValue}
              </p>
            </div>

            {/* Ride Cards */}
            <div className="space-y-4">
              {sortedRides.length === 0 ? (
                <div className="bg-background rounded-2xl p-8 text-center">
                  <p className="text-foreground">
                    Nenhuma carona encontrada com os filtros
                    selecionados.
                  </p>
                  <button
                    onClick={() => {
                      setMaxPrice("");
                      setMinRating("");
                      setMinPassengers("");
                      setSameGenderOnly(false);
                    }}
                    className="mt-4 px-6 py-2 text-foreground font-semibold hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                sortedRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="bg-background rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Driver Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-foreground font-semibold">
                            {ride.driver.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {ride.driver.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({ride.driver.totalRatings})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-accent font-bold text-lg">
                          R$ {ride.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          por pessoa
                        </p>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">
                          {ride.origin}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          {ride.destination}
                        </p>
                      </div>
                    </div>

                    {/* Confirmed Passengers Badge */}
                    {ride.confirmedPassengers > 0 && (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-full">
                          <User className="w-3.5 h-3.5 text-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            {ride.confirmedPassengers}{" "}
                            {ride.confirmedPassengers === 1
                              ? "passageiro confirmado"
                              : "passageiros confirmados"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Time and Seats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {ride.departureTimeStart} -{" "}
                            {ride.departureTimeEnd}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {ride.availableSeats}{" "}
                            {ride.availableSeats === 1
                              ? "vaga"
                              : "vagas"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRequestRide(ride.id)}
                        className="px-5 py-2 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:bg-accent-hover transition-colors active:scale-95"
                      >
                        Solicitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showResults && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                Pronto para encontrar sua carona?
              </h3>
              <p className="text-gray-600 text-sm px-[0px] pt-[0px] pb-[80px]">
                Preencha os campos acima e comece a buscar
              </p>
            </div>
          </div>
        )}

        {/* Modal de solicitacao */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-background rounded-2xl p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-semibold text-lg">
                  Solicitar carona
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">
                      {selectedRide?.driver.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedRide?.driver.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({selectedRide?.driver.totalRatings})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    {selectedRide?.origin}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {selectedRide?.destination}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedRide?.departureTimeStart} -{" "}
                    {selectedRide?.departureTimeEnd}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedRide?.availableSeats}{" "}
                    {selectedRide?.availableSeats === 1
                      ? "vaga"
                      : "vagas"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    R$ {selectedRide?.price.toFixed(2)} por pessoa
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-muted text-muted-foreground font-medium text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmRequest}
                  className="px-5 py-2.5 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:bg-accent-hover transition-colors active:scale-95"
                >
                  Confirmar solicitação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-background rounded-2xl p-6 max-w-md w-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success-foreground" />
                </div>

                <h2 className="text-foreground font-semibold text-xl mb-2">
                  Solicitação enviada!
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                  Sua solicitação foi enviada para{" "}
                  {selectedRide?.driver.name}. Te avisaremos assim
                  que ele responder!
                </p>

                <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-foreground font-semibold text-sm">
                        {selectedRide?.driver.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">
                          {selectedRide?.driver.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        {selectedRide?.departureTimeStart} -{" "}
                        {selectedRide?.departureTimeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        R$ {selectedRide?.price.toFixed(2)} por
                        pessoa
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="w-full py-3 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}