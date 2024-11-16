'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '../context'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'

import { motion } from 'framer-motion'

const defaultUrl = 'https://seal-app-6gio7.ondigitalocean.app/public/images/'

const LikesPage: React.FC = () => {
  const { walletAddress, setWalletAddress, userInfo, handleUserInfo } = useWallet() // Context state for wallet address

  const [likedACcounts, setLikedAccounts] = useState([])
  const [totalAccounts, setTotalAccounts] = useState([])
  const [reload, setReload] = useState(false)
  const [approvedWorks, setApprovedWorks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedWork, setSelectedWork] = useState<any>(null) // For modal
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null) // Tracks which account is expanded

  useEffect(() => {
    const getMyLikes = () => {
      setIsLoading(true)

      // Fetch likes from the backend
      fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-like/${userInfo?.account}`)
        .then((response) => response.json())
        .then((data) => {
          setLikedAccounts(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })

      if (userInfo?.isEmployee) {
        fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer-status/${userInfo?.account}`)
          .then((response) => response.json())
          .then((data) => {
            setApprovedWorks(data)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }

      fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer/` + (userInfo?.isEmployee ? 'false' : 'true'))
        .then((response) => response.json())
        .then((data) => {
          setTotalAccounts(data)
          setIsLoading(false)
          setLikedAccounts(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }

    if (userInfo?.account) {
      getMyLikes()
    }
  }, [userInfo, reload])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const likedAccounts = totalAccounts.filter((account: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return likedACcounts.some((likedAccount: any) => likedAccount.account_one === account.account)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const approvedWork = totalAccounts.filter((account: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return approvedWorks.some((likedAccount: any) => likedAccount.employer_address === account.account)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (work: any) => {
    setSelectedWork(work)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedWork(null)
    setIsModalOpen(false)
  }

  return (
    <div className="p-4">
      {isLoading && <div>Loading...</div>}

      {likedAccounts.length > 0 && (
        <>
          <h1>Likes</h1>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            likedAccounts?.map((account: any) => (
              <>
                <AccountsCard key={account.account} {...account} onClick={() => openModal(account)} />
              </>
            ))
          }
        </>
      )}

      {approvedWork.length > 0 && <h1>Approved</h1>}
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        approvedWork?.map((account: any) => (
          <AccountsCard key={account.account} {...account} onClick={console.log()} />
        ))
      }

      {isModalOpen && selectedWork && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{selectedWork.firstname + ' ' + selectedWork.lastname}</h2>
            <img src={defaultUrl + selectedWork.image} alt="profile" className="w-32 h-32 rounded-lg mb-4" />
            <p>{selectedWork.description}</p>
            <p className="mt-2">
              <strong>Offer:</strong> {selectedWork.hourPrice}
            </p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex flex-row items-center gap-2"
              onClick={() => {
                // Handle approve work logic here
                setIsLoading(true)

                fetch(`https://seal-app-6gio7.ondigitalocean.app/api/approve-request/${userInfo?.account}/${selectedWork.account}`, {
                  method: 'POST',
                })
                  .then((response) => response.json())
                  .then((data) => {
                    closeModal()
                    setReload(!reload)
                  })
                  .catch((error) => {
                    console.error('Error:', error)
                  })
              }}
            >
              {isLoading && (
                <div className="flex justify-center items-center">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                </div>
              )}
              Approve Work
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AccountsCard = (account: any) => {
  const { onClick } = account
  return (
    <div key={account.account} className="flex border-b p-4 gap-4 border-[#1e1e1e] justify-around cursor-pointer" onClick={onClick}>
      <img src={defaultUrl + account.image} alt="profile" className="w-20 h-20 rounded-lg" />
      <div className="flex flex-col items-start">
        <span className="text-white">{account.firstname + ' ' + account.lastname}</span>
        <span className="text-white text-xs line-clamp-2">{account.description}</span>
        <span className="text-white mt-2 text-xs rounded-xl bg-red-500 p-1 text-end">Offer: {account.hourPrice}</span>
      </div>
    </div>
  )
}

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-md shadow-lg w-[90%] max-w-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-lg font-bold hover:text-gray-300">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default LikesPage
