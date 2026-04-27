import { useState } from "react";
import { Star, X, User as UserIcon, AlertTriangle } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, reportReason?: string) => void;
  userName: string;
  userRating: number;
  rideInfo: {
    date: string;
    origin: string;
    destination: string;
  };
  userType: "driver" | "passenger";
}

export function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  userRating,
  rideInfo,
  userType,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportConfirmation, setShowReportConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor, selecione uma avaliação");
      return;
    }

    if (showReport && reportReason.trim()) {
      setShowReportConfirmation(true);
      setTimeout(() => {
        onSubmit(rating, comment, reportReason);
        setRating(0);
        setComment("");
        setShowReport(false);
        setReportReason("");
        setShowReportConfirmation(false);
      }, 2000);
    } else {
      onSubmit(rating, comment);
      setRating(0);
      setComment("");
      setShowReport(false);
      setReportReason("");
    }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-foreground font-semibold text-lg">
            Avaliar {userType === "driver" ? "motorista" : "passageiro"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-[#F5F5F5] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1D3557] to-[#2d4a6f] rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {userName}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-600">{userRating}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">{formatDate(rideInfo.date)}</p>
            <p>
              {rideInfo.origin} → {rideInfo.destination}
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Qual a sua avaliação?
          </label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center mt-2">
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Muito ruim"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua experiência..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none resize-none"
          />
        </div>

        {/* Report Section */}
        {!showReport ? (
          <button
            onClick={() => setShowReport(true)}
            className="w-full mb-4 py-2 text-sm text-destructive hover:text-red-700 font-medium flex items-center justify-center gap-2 hover:bg-destructive-muted rounded-lg transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Fazer uma denúncia
          </button>
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-red-700">
                Motivo da denúncia
              </label>
              <button
                onClick={() => {
                  setShowReport(false);
                  setReportReason("");
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancelar denúncia
              </button>
            </div>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Descreva o motivo da denúncia..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-destructive-muted border-2 border-red-200 focus:border-red-500 focus:bg-background transition-all outline-none resize-none"
            />
            <p className="text-xs text-destructive mt-2">
              Denúncias falsas podem resultar em penalidades na sua conta.
            </p>
          </div>
        )}

        {/* Report Confirmation Message */}
        {showReportConfirmation && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-700">
                  Denúncia enviada!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Sua denúncia será avaliada pela nossa equipe. Obrigado por contribuir para a segurança da comunidade.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {!showReportConfirmation && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors"
            >
              Enviar avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
