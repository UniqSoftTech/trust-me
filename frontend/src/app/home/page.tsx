'use client'

import { useEffect, useState } from 'react'
import SwipeCards from '../components/SwipeCards'
import { useWallet } from '../context'

export default function WorkTrust() {
  const [isLoading, setIsLoading] = useState(false)
  const { walletAddress, setWalletAddress, userInfo, setUserInfo } = useWallet() // Context state for wallet address
  const [cards, setCards] = useState([])

  console.log('🚀 ~ WorkTrust ~ isLoading:', isLoading, walletAddress, setWalletAddress, setUserInfo)
  useEffect(() => {
    const sendWalletToApi = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer/` + !userInfo?.isEmployee, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        console.log(data, 'asdfasdfafd')
        setCards(data)
      } catch (error) {
        console.error('Error sending wallet address to API:', error)
      } finally {
        setIsLoading(false)
      }
    }

    sendWalletToApi()
  })

  console.log(cards, 'cards')

  return (
    // <div className="bg-[#111111]">
    <div className="bg-[#111111] w-full h-full">
      <SwipeCards cards={cards} />
    </div>
  )
}
