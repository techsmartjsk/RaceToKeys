import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/sidebar/sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authentication/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network',
  description: 'Network by Overmind',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  if(!session){
    return <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar/>
      </body>
    </html>
  )
}
