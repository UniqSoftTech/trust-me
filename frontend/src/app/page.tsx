'use client'

import { useState } from 'react'
import SwipeCards from './components/SwipeCards'

export default function WorkTrust() {
  const [loading] = useState(false)
  const [performanceScore] = useState(0)

  return (
    <div className="p-4 bg-white w-full h-screen">
      <SwipeCards />
    </div>
  )
}
