'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTestimonialsDemo } from '@/app/[locale]/(landing)/sections/AnimatedTestimonialsDemo';
import { useI18n } from '@/locales/client';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';

interface SignUpProps {
  action: (email: string, password: string) => Promise<{ message: string; requiresOTP: boolean; email?: string }>;
}

const SignUp = ({ action }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState('');
  const t = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await action(email, password);
    setMessage(res.message);
    setRequiresOTP(res.requiresOTP);
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage('Veuillez entrer un code à 6 chiffres');
      return;
    }
    setVerifying(true);
    setMessage('');
    try {
      const res = await fetch('/api/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la vérification');
      if (data.success) {
        setSuccess('Inscription complétée avec succès !');
        setTimeout(() => router.push('/auth/sign-in'), 2000);
      } else {
        setMessage(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full h-full mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Colonne gauche : témoignages */}
        {!isMobile && (
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 text-white relative">
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <AnimatedTestimonialsDemo />
            </div>
          </div>
        )}

        {/* Colonne droite : formulaire */}
        <div className="flex flex-col justify-center items-center p-6 md:p-10 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                {requiresOTP ? 'Vérification OTP' : t('landing.signup.title')}
              </h2>
              {!requiresOTP && (
                <p className="mt-2 text-gray-600">
                  {t('landing.signup.subtitle')}
                </p>
              )}
              {requiresOTP && (
                <p className="mt-2 text-gray-600">
                  Nous avons envoyé un code à 6 chiffres à{' '}
                  <span className="font-semibold">{email}</span>
                </p>
              )}
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg whitespace-pre-line">
                {message}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 text-sm text-center rounded-lg">
                {success}
              </div>
            )}

            {!requiresOTP ? (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('landing.signup.input_mail')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('landing.signup.input_password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Inscription...
                    </>
                  ) : (
                    t('landing.signup.sign_up')
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(v) => setOtp(v)}
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-12 border-2 rounded-lg text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Vérification...
                    </>
                  ) : (
                    'Valider l’inscription'
                  )}
                </button>
              </form>
            )}

            {!requiresOTP && (
              <div className="mt-6 text-center text-sm text-gray-600">
                {t('landing.signup.you_have_account')}{' '}
                <Link
                  href="/auth/sign-in"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('landing.signup.you_have_account_signin')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
