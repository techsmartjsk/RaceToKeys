"use client"

import { authOptions } from '@/authentication/auth';
import { ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import { getAptosBalance } from '@/lib/contract';
import { Session } from '@/lib/types'

export const Header = ({ session }: { session: Session }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const user = session?.user;
    const handleLogout = () => {
        signOut();
    };

    const handleDropdown = () =>{
        console.log("Hi!")
        setShowDropdown(!showDropdown);
    }

    return (
        <div className="px-20 py-10 shadow-lg flex items-center justify-between">
            <div className="font-[500] uppercase text-2xl">
                Network
            </div>
            <div>
                <div className="relative">
                    <div className="flex gap-5 items-center">
                        <div className='flex gap-5'>
                            <Wallet/>
                            {/* <p className="text-lg">{getAptosBalance(user?.address)} APT</p> */}
                        </div>
                        <div className='flex gap-2 w-[230px] p-2 items-center cursor-pointer border-black border-[0.5px] rounded-md'>
                            {user?.image && <Image src={user.image} width={40} height={40} className='rounded-full' alt={user?.name} />}
                            <p className='text-lg' onClick={handleDropdown}>{user?.name}</p>
                            {
                                !showDropdown ? <ChevronDown onClick={handleDropdown}/>:<ChevronUp onClick={handleDropdown}/>
                            }
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="absolute w-[230px] top-full p-5 right-0 bg-white rounded-b-md border-l-[0.5px] border-r-[0.5px] border-b-[0.5px] border-black">
                            <ul className='flex-col gap-5'>
                                <li className="py-3 px-2">{user?.username}</li>
                                <hr></hr>
                                <li className='py-3 px-2'>{user?.address.slice(0,4)}...{user?.address.slice(-4)}</li>
                                <hr></hr>
                                <li onClick={handleLogout} className="cursor-pointer text-black py-3 px-2">Sign Out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
