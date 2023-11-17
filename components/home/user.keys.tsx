"use client"

import Image from "next/image"
import { useState, useEffect, Suspense } from "react";
import { getKeySupply, getOwnedCollections } from "@/lib/contract";
import { Collection, Session } from "@/lib/types";
import Modal from "../common/modal";
import ModalAnimation from "../common/modal.animation";
import SellKey from "../keys/sellKey";
import { handleKeySupply } from "@/server/actions";

export default function UserKeys({ session }:{
    session: Session
}){
    const [ownedKeys, setOwnedKeys] = useState<Collection[]>([]);
    const [sellModalOpenIndex, setSellModalOpenIndex] = useState<number>(-1)
    const [keysToSell, setKeysToSell] = useState<string>("")
    const [totalKeySupply, setTotalKeySupply] = useState<number>(0)

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

    const calculateTotalKeySupply = async () => {
        const keySupplies = await Promise.all(
            ownedKeys.map(async (key) => await handleKeySupply(key.address))
        );
        console.log(keySupplies)
    
        const totalKeySupply = keySupplies.reduce((acc, supply) => Number(acc) + Number(supply), 0);
        return totalKeySupply;
    };


    useEffect(() => {
        const updateTotalKeySupply = async () => {
            const totalSupply = await calculateTotalKeySupply();
            setTotalKeySupply(totalSupply);
        };
    
        updateTotalKeySupply();
    }, [ownedKeys]); 


    return(
        <div>
            <h1 className="text-xl mt-10">Your Keys</h1>
            <Suspense fallback={<ModalAnimation/>}>
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
                        <p className="w-[10%] text-center">Key Supply</p>
                        <p className="w-[10%] text-center">Sell</p>
                    </div>
                    {
                        ownedKeys.map(async (key,index)=>{
                            return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                                <p className="w-[10%] text-center">{index+1}</p>
                                <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                                <p className="w-[10%] text-center">{key.keys}
                                    {
                                        key.keys > 1 ? ' Keys':' Key'
                                    }
                                </p>
                                <p className="w-[10%] text-center">
                                    {handleKeySupply(key.address)}
                                    {
                                        await handleKeySupply(key.address) > 1 ? ' Keys':' Key'
                                    }
                                </p>
                                <div className="w-[10%] text-center">
                                    {
                                        key.keys > 0 ? 
                                        <div>
                                            {
                                                await handleKeySupply(key.address) > 1 ? 
                                                    <div>
                                                        <button onClick={()=>{
                                                                setSellModalOpenIndex(index)
                                                            }
                                                        } className="rounded-full p-1 bg-red-500 text-white">Sell Keys</button>
                                                        {
                                                            sellModalOpenIndex != -1 ? <Modal title="Sell Keys" isOpen={true} onClose={()=>{
                                                                setSellModalOpenIndex(-1)
                                                                setKeysToSell('')
                                                            }}>
                                                                <SellKey 
                                                                keyBalance={key.keys}
                                                                user={session.user}
                                                                keysToSell={keysToSell}
                                                                setKeysToSell={setKeysToSell}
                                                                keySubjectAddress={ownedKeys[sellModalOpenIndex].address}
                                                                setSellModalOpenIndex={setSellModalOpenIndex}
                                                                />
                                                            
                                                            </Modal>:null
                                                        }
                                                    </div>
                                                : null
                                            }
                                        </div>
                                        :<p className="text-md">Not Applicable</p>
                                    }
                                </div>
                            </div>
                        })
                    }

                    <div className="flex gap-10 border-black p-2">
                        <p className="w-[10%] text-center"></p>
                        <p className="w-[25%] text-center"></p>
                        <p className="w-[15%] text-center">Total Key Supply</p>
                        <p className="w-[10%] text-center">{totalKeySupply} Keys</p>
                        <p className="w-[10%] text-center"></p>
                    </div>
                </div>
                }
            </Suspense>
        </div>
    )
}