'use client'

import { useState } from 'react'
import BottomNavigation from './components/BottomNavigator'
import SwipeCards from './components/SwipeCards'

export default function WorkTrust() {
  const [loading] = useState(false)
  const [performanceScore] = useState(0)

  return (
    <div className="p-6 w-full h-screen flex flex-col bg-[#111111]">
      <SwipeCards />
      <BottomNavigation />
    </div>
  )
}
