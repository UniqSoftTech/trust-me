'use client' // Required for client-side components

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdHome, MdPerson } from 'react-icons/md' // Import home, search, and profile icons
import { AiFillLike } from 'react-icons/ai'

const BottomNavigation = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/home', icon: <MdHome /> }, // Home icon
    { name: 'Likes', href: '/likes', icon: <AiFillLike /> }, // Search icon
    { name: 'Profile', href: '/profile', icon: <MdPerson /> }, // Profile icon
  ]

  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-[#1e1e1e] bg-black">
      <nav className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link href={item.href} key={item.name}>
              <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`text-xl ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  {item.icon}
                </motion.div>
                <span className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNavigation
