'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsLoggedIn, useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { useWallet } from './context'

const App = () => {
  const router = useRouter()
  const isLoggedIn = useIsLoggedIn()
  const { primaryWallet } = useDynamicContext() // Assuming this hook provides the wallet address
  const { walletAddress, setWalletAddress, userInfo, setUserInfo } = useWallet() // Context state for wallet address
  const [isLoading, setIsLoading] = useState(false)

  console.log(walletAddress, userInfo)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendWalletToApi = async (wallet: any) => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-wallet/0x123456`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        setUserInfo(data)

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

    if (isLoggedIn && primaryWallet) {
      // Save the wallet address to context state
      setWalletAddress(primaryWallet)

      // Send wallet address to the API
      sendWalletToApi(primaryWallet)

      // Redirect after successful login
      router.push('/home')
    }
  }, [isLoggedIn, primaryWallet, router, setWalletAddress])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <DynamicWidget />
}

export default App
