'use client'

import { useEffect, useState } from 'react'
import SwipeCards from '../components/SwipeCards'
import { useWallet } from '../context'

export default function WorkTrust() {
  const [isLoading, setIsLoading] = useState(false)
  const { walletAddress, setWalletAddress, userInfo, handleUserInfo } = useWallet() // Context state for wallet address
  const [cards, setCards] = useState([])

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
    // <div className="bg-[#111111]">
    <div className="bg-[#111111] w-full h-full">{isLoading ? <div>Loading...</div> : <SwipeCards cards={cards} />}</div>
  )
}
