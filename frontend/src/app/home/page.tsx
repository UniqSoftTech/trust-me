'use client'

import BottomNavigation from '../components/BottomNavigator'
import SwipeCards from '../components/SwipeCards'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function WorkTrust() {
  const { primaryWallet } = useDynamicContext()
  console.log('🚀 ~ WorkTrust ~ primaryWallet:', primaryWallet?.address)

  return (
    // <div className="bg-[#111111]">
    <div className="bg-[#111111] w-full h-full">
      <SwipeCards />
      <BottomNavigation />
    </div>
  )
}
