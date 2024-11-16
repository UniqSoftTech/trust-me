'use client'

import BottomNavigation from './components/BottomNavigator'
import SwipeCards from './components/SwipeCards'

export default function WorkTrust() {
  return (
    <div className="p-6 w-full h-screen flex flex-col bg-[#111111]">
      <SwipeCards />
      <BottomNavigation />
    </div>
  )
}
