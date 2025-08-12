// app/auth/sign-up/page.tsx
import { getCurrentSession, registerUser } from '@/actions/auth';
import SignUp from '@/components/auth/SignUp';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string()
    .email("Veuillez entrer une adresse email valide")
    .min(5, "L'email doit contenir au moins 5 caractères"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial")
});

export default async function SignUpPage() {
  const session = await getCurrentSession();

  // Si déjà connecté → redirection
  if (session.user) {
    redirect('/');
  }

  // Action pour inscription
  const action = async (email: string, password: string) => {
    'use server';

    // Validation des données
    const validation = SignUpSchema.safeParse({ email, password });
    if (!validation.success) {
      const formattedErrors = validation.error.issues.map(issue => {
        const field = issue.path[0];
        return `• ${field === 'email' ? 'Email' : 'Mot de passe'}: ${issue.message}`;
      });
      return {
        message: formattedErrors.join('\n'),
        requiresOTP: false,
        email: ''
      };
    }

    try {
      const { error, requiresOTP } = await registerUser(email, password);

      if (error) {
        return {
          message: error,
          requiresOTP: false,
          email: ''
        };
      }

      // Retourne l'info au client pour basculer vers OTP si nécessaire
      return {
        message: requiresOTP ? '' : 'Inscription réussie',
        requiresOTP: requiresOTP || false,
        email: requiresOTP ? email : ''
      };
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      return {
        message: 'Une erreur inattendue est survenue',
        requiresOTP: false,
        email: ''
      };
    }
  };

  return <SignUp action={action} />;
}
