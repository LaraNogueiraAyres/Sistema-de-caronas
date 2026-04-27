import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  User,
  Star,
  Calendar,
  Navigation,
  Trash2,
  Check,
  X,
  Phone,
  AlertCircle,
  CheckCircle2,
  Menu,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockMyRides, mockMyRidesAsPassenger } from "../mocks/my-rides";
import type { MyRide, PassengerRequest, MyRideAsPassenger, Rating } from "../types/my-ride";
import { ChatModal } from "./ChatModal";
import { RatingModal } from "./RatingPage";
import { getMyRides } from "../utils/rides";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

type ModalType = "delete" | "requests" | "complete" | "cancel-passenger" | null;
type TabType = "offered" | "received";

export function MyRides() {
  const navigate = useNavigate();
  
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [activeTab, setActiveTab] = useState<TabType>("offered");
  const [rides, setRides] = useState<MyRide[]>(() => {
  const saved = getMyRides();

  const activeMocks = mockMyRides.filter(
    (ride) => ride.status !== "completed"
  );

  return [...activeMocks, ...saved];
});
  const [ridesAsPassenger, setRidesAsPassenger] = useState<MyRideAsPassenger[]>(
    mockMyRidesAsPassenger.filter((ride) => ride.status !== "completed"),
  );
  const [selectedRide, setSelectedRide] = useState<MyRide | null>(null);
  const [selectedPassengerRide, setSelectedPassengerRide] = useState<MyRideAsPassenger | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [expandedRides, setExpandedRides] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);
  const [chatUser, setChatUser] = useState<{
    id: string;
    name: string;
    rating: number;
  } | null>(null);
  const [chatRideInfo, setChatRideInfo] = useState<{
    date: string;
    origin: string;
    destination: string;
  } | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [currentRatingUser, setCurrentRatingUser] = useState<{
    id: string;
    name: string;
    rating: number;
  } | null>(null);
  const [currentRatingType, setCurrentRatingType] = useState<"driver" | "passenger">("passenger");
  const [passengersToRate, setPassengersToRate] = useState<PassengerRequest[]>([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);

  const isRidePast = (date: string, timeEnd: string): boolean => {
    const now = new Date();
    const rideDateTime = new Date(`${date}T${timeEnd}`);
    return rideDateTime < now;
  };

  const getHoursUntilRide = (date: string, timeStart: string): number => {
    const now = new Date();
    const rideDateTime = new Date(`${date}T${timeStart}`);
    const diffMs = rideDateTime.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const handleDeleteRide = (rideId: string) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return;

    const hoursUntilRide = getHoursUntilRide(ride.date, ride.departureTimeStart);

    if (hoursUntilRide < 6 && hoursUntilRide > 0) {
      // Aqui você aplicaria a penalidade de -0.1 na nota do usuário
      console.log("Penalidade aplicada: -0.1 na nota do usuário");
      // TODO: Implementar lógica real de atualização da nota
    }

    setRides(rides.filter((r) => r.id !== rideId));
    setModalType(null);
    setSelectedRide(null);
  };

  const handleCompleteRide = (ride: MyRide) => {
    setSelectedRide(ride);
    setPassengersToRate(ride.confirmedPassengers);
    setCurrentPassengerIndex(0);
    if (ride.confirmedPassengers.length > 0) {
      setModalType("complete");
      openRatingModal(
        ride.confirmedPassengers[0].passenger,
        "passenger",
        {
          date: ride.date,
          origin: ride.origin,
          destination: ride.destination,
        }
      );
    } else {
      // Se não há passageiros, apenas marcar como concluída e remover da lista
      setRides(rides.filter((r) => r.id !== ride.id));
    }
  };

  const handleCompletePassengerRide = (ride: MyRideAsPassenger) => {
    setSelectedPassengerRide(ride);
    openRatingModal(
      ride.driver,
      "driver",
      {
        date: ride.date,
        origin: ride.origin,
        destination: ride.destination,
      }
    );
  };

  const openRatingModal = (
    user: { id: string; name: string; rating: number },
    type: "driver" | "passenger",
    rideInfo: { date: string; origin: string; destination: string }
  ) => {
    setCurrentRatingUser(user);
    setCurrentRatingType(type);
    setChatRideInfo(rideInfo);
    setRatingModalOpen(true);
  };

  const handleSubmitRating = (rating: number, comment: string, reportReason?: string) => {
    console.log("Avaliação submetida:", { rating, comment, user: currentRatingUser, reportReason });

    if (modalType === "complete" && selectedRide) {
      // Avaliar passageiros da carona oferecida
      const nextIndex = currentPassengerIndex + 1;

      if (nextIndex < passengersToRate.length) {
        setCurrentPassengerIndex(nextIndex);
        openRatingModal(
          passengersToRate[nextIndex].passenger,
          "passenger",
          {
            date: selectedRide.date,
            origin: selectedRide.origin,
            destination: selectedRide.destination,
          }
        );
      } else {
        // Todas as avaliações foram concluídas - remover da lista
        setRides(rides.filter((r) => r.id !== selectedRide.id));
        setRatingModalOpen(false);
        setModalType(null);
        setSelectedRide(null);
        setPassengersToRate([]);
        setCurrentPassengerIndex(0);
      }
    } else if (selectedPassengerRide) {
      // Avaliar motorista da carona recebida - remover da lista
      setRidesAsPassenger(ridesAsPassenger.filter((r) => r.id !== selectedPassengerRide.id));
      setRatingModalOpen(false);
      setSelectedPassengerRide(null);
    }
  };

  const handleCancelPassengerRide = (rideId: string) => {
    const ride = ridesAsPassenger.find((r) => r.id === rideId);
    if (!ride) return;

    const hoursUntilRide = getHoursUntilRide(ride.date, ride.departureTimeStart);

    if (hoursUntilRide < 6 && hoursUntilRide > 0) {
      // Aplicar penalidade de -0.1 na nota do usuário
      console.log("Penalidade aplicada: -0.1 na nota do usuário por cancelamento de carona recebida");
    }

    setRidesAsPassenger(ridesAsPassenger.filter((r) => r.id !== rideId));
    setModalType(null);
    setSelectedPassengerRide(null);
  };

  const handleAcceptRequest = (
    rideId: string,
    requestId: string,
  ) => {
    setRides(
      rides.map((ride) => {
        if (ride.id === rideId) {
          const request = ride.requests.find(
            (r) => r.id === requestId,
          );
          if (request && ride.availableSeats > 0) {
            return {
              ...ride,
              requests: ride.requests.filter(
                (r) => r.id !== requestId,
              ),
              confirmedPassengers: [
                ...ride.confirmedPassengers,
                { ...request, status: "accepted" as const },
              ],
              availableSeats: ride.availableSeats - 1,
            };
          }
        }
        return ride;
      }),
    );
  };

  const handleRejectRequest = (
    rideId: string,
    requestId: string,
  ) => {
    setRides(
      rides.map((ride) =>
        ride.id === rideId
          ? {
              ...ride,
              requests: ride.requests.filter(
                (r) => r.id !== requestId,
              ),
            }
          : ride,
      ),
    );
  };

  const handleRemovePassenger = (
    rideId: string,
    passengerId: string,
  ) => {
    setRides(
      rides.map((ride) =>
        ride.id === rideId
          ? {
              ...ride,
              confirmedPassengers:
                ride.confirmedPassengers.filter(
                  (p) => p.id !== passengerId,
                ),
              availableSeats: ride.availableSeats + 1,
            }
          : ride,
      ),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const toggleRideExpansion = (rideId: string) => {
    setExpandedRides((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rideId)) {
        newSet.delete(rideId);
      } else {
        newSet.add(rideId);
      }
      return newSet;
    });
  };

  const openChat = (user: { id: string; name: string; rating: number }, rideInfo: { date: string; origin: string; destination: string }) => {
    setChatUser(user);
    setChatRideInfo(rideInfo);
    setChatOpen(true);
  };

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col overflow-hidden">
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
            Minhas caronas
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:max-w-7xl lg:mx-auto lg:w-full">
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
            Caronas recebidas
          </button>
        </div>

        {/* Tab Content - Offered Rides */}
        {activeTab === "offered" && (
          <div className="space-y-4">
            {rides.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Nenhuma carona ativa
                  </h3>
                  <p className="text-secondary-foreground text-sm mb-6">
                    Você ainda não ofereceu nenhuma carona
                  </p>
                  <button
                    onClick={() => navigate("/offer-ride")}
                    className="px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors"
                  >
                    Oferecer carona
                  </button>
                </div>
              </div>
            ) : (
              rides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-background rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-foreground font-semibold text-lg">
                          {formatDate(ride.date)}
                        </h3>
                        {ride.sameGenderOnly && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                            Mesmo gênero
                          </span>
                        )}
                        {ride.status === "completed" && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Concluída
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ride.routeName}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {ride.status !== "completed" && (
                        <button
                          onClick={() => {
                            setSelectedRide(ride);
                            setModalType("delete");
                          }}
                          className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route */}
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

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {ride.departureTimeStart} -{" "}
                        {ride.departureTimeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        R$ {ride.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {ride.availableSeats}/{ride.totalSeats}{" "}
                        vagas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {ride.confirmedPassengers.length}{" "}
                        confirmado(s)
                      </span>
                    </div>
                  </div>

                  {/* Requests Badge */}
                  {ride.requests.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedRide(ride);
                        setModalType("requests");
                      }}
                      className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">
                          {ride.requests.length} nova(s)
                          solicitação(ões)
                        </span>
                      </div>
                      <span className="text-yellow-600">→</span>
                    </button>
                  )}

                  {/* Confirmed Passengers - Collapsible */}
                  {ride.confirmedPassengers.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleRideExpansion(ride.id)}
                        className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {ride.confirmedPassengers.length} passageiro(s) confirmado(s)
                          </span>
                        </div>
                        {expandedRides.has(ride.id) ? (
                          <ChevronUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-green-600" />
                        )}
                      </button>

                      {expandedRides.has(ride.id) && (
                        <div className="space-y-2 mt-3">
                          {ride.confirmedPassengers.map(
                            (passenger) => (
                              <div
                                key={passenger.id}
                                className="flex items-center justify-between p-3 bg-background border border-gray-200 rounded-lg"
                              >
                                <button
                                  onClick={() =>
                                    navigate(`/user/${passenger.passenger.id}`)
                                  }
                                  className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                                >
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {passenger.passenger.name}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                      <span className="text-xs text-gray-600">
                                        {passenger.passenger.rating}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                                {ride.status !== "completed" && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        openChat(
                                          {
                                            id: passenger.passenger.id,
                                            name: passenger.passenger.name,
                                            rating: passenger.passenger.rating,
                                          },
                                          {
                                            date: ride.date,
                                            origin: ride.origin,
                                            destination: ride.destination,
                                          }
                                        )
                                      }
                                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                      <MessageCircle className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRemovePassenger(
                                          ride.id,
                                          passenger.id,
                                        )
                                      }
                                      className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Complete Ride Button */}
                  {ride.status === "active" &&
                    isRidePast(ride.date, ride.departureTimeEnd) &&
                    !ride.driverRatingsGiven && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleCompleteRide(ride)}
                          className="w-full p-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Concluir carona e avaliar passageiros
                        </button>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content - Received Rides */}
        {activeTab === "received" && (
          <div className="space-y-4">
            {ridesAsPassenger.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Nenhuma carona recebida
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Você ainda não recebeu nenhuma carona
                  </p>
                </div>
              </div>
            ) : (
              ridesAsPassenger.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-background rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-foreground font-semibold text-lg">
                          {formatDate(ride.date)}
                        </h3>
                        {ride.sameGenderOnly && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                            Mesmo gênero
                          </span>
                        )}
                        {ride.status === "completed" && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Concluída
                          </span>
                        )}
                        {ride.status === "confirmed" && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Confirmada
                          </span>
                        )}
                        {ride.status === "pending" && (
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                            Pendente
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ride.routeName}
                      </p>
                    </div>

                    {(ride.status === "confirmed" || ride.status === "pending") && (
                      <button
                        onClick={() => {
                          setSelectedPassengerRide(ride);
                          setModalType("cancel-passenger");
                        }}
                        className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-destructive" />
                      </button>
                    )}
                  </div>

                  {/* Route */}
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

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {ride.departureTimeStart} -{" "}
                        {ride.departureTimeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        R$ {ride.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Motorista
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/user/${ride.driver.id}`)}
                        className="flex-1 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {ride.driver.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">
                              {ride.driver.rating} ({ride.driver.totalRatings})
                            </span>
                          </div>
                        </div>
                      </button>
                      {ride.status === "confirmed" && (
                        <button
                          onClick={() =>
                            openChat(
                              {
                                id: ride.driver.id,
                                name: ride.driver.name,
                                rating: ride.driver.rating,
                              },
                              {
                                date: ride.date,
                                origin: ride.origin,
                                destination: ride.destination,
                              }
                            )
                          }
                          className="p-3 bg-primary hover:bg-[#2d4a6f] rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-5 h-5 text-primary-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Complete Ride Button for Passenger */}
                  {ride.status === "confirmed" &&
                    isRidePast(ride.date, ride.departureTimeEnd) &&
                    !ride.passengerRatingGiven && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleCompletePassengerRide(ride)}
                          className="w-full p-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Concluir carona e avaliar motorista
                        </button>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {modalType === "delete" && selectedRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-foreground font-semibold text-lg">
                  Excluir carona
                </h2>
                <p className="text-gray-600 text-sm">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formatDate(selectedRide.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedRide.departureTimeStart} -{" "}
                    {selectedRide.departureTimeEnd}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedRide.origin} →{" "}
                    {selectedRide.destination}
                  </span>
                </div>
              </div>
            </div>

            {selectedRide.confirmedPassengers.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Há {selectedRide.confirmedPassengers.length}{" "}
                    passageiro(s) confirmado(s). Eles serão
                    notificados sobre o cancelamento.
                  </p>
                </div>
              </div>
            )}

            {(() => {
              const hoursUntilRide = getHoursUntilRide(
                selectedRide.date,
                selectedRide.departureTimeStart
              );
              return hoursUntilRide < 6 && hoursUntilRide > 0 ? (
                <div className="mb-6 p-3 bg-destructive-muted border border-red-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Atenção: Penalidade aplicada!
                      </p>
                      <p className="text-sm text-red-700">
                        Ao deletar esta carona com menos de 6 horas de
                        antecedência, você perderá <strong>0.1 ponto</strong> na
                        sua avaliação.
                        {selectedRide.confirmedPassengers.length > 0 &&
                          " Os passageiros serão notificados sobre o cancelamento."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedRide(null);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  handleDeleteRide(selectedRide.id)
                }
                className="flex-1 py-3 bg-destructive text-primary-foreground font-medium rounded-lg hover:bg-destructive-hover transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Modal */}
      {modalType === "requests" && selectedRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground font-semibold text-lg">
                Solicitações ({selectedRide.requests.length})
              </h2>
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedRide(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {selectedRide.requests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">
                  Todas as solicitações foram processadas!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedRide.requests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <button
                      onClick={() => navigate(`/user/${request.passenger.id}`)}
                      className="flex items-start gap-3 mb-3 w-full text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-foreground font-semibold">
                          {request.passenger.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {request.passenger.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({request.passenger.totalRatings})
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {request.passenger.gender}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{request.passenger.phone}</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Solicitado em{" "}
                      {new Date(
                        request.requestedAt,
                      ).toLocaleString("pt-BR")}
                    </p>

                    {selectedRide.availableSeats === 0 ? (
                      <div className="bg-destructive-muted border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-700">
                          Não há mais vagas disponíveis
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleRejectRequest(
                              selectedRide.id,
                              request.id,
                            )
                          }
                          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Recusar
                        </button>
                        <button
                          onClick={() =>
                            handleAcceptRequest(
                              selectedRide.id,
                              request.id,
                            )
                          }
                          className="flex-1 py-2 px-4 bg-green-600 text-primary-foreground font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Aceitar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && chatUser && chatRideInfo && (
        <ChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          otherUser={chatUser}
          rideInfo={chatRideInfo}
        />
      )}

      {/* Cancel Passenger Ride Modal */}
      {modalType === "cancel-passenger" && selectedPassengerRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-foreground font-semibold text-lg">
                  Cancelar carona
                </h2>
                <p className="text-gray-600 text-sm">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formatDate(selectedPassengerRide.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedPassengerRide.departureTimeStart} -{" "}
                    {selectedPassengerRide.departureTimeEnd}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {selectedPassengerRide.origin} →{" "}
                    {selectedPassengerRide.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Motorista: {selectedPassengerRide.driver.name}
                  </span>
                </div>
              </div>
            </div>

            {(() => {
              const hoursUntilRide = getHoursUntilRide(
                selectedPassengerRide.date,
                selectedPassengerRide.departureTimeStart
              );
              return hoursUntilRide < 6 && hoursUntilRide > 0 ? (
                <div className="mb-6 p-3 bg-destructive-muted border border-red-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Atenção: Penalidade aplicada!
                      </p>
                      <p className="text-sm text-red-700">
                        Ao cancelar esta carona com menos de 6 horas de
                        antecedência, você perderá <strong>0.1 ponto</strong> na
                        sua avaliação. O motorista será notificado sobre o cancelamento.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      O motorista será notificado sobre o cancelamento.
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedPassengerRide(null);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() =>
                  handleCancelPassengerRide(selectedPassengerRide.id)
                }
                className="flex-1 py-3 bg-destructive text-primary-foreground font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModalOpen && currentRatingUser && chatRideInfo && (
        <RatingModal
          isOpen={ratingModalOpen}
          onClose={() => {
            setRatingModalOpen(false);
            setModalType(null);
            setSelectedRide(null);
            setSelectedPassengerRide(null);
            setPassengersToRate([]);
            setCurrentPassengerIndex(0);
          }}
          onSubmit={handleSubmitRating}
          userName={currentRatingUser.name}
          userRating={currentRatingUser.rating}
          rideInfo={chatRideInfo}
          userType={currentRatingType}
        />
      )}
    </div>
  );
}