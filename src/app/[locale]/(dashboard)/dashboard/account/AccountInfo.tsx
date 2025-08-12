"use client"

import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../../../components/ui/hover-card";
import { useRouter } from 'next/navigation';
import { logoutUser, getCurrentSession } from '@/actions/auth';
import { useEffect, useState } from 'react';
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name?: string;
}


const AccountInfo = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
   const firstLetter = user?.email?.charAt(0).toUpperCase() || 'U'
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getCurrentSession();
        if (session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } 
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 rounded-md  px-3 py-2 cursor-pointer transition-colors group">
          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-lg font-bold'>
            {firstLetter}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.name || user?.email.split('@')[0]}
            </span>
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-44 p-2 relative shadow-lg mt-3 border border-gray-200 rounded-lg" 
        sideOffset={1}
        align="center"
        side="bottom"
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200 z-10"></div>
        
        <div className="space-y-2 relative z-20 bg-white">
          <div className="space-y-1">
            <div className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50">
              <Link href={"/dashboard/profile"} className="flex items-center">
                  <FaRegUser className="h-4 w-4 mr-2" />
                  <span className="text-sm">Profile</span>
              </Link>
            </div>

            <div className="border-t border-gray-100 my-1"></div>

            <div 
              className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              <span className="text-sm">Sign out</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AccountInfo;