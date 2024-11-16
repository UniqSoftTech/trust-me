'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '../context'

const defaultUrl = 'https://seal-app-6gio7.ondigitalocean.app/public/images/'

const LikesPage: React.FC = () => {
  const { userInfo } = useWallet() // Context state for wallet address

  const [likedACcounts, setLikedAccounts] = useState([])
  const [totalAccounts, setTotalAccounts] = useState([])

  useEffect(() => {
    const getMyLikes = () => {
      // Fetch likes from the backend
      fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-like/${userInfo?.account}`)
        //   fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-like/0x123457`)
        .then((response) => response.json())
        .then((data) => {
          setLikedAccounts(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })

      fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer/` + (userInfo?.isEmployee ? 'false' : 'true'))
        .then((response) => response.json())
        .then((data) => {
          setTotalAccounts(data)
          //   setLikedAccounts(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }

    if (userInfo?.account) {
      getMyLikes()
    }
  }, [userInfo])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const likedAccounts = totalAccounts.filter((account: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return likedACcounts.some((likedAccount: any) => likedAccount.account_one === account.account)
  })
  console.log('🚀 ~ likedAccounts ~ likedAccounts:', likedAccounts)

  return (
    <div className="">
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        likedAccounts?.map((account: any) => {
          return <AccountsCard key={account.account} {...account} />
        })
      }
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AccountsCard = (account: any) => {
  return (
    <div key={account.account} className="flex border-b p-4 gap-4 border-[#1e1e1e] items-center justify-around">
      <img src={defaultUrl + account.image} alt="profile" className="w-20 h-20 rounded-lg" />
      <div className="flex flex-col items-start">
        <span className="text-white">{account.firstname + ' ' + account.lastname}</span>
        <span className="text-white text-xs line-clamp-2">{account.description}</span>
        <span className="text-white mt-2 text-xs rounded-xl bg-red-500 p-1 text-end">Offer: {account.hourPrice}</span>
      </div>
      {/* <span className="text-white">{account.email}</span> */}
    </div>
  )
}

export default LikesPage
