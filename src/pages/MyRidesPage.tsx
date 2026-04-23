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
  Edit,
  Trash2,
  Check,
  X,
  Phone,
  AlertCircle,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockMyRides, mockMyRidesAsPassenger } from "../mocks/my-rides";
import type { MyRide, PassengerRequest, MyRideAsPassenger } from "../types/my-ride";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

type ModalType = "delete" | "edit" | "requests" | null;
type TabType = "offered" | "received";

export function MyRides() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [activeTab, setActiveTab] = useState<TabType>("offered");
  const [rides, setRides] = useState<MyRide[]>(
    mockMyRides.filter((ride) => ride.status === "active"),
  );
  const [ridesAsPassenger, setRidesAsPassenger] = useState<MyRideAsPassenger[]>(
    mockMyRidesAsPassenger,
  );
  const [selectedRide, setSelectedRide] =
    useState<MyRide | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    timeStart: "",
    timeEnd: "",
    price: "",
    totalSeats: "",
  });

  const handleDeleteRide = (rideId: string) => {
    setRides(rides.filter((ride) => ride.id !== rideId));
    setModalType(null);
    setSelectedRide(null);
  };

  const handleEditRide = (ride: MyRide) => {
    setSelectedRide(ride);
    setEditForm({
      date: ride.date,
      timeStart: ride.departureTimeStart,
      timeEnd: ride.departureTimeEnd,
      price: ride.price.toString(),
      totalSeats: ride.totalSeats.toString(),
    });
    setModalType("edit");
  };

  const handleSaveEdit = () => {
    if (selectedRide) {
      setRides(
        rides.map((ride) =>
          ride.id === selectedRide.id
            ? {
                ...ride,
                date: editForm.date,
                departureTimeStart: editForm.timeStart,
                departureTimeEnd: editForm.timeEnd,
                price: parseFloat(editForm.price),
                totalSeats: parseInt(editForm.totalSeats),
                availableSeats:
                  parseInt(editForm.totalSeats) -
                  ride.confirmedPassengers.length,
              }
            : ride,
        ),
      );
      setModalType(null);
      setSelectedRide(null);
    }
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

  return (
    <div className="h-screen bg-secondary flex flex-col overflow-hidden">
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
                : "text-gray-600 hover:bg-secondary"
            }`}
          >
            Caronas oferecidas
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "received"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-gray-600 hover:bg-secondary"
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
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Nenhuma carona ativa
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Você ainda não ofereceu nenhuma carona
                  </p>
                  <button
                    onClick={() => navigate("/offer-ride")}
                    className="px-6 py-3 bg-accent text-primary-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors"
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
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ride.routeName}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRide(ride)}
                        className="p-2 hover:bg-info rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-info-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRide(ride);
                          setModalType("delete");
                        }}
                        className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
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
                      <Clock className="w-4 h-4 text-secondary-foreground" />
                      <span className="text-sm text-gray-700">
                        {ride.departureTimeStart} -{" "}
                        {ride.departureTimeEnd}
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
                        {ride.availableSeats}/{ride.totalSeats}{" "}
                        vagas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-secondary-foreground" />
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
                      className="w-full p-3 bg-warning border border-yellow-200 rounded-lg hover:bg-warning-hover transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-warning-foreground" />
                        <span className="text-sm font-medium text-warning-foreground">
                          {ride.requests.length} nova(s)
                          solicitação(ões)
                        </span>
                      </div>
                      <span className="text-warning-foreground">→</span>
                    </button>
                  )}

                  {/* Confirmed Passengers */}
                  {ride.confirmedPassengers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Passageiros confirmados
                      </h4>
                      <div className="space-y-2">
                        {ride.confirmedPassengers.map(
                          (passenger) => (
                            <div
                              key={passenger.id}
                              className="flex items-center justify-between p-3 bg-success border border-green-200 rounded-lg"
                            >
                              <button
                                onClick={() =>
                                  navigate(`/user/${passenger.passenger.id}`)
                                }
                                className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {passenger.passenger.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-warning-foreground fill-yellow-500" />
                                    <span className="text-xs text-gray-600">
                                      {passenger.passenger.rating}
                                    </span>
                                  </div>
                                </div>
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
                          ),
                        )}
                      </div>
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
                        {ride.status === "confirmed" && (
                          <span className="px-2 py-0.5 bg-success text-success-foreground text-xs font-medium rounded-full">
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
                      <Clock className="w-4 h-4 text-secondary-foreground" />
                      <span className="text-sm text-gray-700">
                        {ride.departureTimeStart} -{" "}
                        {ride.departureTimeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-secondary-foreground" />
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
                    <button
                      onClick={() => navigate(`/user/${ride.driver.id}`)}
                      className="w-full flex items-center gap-3 p-3 bg-info border border-blue-200 rounded-lg hover:bg-info-muted transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {ride.driver.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning-foreground fill-yellow-500" />
                          <span className="text-xs text-gray-600">
                            {ride.driver.rating} ({ride.driver.totalRatings})
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
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
              <div className="w-12 h-12 bg-destructive-muted rounded-full flex items-center justify-center">
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

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm ">
                    {formatDate(selectedRide.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm ">
                    {selectedRide.departureTimeStart} -{" "}
                    {selectedRide.departureTimeEnd}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary-foreground" />
                  <span className="text-sm text-gray-700">
                    {selectedRide.origin} →{" "}
                    {selectedRide.destination}
                  </span>
                </div>
              </div>
            </div>

            {selectedRide.confirmedPassengers.length > 0 && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedRide(null);
                }}
                className="flex-1 py-3 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted-hover transition-colors"
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

      {/* Edit Modal */}
      {modalType === "edit" && selectedRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground font-semibold text-lg">
                Editar carona
              </h2>
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedRide(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground mb-2 block font-medium">
                  Data
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-2 block font-medium">
                  Horário de partida
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={editForm.timeStart}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        timeStart: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                  />
                  <input
                    type="time"
                    value={editForm.timeEnd}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        timeEnd: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground mb-2 block font-medium">
                  Preço por pessoa
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-2 block font-medium">
                  Total de vagas
                </label>
                <select
                  value={editForm.totalSeats}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalSeats: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                >
                  <option value="1">1 vaga</option>
                  <option value="2">2 vagas</option>
                  <option value="3">3 vagas</option>
                  <option value="4">4 vagas</option>
                </select>
              </div>

              <div className="bg-warning rounded-lg p-3">
                <p className="text-xs text-warning-foreground">
                  <strong>Nota:</strong> Você não pode editar a
                  origem, destino ou rota após criar a carona.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedRide(null);
                }}
                className="flex-1 py-3 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted-hover transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Salvar alterações
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
                <X className="w-5 h-5 text-secondary-foreground" />
              </button>
            </div>

            {selectedRide.requests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-success-foreground mx-auto mb-3" />
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
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-foreground font-semibold">
                          {request.passenger.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning-foreground fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {request.passenger.rating}
                            </span>
                            <span className="text-xs text-secondary-foreground">
                              ({request.passenger.totalRatings})
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-secondary-foreground mt-1">
                          {request.passenger.gender}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{request.passenger.phone}</span>
                    </div>

                    <p className="text-xs text-secondary-foreground mb-3">
                      Solicitado em{" "}
                      {new Date(
                        request.requestedAt,
                      ).toLocaleString("pt-BR")}
                    </p>

                    {selectedRide.availableSeats === 0 ? (
                      <div className="bg-destructive-muted border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-destructive">
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
                          className="flex-1 py-2 px-4 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted-hover transition-colors flex items-center justify-center gap-2"
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
                          className="flex-1 py-2 px-4 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
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
    </div>
  );
}