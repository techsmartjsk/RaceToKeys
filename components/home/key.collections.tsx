"use client"

import { buyKeys, getBuyPrice, getKeySubjects, getBuyPriceAfterFees } from "@/lib/contract";
import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Session } from "@/lib/types"
import Modal from "../common/modal";
import { Collection } from "@/lib/types";
import { handleBuyPrice, handleBuyPriceAfterFees } from "@/server/actions";
import BuyKeys from "../keys/buyKey";

export default function KeyCollections({ session }:{
    session: Session
}){
    const [keyCollections, setKeyCollections] = useState<Collection[]>([])
    const [buyModalOpenIndex, setBuyModalOpenIndex] = useState<number>(-1);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [keysHolded, setKeysHolded] = useState<number>(0)
    const [keysToBuy, setKeysToBuy] = useState<number>(0)

    useEffect(()=>{
        async function fetchKeyCollections(){
            const keys = await getKeySubjects(session.user)
            setKeyCollections(keys)
        }
        fetchKeyCollections()
    },[session.user])

    async function searchKeyCollections(formData: FormData){
        const searchValue = formData.get("searchValue")?.toString()
        if(searchValue){
            handleSearchByAddress(searchValue)
        }
    }

    const handleSearchByAddress = async (searchValue: string) => {
        if (searchValue === "") {
            const keys = await getKeySubjects(session.user)
            setKeyCollections(keys);
        } else {
            const filteredKeys = keyCollections?.filter((key) =>
                key.address.toLowerCase().includes(searchValue.toLowerCase())
            );
            setKeyCollections(filteredKeys);
        }
    }

    const handleBuyKeys = async (address: string, amount:number) =>{
        await buyKeys(session.user,address,amount)
        toast.success('Buying of keys has been initiated',{
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    const changeKeyCollection = async (event: ChangeEvent<HTMLInputElement>) =>{
        if(event.target?.value === ''){
            const keys = await getKeySubjects(session.user)
            setKeyCollections(keys)
        }
    }

    return(
        <>
            <h1 className="text-xl mt-20">Key Collections</h1>
            <form action={searchKeyCollections} className="flex gap-5 items-center mt-10">
                <input name="searchValue" onChange={(event)=>{
                    changeKeyCollection(event)
                }} className="rounded-full p-2 border-[1px] w-[500px] text-md" placeholder='Search By Address'></input>
                <button className="text-white text-md bg-blue-500 py-2 px-5 rounded-full">Search</button>
            </form>
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
                                            setBuyModalOpenIndex(index)
                                        }
                                    } className="rounded-full p-1 bg-green-500 text-white">Buy Keys</button>
                            </div>
                        </div>
                    })
                }

                {
                   buyModalOpenIndex !== null && buyModalOpenIndex !== -1 ? <Modal title="Buy Keys" isOpen={true} onClose={()=>{
                        setBuyModalOpenIndex(-1)
                    }}>
                        <BuyKeys 
                        user={session.user}
                        keySubjectAddress={keyCollections[buyModalOpenIndex].address}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        keysHolded={keysHolded}
                        setKeysHolded={setKeysHolded}
                        keysToBuy={keysToBuy}
                        setKeysToBuy={setKeysToBuy}
                        setBuyModalOpenIndex={setBuyModalOpenIndex}
                        />
                    </Modal>:null
                }
            </div>
        </>
    )
}