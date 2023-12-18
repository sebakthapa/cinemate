import ReduxProvider from '@/components/ReduxProvider'
import './globals.css'
import { Inter } from 'next/font/google'
import { websiteName } from '@/lib'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: `${websiteName} - Watch anything anywhere`,
  description: `${websiteName} - A place where you may relax`,
  icon: "/logo.jpg"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>

      </body>
    </html>
  )
}
