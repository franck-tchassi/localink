'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from 'lucide-react';

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const [email] = useState(searchParams.get('email') || '');
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du code OTP
    if (otp.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch("/api/complete-registration", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la vérification");
      }

      if (data.success) {
        setSuccess("Inscription complétée avec succès! Redirection...");
        setTimeout(() => router.push("/auth/sign-in"), 2000);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      if (data.success) {
        setSuccess("Nouveau code envoyé !");
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Vérification OTP</h1>
        <p className="text-gray-600">
          Nous avons envoyé un code à 6 chiffres à <span className="font-semibold">{email}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP 
            maxLength={6}
            value={otp}
            onChange={(value) => setOTP(value)}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index} 
                  className="w-12 h-12 text-lg border-2 rounded-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Vérification...
              </>
            ) : 'Valider l\'inscription'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-600 underline disabled:opacity-70"
              disabled={resending || !email}
            >
              {resending ? (
                <>
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : 'Renvoyer le code'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-600 text-sm text-center rounded-lg">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
