'use client'

import { signOut } from 'next-auth/react'
import { AiOutlineLogout } from 'react-icons/ai'
import { toast } from 'react-toastify'

export const Header = () =>{
    return(
        <div className="px-20 py-10 shadow-lg flex justify-between">
            <div className="font-[500] uppercase text-2xl">
                Network
            </div>
            <div>
                <ul className="list-none flex gap-5 text-lg">
                    <li>Home</li>
                    <li>About</li>
                    <li>Leaderboard</li>
                    <li className='flex items-center gap-1 cursor-pointer' onClick={()=>{
                        signOut();
                        toast.success("Logged out successfully!")
                    }}>
                        <p>Logout</p>
                        <AiOutlineLogout size={'20px'}/>
                    </li>
                </ul>
            </div>
        </div>
    )
}