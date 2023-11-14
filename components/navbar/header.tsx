"use client"

import { Check, ChevronDown, ChevronUp, ClipboardCopy, Wallet } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Session } from '@/lib/types'
import { getAptosBalance } from '@/lib/contract';
import { toast } from 'react-toastify';


export const Header = ({ session }: { session: Session }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const user = session?.user;
    const [balance, setBalance] = useState(0);

    const handleLogout = () => {
        signOut();
        toast.success('Logged Out Successfully',{
            position: toast.POSITION.BOTTOM_RIGHT
        })
    };

    const handleDropdown = () =>{
        setShowDropdown(!showDropdown);
    }

    useEffect(() => {
        const fetchBalance = async () => {
            if (user?.address) {
                const userBalance = await getAptosBalance(user.address);
                setBalance(userBalance);
            }
        };

        fetchBalance();
    }, [user]);

    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
          await navigator.clipboard.writeText(text);
          setCopySuccess(!copySuccess);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      };

    return (
        <div className="px-20 py-10 shadow-lg flex items-center justify-between">
            <div className="font-[500] uppercase text-2xl">
                Network
            </div>
            <div className="relative">
                <div className="flex gap-5 items-center">
                    <div className='flex gap-5'>
                        <Wallet/>
                        <p className="text-lg">{balance.toFixed(2)} APT</p>
                    </div>
                    <div onClick={handleDropdown} className='flex gap-2 w-[230px] p-2 items-center cursor-pointer border-black border-[0.5px] rounded-md'>
                        {user?.image && <Image onClick={handleDropdown} src={user.image} width={40} height={40} className='rounded-full' alt={user?.name} />}
                        <p className='text-lg cursor-pointer' onClick={handleDropdown}>{user?.name}</p>
                        {
                            !showDropdown ? <ChevronDown onClick={handleDropdown}/>:<ChevronUp onClick={handleDropdown}/>
                        }
                    </div>
                </div>
                {showDropdown && (
                    <div className="absolute w-[230px] top-full p-4 right-0 bg-white rounded-b-md border-l-[0.5px] border-r-[0.5px] border-b-[0.5px] border-black">
                        <ul className='flex-col gap-5'>
                            <li className="py-3">{user?.username}</li>
                            <hr></hr>
                            <li className='py-3 flex gap-1'>
                                <p>{user?.address.slice(0,4)}...{user?.address.slice(-4)}</p>
                                <div onClick={()=>{
                                    copyToClipboard(user?.address);
                                }} className="text-sm cursor-pointer border-[1px] flex gap-1 items-center w-[80px] rounded-md p-1 ml-auto">
                                    { !copySuccess ? <ClipboardCopy size={'18px'}/> : <Check size={'18px'}/>} 
                                    <p>Copy</p>
                                </div>
                            </li>
                            <hr></hr>
                            <li onClick={handleLogout} className="cursor-pointer text-black py-3">Sign Out</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
