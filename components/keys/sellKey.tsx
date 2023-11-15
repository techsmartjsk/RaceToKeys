import { getKeySupply } from "@/lib/contract"
import { User } from "@/lib/types"
import { handleSellKeys, handleSellPrice, handleSellPriceAfterFees } from "@/server/actions"
import { toast } from "react-toastify"

export default async function SellKey({
    user,
    keySubjectAddress,
    setSellModalOpenIndex,
    keysToSell,
    setKeysToSell
}:{
    user: User,
    keySubjectAddress: string,
    setSellModalOpenIndex:React.Dispatch<React.SetStateAction<number>>,
    keysToSell: number,
    setKeysToSell: React.Dispatch<React.SetStateAction<number>>
}){
    const keySupply = await getKeySupply(keySubjectAddress)

    return  <div className="w-full flex flex-col justify-center">
    <div className="flex">
        <h2 className="text-lg w-1/2 text-left">Key Address : </h2>
        <h1 className="w-1/2">{keySubjectAddress.slice(0,4)}...{keySubjectAddress.slice(-4)}</h1>
    </div>
    <div className="flex">
        <h2 className="text-lg w-1/2 text-left">Amount To Sell : </h2>
        <input value={keysToSell} onChange={(event)=>{
            setKeysToSell(Number(event.target.value))
        }} placeholder="Enter Amount To Sell"></input>
    </div>
    <div className="flex">
        <h2 className="text-lg w-1/2 text-left">Sell Price of Keys : </h2>
        <h1 className="w-1/2">{handleSellPrice(keySubjectAddress,keysToSell)}</h1>
    </div>
    <div className="flex">
        <h2 className="text-lg w-1/2 text-left">Sell Price of Keys (After Fees) : </h2>
        <h1 className="w-1/2">{handleSellPriceAfterFees(keySubjectAddress,keysToSell)}</h1>
    </div>
    <div>
        {
            (keySupply > 1 && keySupply >= keysToSell) ? 
            <button onClick={()=>{
                handleSellKeys(user,keySubjectAddress,keysToSell)
                setSellModalOpenIndex(-1)
                toast.success("Sold Keys",{
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }} className="bg-green-500 mt-5 p-2 text-white text-md rounded-full">Sell Keys</button>
            :<p>Key Supply Not Available!</p>
        }
    </div>
</div>
}