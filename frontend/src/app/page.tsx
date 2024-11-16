'use client'

import BottomNavigation from './components/BottomNavigator'
import SwipeCards from './components/SwipeCards'

export default function WorkTrust() {
  return (
    // <div className="bg-[#111111]">
    <div className="bg-[#111111] h-screen w-full">
      <SwipeCards />
      <BottomNavigation />
    </div>
  )
}
