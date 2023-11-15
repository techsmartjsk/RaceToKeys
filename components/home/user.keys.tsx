"use client"

import Image from "next/image"
import { useState, useEffect } from "react";
import { getKeyBalance, getKeySupply, getOwnedCollections, getSellPrice, getSellPriceAfterFees, sellKeys } from "@/lib/contract";
import { Collection, Session } from "@/lib/types";
import { toast } from "react-toastify";
import Modal from "../common/modal";

export default function UserKeys({ session }:{
    session: Session
}){
    const [ownedKeys, setOwnedKeys] = useState<Collection[]>([]);
    const [sellModalOpen, setSellModalOpen] = useState(false)
    

    useEffect(() => {
        const fetchData = async () => {
            try{
                const owned = await getOwnedCollections({
                    username: session.user?.username,
                    name: session.user?.name,
                    publicKey: session.user?.address,
                    privateKey: session.user?.privateKey,
                    image: session.user?.image,
                    address: session.user?.address
                });
                setOwnedKeys(owned)
            }catch(error){
                console.log(error)
            }
        };
        fetchData();
    }, [session]);

    const handleSellKeys = async (address:string, amount:number):Promise<void> =>{
        await sellKeys(session.user, address, amount)
        console.log(amount)
        setSellModalOpen(!sellModalOpen)
        toast.success('Selling of keys has been initiated',{
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }


    const handleSellPrice = async (keySubjectAddress: string, amount: number): Promise<number> =>{
        try{
            const sellPriceOfKey = await getSellPrice(keySubjectAddress, amount)
            return sellPriceOfKey
        }catch(error){
            console.log(error)
            return 0;
        }
    }

    const handleSellPriceAfterFees = async (keySubjectAddress: string, amount: number): Promise<number> =>{
        try{
            const sellPriceAfterFees = await getSellPriceAfterFees(keySubjectAddress, amount)
            return sellPriceAfterFees
        }catch(error){
            console.log(error)
            return 0;
        }
    }

    return(
        <div>
            <h1 className="text-xl mt-10">Your Keys</h1>
            {
                ownedKeys.length <= 0 ? <div className="flex justify-center w-full">
                <Image 
                src="/assets/svgs/not_found.svg" 
                width={400} 
                height={400} 
                alt="Keys not found"/>
                    </div>:<div className="rounded-md w-full shadow-md p-5 mt-5">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[10%] text-center">Serial Number</p>
                    <p className="w-[30%] text-center">Address</p>
                    <p className="w-[10%] text-center">Keys</p>
                    <p className="w-[10%] text-center">Key Balance</p>
                    <p className="w-[10%] text-center">Key Supply</p>
                    <p className="w-[10%] text-center">Sell</p>
                </div>
                {
                    ownedKeys.map((key,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{index+1}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <p className="w-[10%] text-center">{key.keys}
                                {
                                    key.keys > 1 ? ' Keys':' Key'
                                }
                            </p>
                            <p className="w-[10%] text-center">{getKeyBalance(session.user.address, key.address)}</p>
                            <p className="w-[10%] text-center">{getKeySupply(key.address)}</p>
                            <div className="w-[10%] text-center">
                                {
                                    key.keys > 0 ? 
                                    <div>
                                        <button onClick={()=>{
                                                setSellModalOpen(!sellModalOpen)
                                            }
                                        } className="rounded-full p-1 bg-red-500 text-white">Sell Keys</button>
                                        {
                                            sellModalOpen ? <Modal title="Sell Keys" isOpen={sellModalOpen} onClose={()=>{
                                                setSellModalOpen(!sellModalOpen)
                                            }}>
                                                <div className="w-full flex flex-col justify-center">
                                                    <div className="flex">
                                                        <h2 className="text-lg w-1/2 text-left">Key Address : </h2>
                                                        <h1 className="w-1/2">{key.address.slice(0,4)}...{key.address.slice(-4)}</h1>
                                                    </div>
                                                    <div className="flex">
                                                        <h2 className="text-lg w-1/2 text-left">Sell Price of Keys : </h2>
                                                        <h1 className="w-1/2">{handleSellPrice(key.address,key.keys)}</h1>
                                                    </div>
                                                    <div className="flex">
                                                        <h2 className="text-lg w-1/2 text-left">Sell Price of Keys (After Fees) : </h2>
                                                        <h1 className="w-1/2">{handleSellPriceAfterFees(key.address, key.keys)}</h1>
                                                    </div>
                                                    <div>
                                                        <button onClick={()=>{
                                                            handleSellKeys(key.address, key.keys)
                                                        }} className="bg-green-500 mt-5 p-2 w-fit text-white text-md rounded-full">Sell Keys</button>
                                                    </div>
                                                </div>
                                            </Modal>:null
                                        }
                                    </div>
                                    :<p className="text-md">Not Applicable</p>
                                }
                            </div>
                        </div>
                    })
                }
            </div>
            }
        </div>
    )
}