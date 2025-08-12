"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword, verifyPasswordResetToken } from "@/actions/auth";

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [valid, setValid] = useState<boolean | null>(null);

    React.useEffect(() => {
        if (token) {
            verifyPasswordResetToken(token).then(res => {
                setValid(res.valid);
                if (!res.valid) setError("Lien de réinitialisation invalide ou expiré.");
            });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        setLoading(true);
        const res = await resetPassword(token, newPassword);
        setLoading(false);
        if (res.success) {
            setSuccess("Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.");
            setTimeout(() => {
                router.push("/auth/sign-in");
            }, 1800);
        } else {
            setError(res.error || "Erreur lors de la réinitialisation.");
        }
    };

    if (valid === false) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Lien invalide ou expiré</h2>
                    <button
                        className="mt-4 px-4 py-2 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600"
                        onClick={() => router.push("/auth/forgot-password")}
                    >
                        Demander un nouveau lien
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-blue-500 mb-4 text-center">Réinitialiser le mot de passe</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            placeholder="Nouveau mot de passe"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-600 text-center">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {loading ? "Réinitialisation..." : "Réinitialiser"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
