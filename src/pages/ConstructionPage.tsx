export function ConstructionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-md">
        
        {/* Ícone */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-3xl text-accent">🚧</span>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-semibold mb-3 text-foreground">
          Página em construção
        </h1>

        {/* Descrição */}
        <p className="text-muted-foreground-foreground mb-6">
          Estamos trabalhando para trazer essa funcionalidade o mais rápido possível.
        </p>

        {/* Botão */}
        <button
          onClick={() => window.history.back()}
          className="bg-primary text-foreground-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          Voltar
        </button>

      </div>
    </div>
  );
}