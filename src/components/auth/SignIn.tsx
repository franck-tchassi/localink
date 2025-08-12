"use client"

import React, { useActionState } from 'react'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { AnimatedTestimonialsDemo } from '@/app/[locale]/(landing)/sections/AnimatedTestimonialsDemo'
import { useI18n } from '@/locales/client'
import { useMediaQuery } from '@/hooks/use-media-query'

const initialState = {
    message: '',
    field: undefined as string | undefined,
}

type SignInState = {
    message: string | undefined;
    field?: string;
};

type SignInProps = {
    action: (prevState: any, formData: FormData) => Promise<SignInState>
}

const SignIn = ({ action }: SignInProps) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [state, formAction, isPending] = useActionState(action, initialState);
    const t = useI18n();
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="h-screen w-screen bg-gray-50 flex  items-center justify-center ">
            <div className="w-full h-full mx-auto grid grid-cols-1 md:grid-cols-2    overflow-hidden ">
                {/* Colonne gauche : avis (cachée sur mobile) */}
                {!isMobile && (
                    <div className="hidden md:flex  flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600  text-white relative">
                        <div className="flex flex-1 w-full h-full items-center justify-center">
                            <AnimatedTestimonialsDemo />
                        </div>
                    </div>
                )}

                {/* Colonne droite : formulaire de connexion */}
                <div className="flex flex-col justify-center items-center p-6 md:p-10 overflow-y-auto">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                                {t("landing.signin.title")}
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {t("landing.signin.subtitle")}
                            </p>
                        </div>

                        {/* Affichage des erreurs générales */}
                        {state?.message && !state?.field && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                {state.message}
                            </div>
                        )}

                        <form action={formAction} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("landing.signin.input_mail")}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                                {state?.field === 'email' && state?.message && (
                                    <p className="mt-1 text-sm text-red-600">{state.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("landing.signin.input_password")}
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {state?.field === 'password' && state?.message && (
                                    <p className="mt-1 text-sm text-red-600">{state.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        {t("landing.signin.forget_password")}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full flex cursor-pointer justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-5 w-5 text-white" />
                                            Connexion en cours...
                                        </>
                                    ) : t("landing.signin.sign_in")}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        {t("landing.signin.new")}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                {t("landing.signin.not_have_account")}{' '}
                                <Link
                                    href="/auth/sign-up"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    {t("landing.signin.not_have_account_signup")}
                                </Link>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-gray-500">
                            {t("landing.signin.info.title_1")}{' '}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                                {t("landing.signin.info.condi_utilisation")}
                            </Link>{' '}
                            {t("landing.signin.info.title_2")}{' '}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                                {t("landing.signin.info.politic_confidential")}
                            </Link>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn