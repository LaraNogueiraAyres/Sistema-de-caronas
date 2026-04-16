import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Digite um e-mail válido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Simular login e redirecionar para home
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:items-center lg:justify-center lg:py-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 lg:hidden">
        <Link to="/">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col lg:w-full lg:max-w-md lg:flex-none">
        <div className="flex-1 lg:flex-none">
          {/* Desktop Back Button */}
          <div className="hidden lg:block mb-6">
            <Link to="/">
              <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
            </Link>
          </div>

          <h1 className="text-primary text-3xl font-semibold mb-2 lg:text-4xl">
            Entrar ou criar conta
          </h1>
          <p className="text-gray-600 text-base mb-10 lg:text-lg">
            Insira seu e-mail e senha para começar
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-primary text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="seu@email.com"
                className={`w-full px-4 py-3.5 rounded-lg bg-input-background border-2 transition-all duration-200 outline-none ${
                  error && !password
                    ? 'border-accent bg-red-50'
                    : emailFocused 
                    ? 'border-accent bg-white' 
                    : 'border-transparent'
                }`}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-primary text-sm font-medium mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="••••••••"
                className={`w-full px-4 py-3.5 rounded-lg bg-input-background border-2 transition-all duration-200 outline-none ${
                  error && password
                    ? 'border-accent bg-red-50'
                    : passwordFocused 
                    ? 'border-accent bg-white' 
                    : 'border-transparent'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-accent">{error}</p>
              )}
            </div>

            {/* Forgot Password */}
            <button
              type="button"
              className="text-accent font-medium text-sm mb-6 hover:underline"
            >
              Esqueceu a senha?
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!email || !password}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 mb-6 ${
                email && password
                  ? 'bg-accent hover:bg-accent/90 active:scale-[0.98]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Entrar
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full py-3.5 rounded-xl border-2 border-gray-200 font-medium text-primary hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}