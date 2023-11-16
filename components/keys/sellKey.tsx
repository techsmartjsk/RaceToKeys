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
    keysToSell: string,
    setKeysToSell: React.Dispatch<React.SetStateAction<string>>
}){
    const keySupply = await getKeySupply(keySubjectAddress)

    async function knowSellPrice(formData: FormData){
        const amount = formData.get("keys")?.toString();
        console.log(amount)
        if(amount != null){
            setKeysToSell(amount)
        }
    }

    return(
        <div className='flex gap-5 flex-col'>
            <div className="flex">
                <h2 className="w-1/2 text-left">Key Address : </h2>
                <h1 className="w-1/2">{keySubjectAddress.slice(0,4)}...{keySubjectAddress.slice(-4)}</h1>
            </div>
            <div className='flex flex-col gap-2'>
                <p>Amount To Sell</p>
                <form action={knowSellPrice} className="flex flex-col gap-2">
                    <input name="keys" type="number" className="rounded-md bg-gray-200 h-[30px] w-full  p-2 border-[0.5px]" placeholder='Enter Keys to Buy'></input>
                    <button className="text-white p-1 w-fit text-md bg-red-500 rounded-full">Get Price</button>
                </form>
            </div>
            <div className='flex gap-5'>
                <div className="w-1/2">
                    <p>Sell Price of Keys</p>
                    <div className='bg-gray-200 rounded-md p-2'>{(keySupply > 1 && keySupply >= Number(keysToSell) && Number(keysToSell) != 0 && keysToSell !== '')  ? handleSellPrice(keySubjectAddress,Number(keysToSell)) : '0'} APT</div>
                </div>
                <div className="w-1/2">
                    <p>Sell Price of Keys (After Fees)</p>
                    <div className='bg-gray-200 rounded-md p-2'>{(keySupply > 1 && keySupply >= Number(keysToSell) && Number(keysToSell) != 0 && keysToSell !== '') ? handleSellPriceAfterFees(keySubjectAddress,Number(keysToSell)) : '0'} APT</div>
                </div>
            </div>
            <div>
                {
                    (keySupply > 1 && keySupply >= Number(keysToSell) && Number(keysToSell) != 0 && keysToSell !== '') ? 
                    <button onClick={()=>{
                        handleSellKeys(user,keySubjectAddress,Number(keysToSell))
                        setSellModalOpenIndex(-1)
                        toast.success("Sold Keys",{
                            position: toast.POSITION.BOTTOM_RIGHT
                        })
                    }} className="bg-red-500 p-2 w-full py-2 px-5 text-white text-md rounded-full">Sell Keys</button>
                    :<p>Key Supply Not Available!</p>
                }
            </div>
        </div>
    )
}