import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Star,
  Edit2,
  Save,
  X,
  Menu,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { mockCurrentUser } from "../mocks/user";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function Profile() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext<LayoutContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(mockCurrentUser);

  const handleSave = () => {
    // Aqui implementaria a lógica de salvar no backend
    console.log("Salvar perfil:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(mockCurrentUser);
    setIsEditing(false);
  };

  // Calcular idade a partir da data de nascimento
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

  // Formatar data de nascimento
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return ( 
    <div className="min-h-screen overflow-y-auto bg-secondary flex flex-col overflow-hidden">
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
          <h1 className="text-xl font-semibold">Meu perfil</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-background/10 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-6 lg:max-w-4xl lg:mx-auto lg:w-full">
        {/* Profile Card */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Avatar Section */}
          <div className="relative bg-gradient-to-br from-primary to-accent px-6 pt-8 pb-20">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 mb-3">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-6 pb-6 -mt-12 relative z-10">
            {/* Rating Badge */}
            <div className="flex justify-center mb-4">
              <div className="bg-background rounded-full px-5 py-2.5 shadow-md border border-gray-100 inline-flex items-center gap-2">
                <Star className="w-5 h-5 text-warning-foreground fill-yellow-500" />
                <span className="text-foreground font-bold text-lg">
                  {mockCurrentUser.rating.toFixed(1)}
                </span>
                <span className="text-secondary-foreground text-sm">
                  ({mockCurrentUser.totalRatings} avaliações)
                </span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs text-foreground uppercase tracking-wide mb-1 block font-medium">
                  Nome completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                  />
                ) : (
                  <p className="text-foreground font-semibold text-lg">
                    {mockCurrentUser.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-secondary-foreground uppercase tracking-wide mb-1 block font-medium">
                  E-mail
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700">
                      {mockCurrentUser.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs text-secondary-foreground uppercase tracking-wide mb-1 block font-medium">
                  Gênero
                </label>
                {isEditing ? (
                  <select
                    value={editedUser.gender}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        gender: e.target.value as
                          | "Masculino"
                          | "Feminino"
                          | "Outro",
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                ) : (
                  <p className="text-gray-700">
                    {mockCurrentUser.gender}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-xs text-secondary-foreground uppercase tracking-wide mb-1 block font-medium">
                  Data de nascimento
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={editedUser.birthDate}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          birthDate: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700">
                      {formatDate(mockCurrentUser.birthDate)} •{" "}
                      {calculateAge(mockCurrentUser.birthDate)}{" "}
                      anos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="text-xs text-secondary-foreground uppercase tracking-wide mb-3 block font-medium">
            Sobre mim
          </label>
          {isEditing ? (
            <textarea
              value={editedUser.bio}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser,
                  bio: e.target.value,
                })
              }
              rows={4}
              maxLength={200}
              placeholder="Conte um pouco sobre você..."
              className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none resize-none"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {mockCurrentUser.bio ||
                "Nenhuma descrição adicionada."}
            </p>
          )}
          {isEditing && (
            <p className="text-xs text-gray-400 mt-2 text-right">
              {editedUser.bio.length}/200 caracteres
            </p>
          )}
        </div>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCancel}
              className="py-3.5 rounded-xl border-2 border-muted-foreground font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="py-3.5 rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}