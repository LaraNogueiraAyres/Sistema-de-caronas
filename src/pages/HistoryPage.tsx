import { useState } from "react";
import {
  Menu,
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
  Users,
  Star,
  Calendar,
  Car,
  Navigation,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockHistoryAsPassenger, mockHistoryAsDriver } from "../mocks/history";
import type {
  HistoryRideAsPassenger,
  HistoryRideAsDriver,
} from "../types/history";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

type TabType = "offered" | "received";

export function History() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [activeTab, setActiveTab] = useState<TabType>("offered");
  const [selectedPassengerRide, setSelectedPassengerRide] =
    useState<HistoryRideAsPassenger | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePassengerRideClick = (ride: HistoryRideAsPassenger) => {
    setSelectedPassengerRide(ride);
    setShowRouteModal(true);
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col overflow-hidden">
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
          <h1 className="text-xl font-semibold">Histórico</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 lg:max-w-7xl lg:mx-auto lg:w-full">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-background rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("offered")}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === "offered"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Caronas oferecidas
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === "received"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Caronas solicitadas
            </button>
          </div>

          {/* Tab Content - Offered Rides (As Driver) */}
          {activeTab === "offered" && (
            <div className="space-y-4">
              {mockHistoryAsDriver.length === 0 ? (
                <div className="bg-background rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Nenhuma carona encontrada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Você ainda não ofereceu nenhuma carona
                  </p>
                </div>
              ) : (
                [...mockHistoryAsDriver]
                  .sort((a, b) => {
                    const dateA = new Date(
                      `${a.date}T${a.departureTimeStart}`,
                    ).getTime();
                    const dateB = new Date(
                      `${b.date}T${b.departureTimeStart}`,
                    ).getTime();

                    return dateB - dateA;
                  })
                  .map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-background rounded-2xl p-5 shadow-sm border border-gray-100"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-foreground font-semibold text-lg">
                              {formatDate(ride.date)}
                            </h3>
                            {ride.sameGenderOnly && (
                              <span className="px-2 py-0.5  bg-info text-info-foreground text-xs font-medium rounded-full">
                                Mesmo gênero
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-success text-success-foreground text-xs font-medium rounded-full">
                              Concluída
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {ride.routeName}
                          </p>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{ride.origin}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {ride.destination}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary-foreground" />
                          <span className="text-sm text-gray-700">
                            {ride.departureTimeStart} - {ride.departureTimeEnd}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-secondary-foreground" />
                          <span className="text-sm text-gray-700">
                            R$ {ride.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-secondary-foreground" />
                          <span className="text-sm text-gray-700">
                            {ride.passengers.length}/{ride.totalSeats} ocupado
                          </span>
                        </div>
                      </div>

                      {/* Passengers */}
                      {ride.passengers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Passageiros ({ride.passengers.length})
                          </h4>
                          <div className="space-y-2">
                            {ride.passengers.map((passenger) => (
                              <div
                                key={passenger.id}
                                className="flex items-center gap-3 p-2 bg-secondary rounded-lg"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {passenger.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-warning-foreground fill-yellow-500" />
                                    <span className="text-xs text-gray-600">
                                      {passenger.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Tab Content - Received Rides (As Passenger) */}
          {activeTab === "received" && (
            <div className="space-y-4">
              {mockHistoryAsPassenger.length === 0 ? (
                <div className="bg-background rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Nenhuma carona encontrada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Você ainda não pegou nenhuma carona
                  </p>
                </div>
              ) : (
                mockHistoryAsPassenger.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => handlePassengerRideClick(ride)}
                    className="w-full bg-background rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-foreground font-semibold text-lg">
                            {formatDate(ride.date)}
                          </h3>
                          {ride.sameGenderOnly && (
                            <span className="px-2 py-0.5  bg-info text-info-foreground text-xs font-medium rounded-full">
                              Mesmo gênero
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-success text-success-foreground text-xs font-medium rounded-full">
                            Concluída
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {ride.departureTimeStart} - {ride.departureTimeEnd}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent font-bold text-lg">
                          R$ {ride.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{ride.origin}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          {ride.destination}
                        </p>
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Motorista: {ride.driver.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning-foreground fill-yellow-500" />
                          <span className="text-xs text-gray-600">
                            {ride.driver.rating} ({ride.driver.totalRatings})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Other Passengers */}
                    {ride.otherPassengers.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-secondary-foreground mb-2">
                          Outros passageiros ({ride.otherPassengers.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ride.otherPassengers.map((passenger) => (
                            <span
                              key={passenger.id}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                            >
                              {passenger.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Click hint */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-foreground font-medium flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Clique para ver a rota utilizada
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Route Modal */}
      {showRouteModal && selectedPassengerRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-foreground font-semibold text-lg">
                  Detalhes da Rota
                </h2>
                <button
                  onClick={() => setShowRouteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-secondary-foreground" />
                </button>
              </div>

              {/* Ride Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(selectedPassengerRide.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm text-gray-700">
                    {selectedPassengerRide.departureTimeStart} -{" "}
                    {selectedPassengerRide.departureTimeEnd}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm text-gray-700">
                    R$ {selectedPassengerRide.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Route Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-foreground" />
                  <h3 className="text-foreground font-semibold">
                    {selectedPassengerRide.route.name}
                  </h3>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-secondary-foreground" />
                    <span className="text-sm text-gray-700">
                      {selectedPassengerRide.route.distance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary-foreground" />
                    <span className="text-sm text-gray-700">
                      {selectedPassengerRide.route.duration}
                    </span>
                  </div>
                </div>

                {/* Waypoints */}
                <div>
                  <p className="text-xs text-secondary-foreground mb-3 font-medium">
                    Pontos de passagem:
                  </p>
                  <div className="space-y-2">
                    {selectedPassengerRide.route.waypoints.map(
                      (waypoint, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {index === 0 ? (
                            <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                          ) : index ===
                            selectedPassengerRide.route.waypoints.length - 1 ? (
                            <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 ml-0.5"></div>
                          )}
                          <span className="text-sm text-gray-700">
                            {waypoint}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="p-4 bg-primary/5 rounded-xl">
                <p className="text-xs text-secondary-foreground mb-2 font-medium">
                  Motorista
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedPassengerRide.driver.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning-foreground fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedPassengerRide.driver.rating}
                      </span>
                      <span className="text-xs text-secondary-foreground">
                        ({selectedPassengerRide.driver.totalRatings})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRouteModal(false)}
                className="w-full mt-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
