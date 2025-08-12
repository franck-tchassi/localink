'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl mx-auto text-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Erreur inattendue
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Une erreur s'est produite. Notre équipe a été notifiée.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => reset()}
          >
            
            Réessayer
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/support">
              
              Support technique
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}