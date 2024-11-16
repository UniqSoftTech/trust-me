'use client'

import { useEffect, useState } from 'react'
import SwipeCards from '../components/SwipeCards'
import { useWallet } from '../context'

export default function WorkTrust() {
  const [isLoading, setIsLoading] = useState(false)
  const { walletAddress, setWalletAddress, userInfo, handleUserInfo } = useWallet()
  const [cards, setCards] = useState([])
  const [reputationScore, setReputationScore] = useState(54)
  
  const priceTiers = [
    { price: '10000 Sats', requiredScore: 50 },
    { price: '50000 Sats', requiredScore: 70 },
    { price: '100000 Sats', requiredScore: 90 },
  ]

  // Find next unlockable price tier
  const getNextPriceTier = () => {
    return priceTiers.find(tier => tier.requiredScore > reputationScore) || priceTiers[priceTiers.length - 1]
  }

  useEffect(() => {
    const sendWalletToApi = async () => {
      console.log('sending wallet to api')
      try {
        setIsLoading(true)

        const response = await fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer/` + (userInfo?.isEmployee ? 'false' : 'true'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        setCards(data)
      } catch (error) {
        console.error('Error sending wallet address to API:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userInfo?.account) {
      console.log('sending requets')
      sendWalletToApi()
    }
  }, [userInfo])

  return (
      <div className="bg-[#111111] w-full h-full">
      <p className="text-lg">Reputation Score: {reputationScore}</p>
        {getNextPriceTier() && (
          <p className="text-sm text-gray-400">
            Unlock {getNextPriceTier().price} tier at {getNextPriceTier().requiredScore} points 
            ({getNextPriceTier().requiredScore - reputationScore} points remaining)
          </p>
        )}
        {isLoading ? <div>Loading...</div> : <SwipeCards cards={cards} />}
      </div>
  )
}
