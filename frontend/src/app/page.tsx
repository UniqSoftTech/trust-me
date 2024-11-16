'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // This is for Next.js 13+
import { useIsLoggedIn, DynamicWidget } from '@dynamic-labs/sdk-react-core'

const App = () => {
  const router = useRouter()
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    // Check if the user is authenticated
    if (isLoggedIn) {
      // Redirect to another page after successful login
      router.push('/home') // Replace '/dashboard' with the route you want
    }
  }, [isLoggedIn, router])

  return <DynamicWidget />
}

export default App
