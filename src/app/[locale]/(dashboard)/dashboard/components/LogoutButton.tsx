'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/actions/auth'

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <button onClick={handleLogout} className='flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full'>
      <LogOut className='w-5 h-5 mr-3 text-gray-500' />
      <span>Déconnexion</span>
    </button>
  )
}

export default LogoutButton
