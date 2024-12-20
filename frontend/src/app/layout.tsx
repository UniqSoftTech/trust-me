import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import BottomNavigation from './components/BottomNavigator'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { BsChatDotsFill } from 'react-icons/bs'
import Link from 'next/link'
import { WalletProvider } from '../app/context/index' // Adjust the path as needed

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Trust Me',
  description: 'Social reputation protocol',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}>
        <DynamicContextProvider
          settings={{
            environmentId: '5253ce76-9022-448e-8374-04808d70f0aa',
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <WalletProvider>
            <div className="w-full bg-black p-4 flex items-center justify-between fixed top-0 z-10">
              <h1 className="text-white text-lg">Trust Me</h1>
              <Link href="/chat">
                <BsChatDotsFill />
              </Link>
            </div>
            <main className="flex-grow flex flex-col mt-16">{children}</main>
            {/* Only show BottomNavigation if it's not the home page */}
            {<BottomNavigation />}
          </WalletProvider>
        </DynamicContextProvider>
      </body>
    </html>
  )
}
