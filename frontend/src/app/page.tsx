'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsLoggedIn, useDynamicContext, DynamicWidget, useUserWallets } from '@dynamic-labs/sdk-react-core'
import { useWallet } from './context'

const App = () => {
  const router = useRouter()
  const isLoggedIn = useIsLoggedIn()
  const userWallets = useUserWallets()

  const { walletAddress, setWalletAddress, userInfo, handleUserInfo } = useWallet() // Context state for wallet address
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendWalletToApi = async (wallet: any) => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-wallet/` + wallet, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        console.log('🚀 ~ sendWalletToApi ~ data:', data)
        handleUserInfo(data)

        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`)
        }

        console.log('Wallet address successfully sent to API:', wallet)
      } catch (error) {
        console.error('Error sending wallet address to API:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoggedIn && userWallets?.[0]?.address !== undefined) {
      // Save the wallet address to context state
      setWalletAddress(userWallets[0].address)

      // Send wallet address to the API
      sendWalletToApi(userWallets[0].address)

      // Redirect after successful login
      router.push('/home')
    }
  }, [isLoggedIn, userWallets, router, setWalletAddress])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <DynamicWidget />
}

export default App
