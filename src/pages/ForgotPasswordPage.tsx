import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setShowSuccess(true);
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* LADO ESQUERDO */}
        <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo 👋</h1>
            <p className="text-lg opacity-90">
              Entre na sua conta e comece a encontrar caronas de forma simples e segura.
            </p>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex-1 px-6 pt-10 pb-6 flex flex-col lg:justify-center lg:px-20 lg:py-12">
          {/* TOPO */}
          <div className="mb-6 lg:mb-8 flex items-center gap-4">
            <Link to="/login">
              <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
            </Link>

            <h1 className="text-foreground text-3xl font-semibold">
              Recuperar senha
            </h1>
          </div>

          <div className="w-full max-w-md mx-auto">
            <p className="text-gray-600 mb-8">
              Informe seu e-mail para receber as instruções de recuperação da sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-accent-foreground bg-accent hover:bg-accent-hover active:scale-[0.98] transition-all duration-200"
              >
                Enviar instruções
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              E-mail enviado!
            </h2>

            <p className="text-muted-foreground mb-6">
              Caso o e-mail esteja cadastrado, você receberá as instruções.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent-hover transition-colors"
            >
              Voltar para login
            </button>
          </div>
        </div>
      )}
    </>
  );
}