import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/sidebar/sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authentication/auth'
import { Suspense } from 'react'
import Loading from './loading'
import { Poppins } from 'next/font/google'
import { Homepage } from '@/components/home/homepage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'Network',
  description: 'Network by Overmind',
}

const poppins = Poppins({
  weight:['300','400','700'],
  subsets:['latin-ext']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  if(!session){
    return <html lang="en">
      <body className={poppins.className}>
        <Suspense fallback={<Loading/>}>
          {children}
        </Suspense>
        <ToastContainer />
      </body>
    </html>
  }

  return (
    <html lang="en">
      <body className={poppins.className}>
        <Suspense fallback={<Loading/>}>
          <Homepage/>
        </Suspense>
        <ToastContainer />
      </body>
    </html>
  )
}
