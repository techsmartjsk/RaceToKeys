import type { Metadata } from 'next'
import './globals.css'
import { getServerAuthSession } from '@/authentication/auth'
import { Poppins } from 'next/font/google'
import { Homepage } from '@/components/home/homepage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Protected } from "@/components/common/protected";

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
  const session = await getServerAuthSession();
  if(!session){
    return <html lang="en">
      <body className={poppins.className}>
        <Protected>
          {children}
        </Protected>
        <ToastContainer />
      </body>
    </html>
  }

  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
