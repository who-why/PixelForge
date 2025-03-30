'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface User {
  image: string
  name: string
  email: string
}

const UserCard = () => {
  const { data: session } = useSession()
  const user = session?.user as User | any

  return (
    <div className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-5 gap-4 max-w-[400px] transition-transform transform hover:scale-105">
      <div className="relative w-[100px] h-[100px]">
        <Image
          src={user?.image || '/default-avatar.png'}
          alt="user"
          fill
          className="object-cover rounded-full border-4 border-white shadow-md"
        />
      </div>

      <div className="flex flex-col gap-2 text-white">
        <p className="text-lg font-bold">{user?.name || 'Anonymous User'}</p>
        <p className="text-sm text-gray-200">{user?.email || 'No email available'}</p>
        {/* <button className="mt-2 bg-white text-indigo-600 py-1 px-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-200 transition-colors">
          View Profile
        </button> */}
      </div>
    </div>
  )
}

export default UserCard
