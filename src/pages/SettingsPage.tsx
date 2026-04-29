import { useState } from "react";
import {
  ArrowLeft,
  Menu,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  User,
  Calendar,
  Shield,
  Edit2,
  X,
  MapPin,
  Home,
  Briefcase,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { getCurrentUser, updateCurrentUser } from "../utils/auth";
import { formatLocalDate, parseLocalDate } from "../utils/date";
import type { SavedAddress } from "../types/user";

interface LayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
}

export function Settings() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    navigate("/");
    return null;
  }
  const { setSidebarOpen } = useOutletContext<LayoutContext>();

  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [pix, setPix] = useState(currentUser.pix || "");
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [birthDate, setBirthDate] = useState(currentUser.birthDate);
  const [gender, setGender] = useState(currentUser.gender);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [privateMode, setPrivateMode] = useState(
    currentUser.privateMode || false,
  );
  const [savedMessage, setSavedMessage] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(
    currentUser.savedAddresses || [],
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressValue, setNewAddressValue] = useState("");

  const handleSaveProfile = () => {
    updateCurrentUser({
      name,
      bio,
      birthDate,
      gender,
    });
    setIsEditingProfile(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSaveAccount = () => {
    updateCurrentUser({
      email,
      phone,
      pix,
    });
    setIsEditingAccount(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSavePrivacy = () => {
    updateCurrentUser({
      privateMode,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleTogglePrivateMode = () => {
    const nextPrivateMode = !privateMode;

    setPrivateMode(nextPrivateMode);
    updateCurrentUser({ privateMode: nextPrivateMode });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleAddAddress = () => {
    if (newAddressLabel.trim() && newAddressValue.trim()) {
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: newAddressLabel,
        address: newAddressValue,
      };
      const nextSavedAddresses = [...savedAddresses, newAddress];
      setSavedAddresses(nextSavedAddresses);
      updateCurrentUser({ savedAddresses: nextSavedAddresses });
      setNewAddressLabel("");
      setNewAddressValue("");
      setIsAddingAddress(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    const nextSavedAddresses = savedAddresses.filter(
      (addr) => addr.id !== addressId,
    );
    setSavedAddresses(nextSavedAddresses);
    updateCurrentUser({ savedAddresses: nextSavedAddresses });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const getAddressIcon = (label: string) => {
    if (label.toLowerCase() === "casa") return Home;
    if (label.toLowerCase() === "trabalho") return Briefcase;
    return MapPin;
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Alterar senha");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const calculateAge = (birthDate: string) => {
    const birth = parseLocalDate(birthDate);
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
          <h1 className="text-xl font-semibold">Configurações</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Success Message */}
        {savedMessage && (
          <div className="bg-success border border-success-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-success-foreground rounded-full flex items-center justify-center">
              <Save className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-success-foreground font-semibold">Salvo com sucesso!</p>
              <p className="text-success-foreground text-sm">
                Suas alterações foram aplicadas.
              </p>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Informações do Perfil
              </h2>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="p-2 hover:bg-info rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5 text-info-foreground" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setName(currentUser.name);
                  setBio(currentUser.bio || "");
                  setBirthDate(currentUser.birthDate);
                  setGender(currentUser.gender);
                }}
                className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-5 h-5 text-destructive" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-foreground-muted mb-2 block font-medium">
                Nome completo
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary focus: transition-all outline-none"
                />
              ) : (
                <p className="text-foreground font-semibold text-base px-4 py-3">
                  {name}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Gênero
              </label>
              {isEditingProfile ? (
                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(
                      e.target.value as "Masculino" | "Feminino" | "Outro",
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              ) : (
                <p className="text-gray-700 px-4 py-3">{gender}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Data de nascimento
              </label>
              {isEditingProfile ? (
                <>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Idade: {calculateAge(birthDate)} anos
                  </p>
                </>
              ) : (
                <p className="text-gray-700 px-4 py-3">
                  {formatLocalDate(birthDate)} •{" "}
                  {calculateAge(birthDate)} anos
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Sobre mim
              </label>
              {isEditingProfile ? (
                <>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={200}
                    placeholder="Conte um pouco sobre você..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {bio.length}/200 caracteres
                  </p>
                </>
              ) : (
                <p className="text-gray-700 px-4 py-3 leading-relaxed">
                  {bio || "Nenhuma descrição adicionada."}
                </p>
              )}
            </div>
          </div>

          {isEditingProfile && (
            <button
              onClick={handleSaveProfile}
              className="w-full mt-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Dados da Conta
              </h2>
            </div>
            {!isEditingAccount ? (
              <button
                onClick={() => setIsEditingAccount(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5 text-info-foreground" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingAccount(false);
                  setEmail(currentUser.email);
                  setPhone(currentUser.phone || "");
                  setPix(currentUser.pix || "");
                }}
                className="p-2 hover:bg-destructive-muted rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-5 h-5 text-destructive" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                E-mail
              </label>
              {isEditingAccount ? (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-700">{email}</p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Número de celular
              </label>
              {isEditingAccount ? (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-700">{phone || "Não informado"}</p>
                </div>
              )}
            </div>

            {/* PIX */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Chave PIX
              </label>
              {isEditingAccount ? (
                <>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={pix}
                      onChange={(e) => setPix(e.target.value)}
                      placeholder="Digite sua chave PIX"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Para receber pagamentos de caronas
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-700">{pix || "Não informado"}</p>
                </div>
              )}
            </div>
          </div>

          {isEditingAccount && (
            <button
              onClick={handleSaveAccount}
              className="w-full mt-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Endereços Salvos
              </h2>
            </div>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="p-2 hover:bg-info rounded-lg transition-colors"
              title="Adicionar endereço"
            >
              <Plus className="w-5 h-5 text-info-foreground" />
            </button>
          </div>

          <div className="space-y-3">
            {savedAddresses.length === 0 && !isAddingAddress && (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Nenhum endereço salvo ainda
                </p>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent-hover transition-colors text-sm"
                >
                  Adicionar primeiro endereço
                </button>
              </div>
            )}

            {savedAddresses.map((address) => {
              const Icon = getAddressIcon(address.label);
              return (
                <div
                  key={address.id}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {address.label}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {address.address}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 hover:bg-destructive-muted rounded-lg transition-colors flex-shrink-0"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              );
            })}

            {isAddingAddress && (
              <div className="p-4 bg-info rounded-xl border border-info-border">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm  mb-2 block font-medium">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      placeholder="Ex: Casa, Trabalho, Academia..."
                      className="w-full px-4 py-3 rounded-xl bg-background border border-transparent focus:border-info-border transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-info-foreground mb-2 block font-medium">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={newAddressValue}
                      onChange={(e) => setNewAddressValue(e.target.value)}
                      placeholder="Digite o endereço completo..."
                      className="w-full px-4 py-3 rounded-xl bg-background border border-transparent focus:border-info-border transition-all outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddressLabel("");
                        setNewAddressValue("");
                      }}
                      className="flex-1 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted-hover transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddAddress}
                      disabled={
                        !newAddressLabel.trim() || !newAddressValue.trim()
                      }
                      className={`flex-1 py-2 font-medium text-muted-foreground rounded-lg transition-colors ${
                        newAddressLabel.trim() && newAddressValue.trim()
                          ? "bg-muted hover:bg-muted-hover"
                          : "bg-muted cursor-not-allowed"
                      }`}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Privacidade
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-info rounded-xl border border-info-border">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-info-foreground mb-1">
                  Modo Privado
                </h3>
                <p className="text-sm text-gray-600">
                  Quando ativado, suas informações sensíveis (número de celular,
                  PIX e idade) ficarão ocultas para outros usuários
                </p>
              </div>
              <button
                type="button"
                onClick={handleTogglePrivateMode}
                className={`ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-info-border focus:ring-offset-2 flex-shrink-0 ${
                  privateMode ? "bg-info-foreground" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ${
                    privateMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {privateMode && (
              <div className="bg-info border border-info-border rounded-xl p-4">
                <p className="text-sm text-info-foreground">
                  <strong>Informações ocultas:</strong>
                </p>
                <ul className="text-sm text-info-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Número de celular</li>
                  <li>Chave PIX</li>
                  <li>Idade</li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleSavePrivacy}
            className="w-full mt-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Configuração
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-background rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Alterar Senha
            </h2>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Senha atual
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Confirmar nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border border-transparent focus:border-[#1D3557] focus:bg-background transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className={`w-full mt-6 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
              currentPassword && newPassword && confirmPassword
                ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Lock className="w-5 h-5" />
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
