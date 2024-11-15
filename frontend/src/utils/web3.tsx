import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES } from "@web3auth/base"
import { BiconomySmartAccount, BiconomySmartAccountConfig } from "@biconomy/account"
import { ethers } from "ethers"
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi"

export const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "",
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Ethereum mainnet
    rpcTarget: process.env.NEXT_PUBLIC_RPC_URL
  }
})

export const initializeBiconomyAccount = async (provider: any) => {
  const config: BiconomySmartAccountConfig = {
    chainId: 1, // Ethereum mainnet
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
    paymaster: {
      address: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS || ""
    }
  }

  const smartAccount = new BiconomySmartAccount(provider, config)
  await smartAccount.init()
  return smartAccount
}

export const initializePushNotifications = async (signer: ethers.Signer) => {
  const pushAPI = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING
  })
  return pushAPI
}

export const WORKTRUST_CONTRACT_ADDRESS = "0x..."
export const WORKTRUST_ABI = [
  // Contract ABI here
]

export const getWorkTrustContract = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(
    WORKTRUST_CONTRACT_ADDRESS,
    WORKTRUST_ABI,
    provider
  )
}