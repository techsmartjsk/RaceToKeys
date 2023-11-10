"use client"

import { authOptions } from '@/authentication/auth';
import { ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import { getAptosBalance } from '@/lib/contract';
export type { Session } from 'next-auth';

export const Header = ({ session }) => {
    const [showDropdown, setShowDropdown] = useState(true);
    const user = session?.user;
    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="px-20 py-10 shadow-lg flex justify-between">
            <div className="font-[500] uppercase text-2xl">
                Network
            </div>
            <div>
                <div className="relative">
                    <div className="flex gap-5 items-center" onClick={() => setShowDropdown(!showDropdown)}>
                        <div className='flex gap-5'>
                            <Wallet/>
                            <p className="text-lg">{getAptosBalance(user?.address)} APT</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            {user?.image && <Image src={user.image} width={40} height={40} className='rounded-full' alt={user?.name} />}
                            <p className='text-lg'>{user?.name}</p>
                            {
                                !showDropdown ? <ChevronDown/>:<ChevronUp/>
                            }
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="absolute top-full p-5 right-0 mt-2 bg-white shadow-md rounded-md">
                            <ul>
                                <li>{user?.username}</li>
                                <li onClick={handleLogout} className="cursor-pointer text-black text-blue-500">Sign Out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
