'use client'

// WalletContext.js
import { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const WalletContext = createContext()

// Create a provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  // Function to save user info in localStorage
  const saveUserInfoToLocalStorage = (info) => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } catch (error) {
      console.error('Error saving user info to localStorage:', error)
    }
  }

  // Function to retrieve user info from localStorage
  const loadUserInfoFromLocalStorage = () => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo')
      return storedUserInfo ? JSON.parse(storedUserInfo) : null
    } catch (error) {
      console.error('Error reading user info from localStorage:', error)
      return null
    }
  }

  // Fetch and handle user info
  const handleUserInfo = async (info) => {
    setUserInfo(info)
    saveUserInfoToLocalStorage(info)
  }

  // Load user info from localStorage on initial render
  useEffect(() => {
    const storedUserInfo = loadUserInfoFromLocalStorage()
    if (storedUserInfo) {
      setUserInfo(storedUserInfo)
    }
  }, [])
  return <WalletContext.Provider value={{ walletAddress, setWalletAddress, userInfo, handleUserInfo }}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext)
