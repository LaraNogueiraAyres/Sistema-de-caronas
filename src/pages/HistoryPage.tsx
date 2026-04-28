import { useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronUp,
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
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockHistoryAsPassenger, mockHistoryAsDriver } from "../mocks/history";
import type {
  HistoryRideAsPassenger,
  HistoryRideAsDriver,
} from "../types/history";

// — Types —

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

type TabType = "offered" | "received";

// — Component —

export function History() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();

  // Tab
  const [activeTab, setActiveTab] = useState<TabType>("offered");

  // Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDriverRide, setSelectedDriverRide] =
    useState<HistoryRideAsDriver | null>(null);
  const [selectedPassengerRide, setSelectedPassengerRide] =
    useState<HistoryRideAsPassenger | null>(null);

  // Passengers accordion
  const [showPassengers, setShowPassengers] = useState(false);

  // — Helpers —

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const sortedDriverRides = [...mockHistoryAsDriver].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.departureTimeStart}`).getTime();
    const dateB = new Date(`${b.date}T${b.departureTimeStart}`).getTime();
    return dateB - dateA;
  });

  // — Handlers —

  const handleDriverRideClick = (ride: HistoryRideAsDriver) => {
    setSelectedDriverRide(ride);
    setShowPassengers(false);
    setShowDetailsModal(true);
  };

  const handlePassengerRideClick = (ride: HistoryRideAsPassenger) => {
    setSelectedPassengerRide(ride);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedDriverRide(null);
    setSelectedPassengerRide(null);
  };

  // — Render —

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

          {/* Tab: Caronas oferecidas (motorista) */}
          {activeTab === "offered" && (
            <div className="space-y-4">
              {sortedDriverRides.length === 0 ? (
                <EmptyState
                  icon={<Car className="w-8 h-8 text-gray-400" />}
                  message="Você ainda não ofereceu nenhuma carona"
                />
              ) : (
                sortedDriverRides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    date={formatDate(ride.date)}
                    origin={ride.origin}
                    destination={ride.destination}
                    timeStart={ride.departureTimeStart}
                    timeEnd={ride.departureTimeEnd}
                    sameGenderOnly={ride.sameGenderOnly}
                    onClick={() => handleDriverRideClick(ride)}
                  />
                ))
              )}
            </div>
          )}

          {/* Tab: Caronas solicitadas (passageiro) */}
          {activeTab === "received" && (
            <div className="space-y-4">
              {mockHistoryAsPassenger.length === 0 ? (
                <EmptyState
                  icon={<Users className="w-8 h-8 text-gray-400" />}
                  message="Você ainda não pegou nenhuma carona"
                />
              ) : (
                mockHistoryAsPassenger.map((ride) => (
                  <RideCard
                    key={ride.id}
                    date={formatDate(ride.date)}
                    origin={ride.origin}
                    destination={ride.destination}
                    timeStart={ride.departureTimeStart}
                    timeEnd={ride.departureTimeEnd}
                    sameGenderOnly={ride.sameGenderOnly}
                    onClick={() => handlePassengerRideClick(ride)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes */}
      {showDetailsModal && (selectedDriverRide || selectedPassengerRide) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">Detalhes da carona</h2>
              <button onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detalhes: motorista */}
            {activeTab === "offered" && selectedDriverRide && (
              <DriverRideDetails
                ride={selectedDriverRide}
                formatDate={formatDate}
                showPassengers={showPassengers}
                onTogglePassengers={() => setShowPassengers((p) => !p)}
                navigate={navigate}
              />
            )}

            {/* Detalhes: passageiro */}
            {activeTab === "received" && selectedPassengerRide && (
              <PassengerRideDetails
                ride={selectedPassengerRide}
                formatDate={formatDate}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// — Sub-components —

// Card de carona (usado em ambas as tabs)
function RideCard({
  date,
  origin,
  destination,
  timeStart,
  timeEnd,
  sameGenderOnly,
  onClick,
}: {
  date: string;
  origin: string;
  destination: string;
  timeStart: string;
  timeEnd: string;
  sameGenderOnly: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-background rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
    >
      {/* Card header */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <h3 className="text-foreground font-semibold text-lg">{date}</h3>
        {sameGenderOnly && (
          <span className="px-2 py-0.5 bg-info text-info-foreground text-xs font-medium rounded-full">
            Mesmo gênero
          </span>
        )}
        <span className="px-2 py-0.5 bg-success text-success-foreground text-xs font-medium rounded-full">
          Concluída
        </span>
      </div>

      {/* Rota */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0" />
          <p className="text-sm text-gray-700">{origin}</p>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
          <p className="text-sm text-gray-700">{destination}</p>
        </div>
      </div>

      {/* Horário */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <Clock className="w-4 h-4 text-secondary-foreground" />
        <span className="text-sm text-gray-700">
          {timeStart} - {timeEnd}
        </span>
      </div>
    </button>
  );
}

// Conteúdo do modal para motorista
function DriverRideDetails({
  ride,
  formatDate,
  showPassengers,
  onTogglePassengers,
  navigate,
}: {
  ride: HistoryRideAsDriver;
  formatDate: (d: string) => string;
  showPassengers: boolean;
  onTogglePassengers: () => void;
  navigate: (path: string) => void;
}) {
  return (
    <>
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{formatDate(ride.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {ride.departureTimeStart} - {ride.departureTimeEnd}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm">R$ {ride.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {ride.passengers.length}/{ride.totalSeats} ocupados
          </span>
        </div>
      </div>

      {/* Rota */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="w-5 h-5 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            {ride.route.name}
          </h3>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-secondary-foreground" />
            <span className="text-sm text-gray-700">{ride.route.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary-foreground" />
            <span className="text-sm text-gray-700">{ride.route.duration}</span>
          </div>
        </div>

        {/* Waypoints */}
        <p className="text-xs text-secondary-foreground mb-3 font-medium">
          Pontos de passagem:
        </p>
        <div className="space-y-2">
          {ride.route.waypoints.map((waypoint, index) => (
            <div key={index} className="flex items-center gap-3">
              {index === 0 ? (
                <div className="w-3 h-3 bg-primary rounded-full" />
              ) : index === ride.route.waypoints.length - 1 ? (
                <MapPin className="w-3 h-3 text-accent" />
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full ml-0.5" />
              )}
              <span className="text-sm text-gray-700">{waypoint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion de passageiros */}
      {ride.passengers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onTogglePassengers}
            className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">
              Passageiros ({ride.passengers.length})
            </span>
            {showPassengers ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showPassengers && (
            <div className="space-y-2 mt-3">
              {ride.passengers.map((passenger) => (
                <button
                  key={passenger.id}
                  onClick={() => navigate(`/user/${passenger.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {passenger.name}
                    </p>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-warning-foreground" />
                      <span className="text-xs text-gray-700 font-medium">
                        {passenger.rating}
                      </span>

                      <span className="text-xs text-gray-500">
                        • {passenger.gender}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
// Conteúdo do modal para passageiro
function PassengerRideDetails({
  ride,
  formatDate,
  navigate,
}: {
  ride: HistoryRideAsPassenger;
  formatDate: (d: string) => string;
  navigate: (path: string) => void;
}) {
  const [showPassengers, setShowPassengers] = useState(false);

  return (
    <>
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{formatDate(ride.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {ride.departureTimeStart} - {ride.departureTimeEnd}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm">R$ {ride.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Rota */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="w-5 h-5 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            {ride.route.name}
          </h3>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-secondary-foreground" />
            <span className="text-sm text-gray-700">{ride.route.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary-foreground" />
            <span className="text-sm text-gray-700">{ride.route.duration}</span>
          </div>
        </div>

        {/* Waypoints */}
        <p className="text-xs text-secondary-foreground mb-3 font-medium">
          Pontos de passagem:
        </p>
        <div className="space-y-2">
          {ride.route.waypoints.map((waypoint, index) => (
            <div key={index} className="flex items-center gap-3">
              {index === 0 ? (
                <div className="w-3 h-3 bg-primary rounded-full" />
              ) : index === ride.route.waypoints.length - 1 ? (
                <MapPin className="w-3 h-3 text-accent" />
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full ml-0.5" />
              )}
              <span className="text-sm text-gray-700">{waypoint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motorista */}
      <div className="mt-6 p-4 bg-primary/5 rounded-xl">
        <p className="text-xs text-secondary-foreground mb-2 font-medium">
          Motorista
        </p>
        <button
          onClick={() => navigate(`/user/${ride.driver.id}`)}
          className="w-full flex items-center gap-3 text-left hover:bg-primary/10 p-2 rounded-xl transition"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {ride.driver.name}
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-warning-foreground" />
              <span className="text-sm font-medium text-gray-700">
                {ride.driver.rating}
              </span>
              <span className="text-xs text-secondary-foreground">
                ({ride.driver.totalRatings})
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Accordion de outros passageiros */}
      {ride.otherPassengers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowPassengers((p) => !p)}
            className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">
              Outros passageiros ({ride.otherPassengers.length})
            </span>
            {showPassengers ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showPassengers && (
            <div className="space-y-2 mt-3">
              {ride.otherPassengers.map((passenger) => (
                <button
                  key={passenger.id}
                  onClick={() => navigate(`/user/${passenger.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {passenger.name}
                    </p>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-warning-foreground" />
                      <span className="text-xs text-gray-700 font-medium">
                        {passenger.rating}
                      </span>

                      <span className="text-xs text-gray-500">
                        • {passenger.gender}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
