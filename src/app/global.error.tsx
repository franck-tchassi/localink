'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-destructive mb-4">
              Erreur critique
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une erreur irrécupérable est survenue. Veuillez recharger la page.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}