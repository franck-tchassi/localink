import React from 'react'

import { redirect } from 'next/navigation'
import { CreditCard, Key, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'
import { ChangePasswordForm } from '../components/change-password-form'
import { getCurrentSession } from '@/actions/auth'
import LogoutButton from '../components/LogoutButton'

// Fonction qui gère premium/pro en majuscules ou minuscules
const getSubscriptionColor = (level?: string | null) => {
  switch (level?.toUpperCase()) {
    case 'PREMIUM':
      return 'bg-gradient-to-br from-purple-600 to-pink-500 shadow-purple-200'
    case 'PRO':
      return 'bg-gradient-to-br from-blue-600 to-indigo-500 shadow-blue-200'
    default:
      return 'bg-gradient-to-br from-gray-600 to-gray-500 shadow-gray-200'
  }
}

const ProfilePage = async () => {
  const session = await getCurrentSession()

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user
  const firstLetter = user.email?.charAt(0).toUpperCase() || 'U'
  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Colonne profil */}
        <div className='w-full lg:w-72 space-y-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <div
                className={`flex items-center justify-center w-24 h-24 rounded-full ${getSubscriptionColor(
                  user.subscriptionLevel
                )} text-white text-4xl font-bold shadow-lg`}
              >
                {firstLetter}
              </div>
            </div>

            <h2 className='text-lg font-semibold text-gray-900 mb-2 truncate px-2'>
              {user.email}
            </h2>

            {user.subscriptionLevel && (
              <span
                className={`inline-block px-4 py-1.5 text-sm rounded-full font-medium text-white ${getSubscriptionColor(
                  user.subscriptionLevel
                )} shadow-sm mb-4`}
              >
                {user.subscriptionLevel.toUpperCase()}
              </span>
            )}

            <div className='flex items-center justify-center text-sm text-gray-500'>
              <Calendar className='w-4 h-4 mr-2 text-gray-400' />
              <span>Membre depuis {memberSince}</span>
            </div>
          </div>

          <nav className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <ul className='space-y-1 p-2'>
              <li>
                <Link
                  href='/dashboard/account/subscription'
                  className='flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  <CreditCard className='w-5 h-5 mr-3 text-gray-500' />
                  <span>Abonnement</span>
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </nav>
        </div>

        {/* Colonne contenu */}
        <div className='flex-1 space-y-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='border-b border-gray-100 px-6 py-5 bg-gray-50'>
              <div className='flex items-center'>
                <div className='p-2 bg-blue-100 rounded-lg mr-4'>
                  <Shield className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <h1 className='text-xl font-bold text-gray-900'>
                    Sécurité du compte
                  </h1>
                  <p className='text-sm text-gray-500'>
                    Gérez les paramètres de sécurité de votre compte
                  </p>
                </div>
              </div>
            </div>

            <div className='p-6'>
              <div className='max-w-2xl mx-auto space-y-8'>
                <div>
                  <h2 className='text-lg font-semibold mb-4 flex items-center'>
                    <Key className='w-5 h-5 mr-2 text-blue-500' />
                    Changement de mot de passe
                  </h2>
                  <ChangePasswordForm userId={user.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
