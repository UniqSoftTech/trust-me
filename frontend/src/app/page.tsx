"use client"

import { useState } from 'react'

export default function WorkTrust() {
  const [loading,] = useState(false)
  const [performanceScore,] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <nav className="flex justify-between items-center p-4 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Trust Me" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-800">Trust Me</h1>
        </div>
        
        
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