'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { MdCancel, MdCheckCircle } from 'react-icons/md' // Import the cancel and check-circle icons
import { useWallet } from '../context'

const defaultUrl = 'https://seal-app-6gio7.ondigitalocean.app/public/images/'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SwipeCards = (props: any) => {
  const [cards, setCards] = useState(props.cards)
  const { walletAddress, setWalletAddress, userInfo, handleUserInfo } = useWallet() // Context state for wallet address

  useEffect(() => {
    setCards(props.cards)
  }, [props])

  return (
    <div className="grid w-full h-full place-items-start p-4">
      {cards.length === 0 && (
        <div className="flex flex-col w-full h-5/6 items-center justify-center rounded-lg ">
          <span className="text-white">Your swipe has finished for today xD</span>
        </div>
      )}
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cards?.map((card: any) => {
          return <Card key={card.id} setCards={setCards} image={card.image} {...card} mywallet={userInfo?.account || ''} />
        })
      }
    </div>
  )
}

interface CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any
  image: string
  setCards: React.Dispatch<React.SetStateAction<{ id: number; image: string }[]>>
  firstname: string
  lastname: string
  description: string
  hourPrice: string
  account: string
  mywallet: string
  email: string
}

const Card = ({ id, image, setCards, lastname, firstname, description, hourPrice, account, mywallet }: CardProps) => {
  const x = useMotionValue(0)

  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
  const [isDragging, setIsDragging] = useState(false) // State to track dragging

  const handleDragEnd = () => {
    setIsDragging(false) // Reset dragging state
    if (Math.abs(x.get()) > 100) {
      if (dragDirection === 'right') {
        console.log(
          '🚀 ~ Card ~ walletAddress:',
          mywallet,
          JSON.stringify({
            account: mywallet,
            liked_account: account,
          }),
        )

        fetch(`https://seal-app-6gio7.ondigitalocean.app/api/customer/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: mywallet,
            liked_account: account,
          }),
        })
      }
      setCards((pv) => pv.filter((v) => v.id !== id))
      // else if (dragDirection === 'right' && isFlipped) setCards((pv) => pv.filter((v) => v.id !== id))
      // else
    }
  }

  const handleDragStart = () => {
    setIsDragging(true) // Set dragging state
  }

  const dragDirection = x.get() > 0 ? 'right' : 'left' // Determine direction

  return (
    <motion.div
      className={`relative h-5/6 w-full origin-bottom rounded-lg bg-black object-cover hover:cursor-grab active:cursor-grabbing`}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        transition: '0.125s transform',
      }}
      animate={{
        scale: 1,
      }}
      drag={'x'}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDoubleClick={() => console.log('double click')}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart} // Trigger on drag start
    >
      <>
        {isDragging && (
          <div className={`absolute top-5 ${dragDirection === 'left' ? 'right-5' : 'left-5'}`}>
            {dragDirection === 'left' ? <MdCancel className="text-red-500 text-3xl" /> : <MdCheckCircle className="text-green-500 text-3xl" />}
          </div>
        )}

        {/* Image with gradient overlay */}
        <motion.div
          className="relative w-full h-full"
          style={{
            backgroundImage: `url(${defaultUrl + image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity,
            position: 'relative',
            borderRadius: '0.5rem',
          }}
        >
          {/* Dark gradient overlay at the bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black to-transparent"
            style={{
              borderRadius: '0.5rem', // Ensuring the gradient blends with the corners
            }}
          ></div>

          <div className="absolute bottom-5 flex p-4 items-center justify-between w-full">
            <div className="flex flex-col w-2/3">
              <h1 className="text-white ">{firstname + ' ' + lastname}</h1>
              <span className="text-white text-sm">{description}</span>
            </div>

            <span className="rounded-full bg-red-400 p-2 text-center text-white text-sm">{hourPrice} per hour</span>
          </div>
        </motion.div>
      </>

      {/* Conditionally render the cancel and check-circle icons while dragging */}
    </motion.div>
  )
}

export default SwipeCards

// const cardData = [
//   {
//     id: 1,
//     url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 2,
//     url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 3,
//     url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 4,
//     url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 5,
//     url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 6,
//     url: 'https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 7,
//     url: 'https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
//   {
//     id: 8,
//     url: 'https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   },
// ]
