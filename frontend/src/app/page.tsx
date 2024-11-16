'use client'

import BottomNavigation from './components/BottomNavigator'
import SwipeCards from './components/SwipeCards'

export default function WorkTrust() {
  return (
    // <div className="bg-[#111111]">
    <div className="bg-[#111111] w-full h-full">
      <SwipeCards />
      <BottomNavigation />
    </div>
  )
}
