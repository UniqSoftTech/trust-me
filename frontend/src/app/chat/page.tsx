'use client'

import React, { useState } from 'react'
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

const ChatPage: React.FC = () => {
  const signer = ethers.Wallet.createRandom();
  const [message, setMessage] = useState<string>('')

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Welcome to the Chat Page</h1>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatPage
