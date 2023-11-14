"use client"

import { getOwnedCollections, getProtocolFeePercentage, getSubjectFeePercentage, getTradeHistory, getKeySubjects, getBuyPrice, getSellPrice, sellKeys, buyKeys, getSellPriceAfterFees, getBuyPriceAfterFees, getKeyBalance, getKeyHolders } from "@/lib/contract";
import { ContractTradeEvent, Session } from "@/lib/types"
import Image from "next/image"
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../common/modal";

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
    const [sellModalOpen, setSellModalOpen] = useState(false)
    const [buyModalOpen, setBuyModalOpen] = useState(false)

    const fetchTradeHistory = async () =>{
        try{
            const history = await getTradeHistory();
            setTradeHistory(history);
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchTradeHistory()
    },[])

    const fetchData = async () => {
        try{
            const protocol = await getProtocolFeePercentage();
            const subject = await getSubjectFeePercentage();
            const keys = await getKeySubjects(
                {
                    username: session.user?.username,
                    name: session.user?.name,
                    publicKey: session.user?.address,
                    privateKey: session.user.privateKey,
                    image: session.user.image,
                    address: session.user.address
                }
            )
            const updatedKeyCollections = keys.filter(
                (key) => key.address !== session.user.address 
            );
            const owned = await getOwnedCollections({
                username: session.user?.username,
                name: session.user?.name,
                publicKey: session.user?.address,
                privateKey: session.user.privateKey,
                image: session.user.image,
                address: session.user.address
            });
            setOwnedKeys(owned)
            setProtocolPercentage(protocol);
            setSubjectPercentage(subject);
            setKeyCollections(updatedKeyCollections)
        }catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        fetchData();
    }, [session?.user, session.user?.name, session.user?.publicKey, session.user?.username, session.user?.address]);

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

    const handleBuyPrice = async (address: string, amount: number) : Promise<number>=>{
        try{
            const buyPriceOfKeys = await getBuyPrice(address, amount)
            return buyPriceOfKeys 
        }catch(error){
            return 0;
        }
    }

    const handleBuyPriceAfterFees = async (address: string, amount: number) : Promise<number> => {
        try{
            const buyPriceOfKeysAfterFees = await getBuyPriceAfterFees(address, amount)
            return buyPriceOfKeysAfterFees
        }catch(error){
            return 0;
        }
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
                    <p className="w-[10%] text-center">Sell</p>
                </div>
                {
                    ownedKeys.map((key,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{index+1}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <p className="w-[10%] text-center">{key.keys}</p>
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
                                                        <button className="bg-green-500 mt-5 p-2 w-fit text-white text-md rounded-full">Sell Keys</button>
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

            <h1 className="text-xl mt-20">Key Collections</h1>
            <input className="rounded-md p-2 border-[1px] w-[500px] text-md mt-10" value={searchByAddress} onChange={(event)=>{
                            setSearchByAddress(event?.target.value);
                            handleSearchByAddress(event?.target.value);
            }} placeholder='Search By Address'></input>
            <div className="rounded-md w-full shadow-md p-5 mt-5">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[10%] text-center">Serial Number</p>
                    <p className="w-[30%] text-center">Address</p>
                    <p className="w-[10%] text-center">Buy</p>
                </div>
                {
                    keyCollections.map((key,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{index+1}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <div className="w-[10%] text-center">
                                <button onClick={()=>{
                                            setBuyModalOpen(!buyModalOpen)
                                        }
                                    } className="rounded-full p-1 bg-green-500 text-white">Buy Keys</button>
                                    {
                                        buyModalOpen ? <Modal title="Buy Keys" isOpen={buyModalOpen} onClose={()=>{
                                            setBuyModalOpen(!buyModalOpen)
                                        }}>
                                            <div className="w-full flex flex-col justify-center">
                                                <div className="flex">
                                                    <h2 className="text-lg w-1/2 text-left">Key Address : </h2>
                                                    <h1 className="w-1/2">{key.address.slice(0,4)}...{key.address.slice(-4)}</h1>
                                                </div>
                                                <div className="flex">
                                                    <h2 className="text-lg w-1/2 text-left">Buy Price of Keys : </h2>
                                                    <h1 className="w-1/2">{handleBuyPrice(key.address, key.keys)}</h1>
                                                </div>
                                                <div className="flex">
                                                    <h2 className="text-lg w-1/2 text-left">Buy Price of Keys (After Fees) : </h2>
                                                    <h1 className="w-1/2">{handleBuyPriceAfterFees(key.address, key.keys)}</h1>
                                                </div>
                                                <div>
                                                    <button className="bg-green-500 mt-5 p-2 w-fit text-white text-md rounded-full">Buy Keys</button>
                                                </div>
                                            </div>
                                        </Modal>:null
                                    }
                            </div>
                        </div>
                    })
                }
            </div>

            <h1 className="text-xl mt-20">Recent User Trade History</h1>
            <div className="rounded-md w-full shadow-md p-5 mt-10">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[10%]">Subject</p>
                    <p className="w-[10%]">Trader</p>
                    <p className="w-[10%]">Event Type</p>
                    <p className="w-[10%]">Key Amount</p>
                    <p className="w-[20%] text-center">Purchase Amount</p>
                </div>
                {
                    userTradeHistory.map((trade,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                        <p className="w-[20%]">{trade.sequence_number}</p>
                        <p className="w-[10%]">{trade.data.subject.slice(0,4)}...{trade.data.subject.slice(-4)}</p>
                        <p className="w-[10%]">{trade.data.trader.slice(0,4)}...{trade.data.trader.slice(-4)}</p>
                        <div className="w-[10%]">{
                            trade.data.is_buy ?
                            <p className="bg-green-500 text-md w-fit text-white p-2 rounded-full">Buying</p>:
                            <p className="bg-red-500 text-md w-fit text-white p-2 rounded-full">Selling</p>
                        }
                        </div>
                        <p className="w-[10%] text-center">{trade.data.key_amount}</p>
                        <p className="w-[20%] text-center">{(trade.data.purchase_apt_amount / 1_0000_0000).toFixed(2)} APT</p>
                    </div>
                    })
                }
            </div>
            <h1 className="text-xl mt-20">Trade History</h1>
            <div className="rounded-md w-full shadow-md p-5 mt-10">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[10%]">Subject</p>
                    <p className="w-[10%]">Trader</p>
                    <p className="w-[10%]">Event Type</p>
                    <p className="w-[10%]">Key Amount</p>
                    <p className="w-[20%] text-center">Purchase Amount</p>
                </div>
                {
                    tradeHistory.map((trade,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[20%]">{trade.sequence_number}</p>
                            <p className="w-[10%]">{trade.data.subject.slice(0,4)}...{trade.data.subject.slice(-4)}</p>
                            <p className="w-[10%]">{trade.data.trader.slice(0,4)}...{trade.data.trader.slice(-4)}</p>
                            <div className="w-[10%]">{
                                trade.data.is_buy ?
                                <p className="bg-green-500 text-md w-fit text-white p-2 rounded-full">Buying</p>:
                                <p className="bg-red-500 text-md w-fit text-white p-2 rounded-full">Selling</p>
                            }
                            </div>
                            <p className="w-[10%] text-center">{trade.data.key_amount}</p>
                            <p className="w-[20%] text-center">{(trade.data.purchase_apt_amount / 1_0000_0000).toFixed(2)} APT</p>
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default Hero;
