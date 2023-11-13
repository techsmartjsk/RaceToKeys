"use client"

import { getOwnedCollections, getProtocolFeePercentage, getSubjectFeePercentage, getTradeHistory, getKeySubjects, getBuyPrice, getSellPrice, sellKeys, buyKeys, getSellPriceAfterFees, getBuyPriceAfterFees } from "@/lib/contract";
import { ContractTradeEvent, Session } from "@/lib/types"
import Image from "next/image"
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Collection = {
    address: string;
    keys:number
}

const Hero = ({ session }: { session: Session }) => {
    const [tradeHistory, setTradeHistory] = useState<ContractTradeEvent[]>([]);
    const [protocolPercentage, setProtocolPercentage] = useState<number>(0);
    const [subjectPercentage, setSubjectPercentage] = useState<number>(0);
    const [ownedKeys, setOwnedKeys] = useState<Collection[]>([]);
    const [keyCollections, setKeyCollections] = useState<Collection[]>([])
    const [searchByAddress, setSearchByAddress] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const history = await getTradeHistory();
            const protocol = await getProtocolFeePercentage();
            const subject = await getSubjectFeePercentage();
            const keys = await getKeySubjects(session.user)
            const updatedKeyCollections = keys.filter(
                (key) => key.address !== session.user.address 
            );
            const owned = await getOwnedCollections(session.user);
            setOwnedKeys(owned)
            setTradeHistory(history);
            setProtocolPercentage(protocol);
            setSubjectPercentage(subject);
            setKeyCollections(updatedKeyCollections)
        };

        fetchData();
    }, []);

    const userTradeHistory = tradeHistory.filter(trade => {
        return trade.data.trader === session.user.address;
    });

    const handleSearchByAddress = async (searchValue: string) => {
        if (searchValue === "") {
            const keys = await getKeySubjects(session.user)
            const updatedKeyCollections = keys.filter(
                (key) => key.address !== session.user.address 
            );
            setKeyCollections(updatedKeyCollections);
        } else {
            const filteredKeys = keyCollections.filter((key) =>
                key.address.toLowerCase().includes(searchValue.toLowerCase())
            );
            setKeyCollections(filteredKeys);
        }
    }

    const handleSellKeys = async (address:string, amount:number) =>{
        await sellKeys(session.user, address, amount)
        toast.success('Selling of keys has been initiated',{
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    const handleBuyKeys = async (address: string, amount:number) =>{
        await buyKeys(session.user,address,amount)
        toast.success('Buying of keys has been initiated',{
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }
    
    return (
        <div className="px-20 py-10 w-full">
            <h1 className="text-xl">Dashboard</h1>
            <div className="flex gap-10 mt-10 justify-center">
                <div className="w-1/2">
                    <p className="text-7xl text-[#30D5C8] font-bold">{protocolPercentage}%</p>
                    <p className="text-xl">Protocol Fee Percentage</p>
                </div>
                <div className="w-1/2">
                    <p className="text-7xl text-[#30D5C8] font-bold">{subjectPercentage}%</p>
                    <p className="text-xl">Subject Fee Percentage</p>
                </div>
            </div>
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
                    <p className="w-[10%] text-center">Value</p>
                    <p className="w-[10%] text-center">Value(After Fees)</p>
                    <p className="w-[10%] text-center">Sell</p>
                </div>
                {
                    ownedKeys.map((key,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{index+1}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <p className="w-[10%] text-center">{key.keys}</p>
                            <p className="w-[10%] text-center">{
                                key.keys > 0 ? getSellPrice(key.address,key.keys):<p className="text-md">Not Applicable</p>
                            }</p>
                            <p className="w-[10%] text-center">{
                                key.keys > 0 ? getSellPriceAfterFees(key.address,key.keys):<p className="text-md">Not Applicable</p>
                            }</p>
                            <p className="w-[10%] text-center">
                                {
                                    key.keys > 0 ? <button onClick={()=>{
                                        handleSellKeys(key.address, key.keys)
                                    }} className="rounded-md p-2 text-white bg-red-500">Sell Keys</button>:<p className="text-md">Not Applicable</p>
                                }
                            </p>
                        </div>
                    })
                }
            </div>
            }

            <h1 className="text-xl mt-20">Key Collections</h1>
            <input className="rounded-md p-2 border-[1px] w-[500px] text-md mt-10" value={searchByAddress} onChange={(event)=>{
                            setSearchByAddress(event?.target.value);
                            handleSearchByAddress(event?.target.value);
            }} placeholder='Search By Address'></input>
            <div className="rounded-md w-full shadow-md p-5 mt-5">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[10%] text-center">Serial Number</p>
                    <p className="w-[30%] text-center">Address</p>
                    <p className="w-[10%] text-center">Keys</p>
                    <p className="w-[10%] text-center">Value</p>
                    <p className="w-[10%] text-center">Value(After Fees)</p>
                    <p className="w-[10%] text-center">Buy</p>
                </div>
                {
                    keyCollections.map((key,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{index+1}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <p className="w-[10%] text-center">{key.keys}</p>
                            <p className="w-[10%] text-center">{
                                key.keys > 0 ? getBuyPrice(key.address,key.keys):<p className="text-md">Not Applicable</p>
                            }</p>
                            <p className="w-[10%] text-center">{
                                key.keys > 0 ? getBuyPriceAfterFees(key.address,key.keys):<p className="text-md">Not Applicable</p>
                            }</p>
                            <p className="w-[10%] text-center">
                                {
                                    key.keys > 0 ? <button onClick={()=>{
                                        handleBuyKeys(key.address,key.keys)
                                    }} className="rounded-md p-2 text-white bg-[#30D5C8]">Buy Keys</button>:<p className="text-md">Not Applicable</p>
                                }
                            </p>
                        </div>
                    })
                }
            </div>

            <h1 className="text-xl mt-20">Recent User Trade History</h1>
            <div className="rounded-md w-full shadow-md p-5 mt-10">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[40%]">Subject</p>
                    <p className="w-[40%]">Trader</p>
                </div>
                {
                    userTradeHistory.map((trade,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[20%]">{trade.sequence_number}</p>
                            <p className="w-[40%]">{trade.data.subject.slice(0,4)}...{trade.data.subject.slice(-4)}</p>
                            <p className="w-[40%]">{trade.data.trader.slice(0,4)}...{trade.data.trader.slice(-4)}</p>
                        </div>
                    })
                }
            </div>
            <h1 className="text-xl mt-20">Trade History</h1>
            <div className="rounded-md w-full shadow-md p-5 mt-10">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[40%]">Subject</p>
                    <p className="w-[40%]">Trader</p>
                </div>
                {
                    tradeHistory.map((trade,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[20%]">{trade.sequence_number}</p>
                            <p className="w-[40%]">{trade.data.subject.slice(0,4)}...{trade.data.subject.slice(-4)}</p>
                            <p className="w-[40%]">{trade.data.trader.slice(0,4)}...{trade.data.trader.slice(-4)}</p>
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default Hero;
