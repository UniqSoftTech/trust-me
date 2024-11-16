'use client'

import React, { useState } from 'react'
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const signer = ethers.Wallet.createRandom();
  const [message, setMessage] = useState<string>('')

  // Add sample messages
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hey there! How are you?',
      sender: 'Alice',
      timestamp: new Date('2024-03-20T10:00:00'),
    },
    {
      id: '2',
      content: "I'm doing great! How about you?",
      sender: 'Bob',
      timestamp: new Date('2024-03-20T10:01:00'),
    },
    {
      id: '3',
      content: 'Pretty good! Working on this chat app.',
      sender: 'Alice',
      timestamp: new Date('2024-03-20T10:02:00'),
    },
  ]);

  const sendMessage = async () => {
    console.log(message)
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    const toWalletAddress = ethers.Wallet.createRandom().address;
    const aliceMessagesBob = await userAlice.chat.send(toWalletAddress, {
      content: message,
      type: 'Text',
    });

    console.log(aliceMessagesBob)
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to the Push Chat</h1>
      
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        {/* Add chat history section */}
        <div className="mb-4 h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === 'Alice' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'Alice'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                <p className="text-base">{msg.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Existing textarea and button */}
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message here..."
        />
        <button 
          onClick={sendMessage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Send Message
        </button>
      </div>
    </div>
  )
}

export default ChatPage
