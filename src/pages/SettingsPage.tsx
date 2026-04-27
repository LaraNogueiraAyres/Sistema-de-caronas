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
import { getCurrentUser } from "../utils/auth";
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
    console.log("Salvar perfil:", {
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
    console.log("Salvar conta:", {
      email,
      phone,
      pix,
    });
    setIsEditingAccount(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSavePrivacy = () => {
    console.log("Salvar privacidade:", {
      privateMode,
    });
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
      setSavedAddresses([...savedAddresses, newAddress]);
      setNewAddressLabel("");
      setNewAddressValue("");
      setIsAddingAddress(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    setSavedAddresses(savedAddresses.filter((addr) => addr.id !== addressId));
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

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full px-6 pt-12 pb-6 bg-[#1D3557] text-white">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden lg:block"
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-semibold">Salvo com sucesso!</p>
              <p className="text-green-700 text-sm">
                Suas alterações foram aplicadas.
              </p>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1D3557] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1D3557]">
                Informações do Perfil
              </h2>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5 text-[#1D3557]" />
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Nome completo
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
                />
              ) : (
                <p className="text-[#1D3557] font-semibold text-base px-4 py-3">
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
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Idade: {calculateAge(birthDate)} anos
                  </p>
                </>
              ) : (
                <p className="text-gray-700 px-4 py-3">
                  {new Date(birthDate).toLocaleDateString("pt-BR")} •{" "}
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
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none resize-none"
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
              className="w-full mt-6 py-3 bg-[#1D3557] text-white font-semibold rounded-xl hover:bg-[#2d4a6f] transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E63946] rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1D3557]">
                Dados da Conta
              </h2>
            </div>
            {!isEditingAccount ? (
              <button
                onClick={() => setIsEditingAccount(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5 text-[#1D3557]" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingAccount(false);
                  setEmail(currentUser.email);
                  setPhone(currentUser.phone || "");
                  setPix(currentUser.pix || "");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-5 h-5 text-gray-500" />
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
              className="w-full mt-6 py-3 bg-[#1D3557] text-white font-semibold rounded-xl hover:bg-[#2d4a6f] transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#1D3557]">
                Endereços Salvos
              </h2>
            </div>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Adicionar endereço"
            >
              <Plus className="w-5 h-5 text-[#1D3557]" />
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
                  className="mt-4 px-4 py-2 bg-[#1D3557] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors text-sm"
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
                  <div className="w-10 h-10 bg-[#1D3557] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1D3557] mb-1">
                      {address.label}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {address.address}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              );
            })}

            {isAddingAddress && (
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block font-medium">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      placeholder="Ex: Casa, Trabalho, Academia..."
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-[#1D3557] transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block font-medium">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={newAddressValue}
                      onChange={(e) => setNewAddressValue(e.target.value)}
                      placeholder="Digite o endereço completo..."
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-[#1D3557] transition-all outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddressLabel("");
                        setNewAddressValue("");
                      }}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddAddress}
                      disabled={
                        !newAddressLabel.trim() || !newAddressValue.trim()
                      }
                      className={`flex-1 py-2 font-medium rounded-lg transition-colors ${
                        newAddressLabel.trim() && newAddressValue.trim()
                          ? "bg-[#1D3557] text-white hover:bg-[#2d4a6f]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D3557]">
              Privacidade
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#1D3557] mb-1">
                  Modo Privado
                </h3>
                <p className="text-sm text-gray-600">
                  Quando ativado, suas informações sensíveis (número de celular,
                  PIX e idade) ficarão ocultas para outros usuários
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrivateMode(!privateMode)}
                className={`ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 flex-shrink-0 ${
                  privateMode ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    privateMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {privateMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Informações ocultas:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Número de celular</li>
                  <li>Chave PIX</li>
                  <li>Idade</li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleSavePrivacy}
            className="w-full mt-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Configuração
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D3557]">
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
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#F5F5F5] border-2 border-transparent focus:border-[#1D3557] focus:bg-white transition-all outline-none"
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
                ? "bg-[#E63946] text-white hover:bg-[#d63340]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
