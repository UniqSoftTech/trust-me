"use client"

import { useState } from 'react'
import { Web3Auth } from "@web3auth/modal"
import { BiconomySmartAccount } from "@biconomy/account"
import { PushAPI } from "@pushprotocol/restapi"
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function WorkTrust() {
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState<BiconomySmartAccount | null>(null)
  const [notifications, setNotifications] = useState([])
  const [performanceScore, setPerformanceScore] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <nav className="flex justify-between items-center p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="WorkTrust" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-800">Trust Me</h1>
        </div>
        
        {!account ? (
          <button 
            onClick={() => {/* Web3Auth login */}}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {account.address.slice(0,6)}...{account.address.slice(-4)}
            </span>
            <button 
              onClick={() => {/* Logout */}}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Disconnect
            </button>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Performance Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Performance Score</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{performanceScore}%</span>
                  </div>
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${performanceScore * 3.51} 351`}
                      className="text-blue-500"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Upcoming Shifts */}
            <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Upcoming Shifts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Store</th>
                      <th className="text-left p-4">Hours</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">2024-11-16</td>
                      <td className="p-4">Store #123</td>
                      <td className="p-4">9:00 AM - 5:00 PM</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          Confirmed
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-blue-500 hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}