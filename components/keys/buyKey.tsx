import { getKeySupply } from '@/lib/contract';
import { User } from '@/lib/types';
import { handleBuyKeys, handleBuyPrice, handleBuyPriceAfterFees } from '@/server/actions';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';

const BuyKeys = async ({
    user,
    keySubjectAddress,
    keysToBuy,
    setKeysToBuy,
    setBuyModalOpenIndex
}:{
    user: User,
    keySubjectAddress: string,
    keysToBuy: string,
    setKeysToBuy: React.Dispatch<React.SetStateAction<string>>,
    setBuyModalOpenIndex:React.Dispatch<React.SetStateAction<number>>
}) =>{
    
    const keys = await getKeySupply(keySubjectAddress)
    async function knowBuyPrice(formData: FormData){
        const amount = formData.get("keys")?.toString();
        if(amount != null){
            setKeysToBuy(amount)
        }
    }

    const handlePriceValue = (amount: string) => {
        if(amount === ''){
            setKeysToBuy('')
        }
    }

    return(
    <div className='flex gap-5 flex-col'>
        <div className='flex gap-5'>
            <p className="w-1/2  text-left">Key Supply : </p>
            <p className="w-1/2">{keys}</p>
        </div>
        <div className='flex flex-col gap-2'>
            <p>Keys to buy : </p>
            <form action={knowBuyPrice} className="flex flex-col gap-2">
                <input name="keys" type="number" onChange={(event)=>{
                    handlePriceValue(event.target.value)
                }} className="rounded-md bg-gray-200 h-[30px] w-full  p-2 border-[0.5px]" placeholder='Enter Keys to Buy'></input>
                <button className="text-white p-1 w-fit text-md bg-green-500 rounded-full">Get Price</button>
            </form>
        </div>
        <div className='flex gap-5'>
            <div className="w-1/2">
                <p>Price of Keys : </p>
                <div className='bg-gray-200 rounded-md p-2'>{(Number(keysToBuy) > 0 && keysToBuy != '') ? handleBuyPrice(keySubjectAddress, Number(keysToBuy)) : '0'} APT</div>
            </div>
            <div className="w-1/2">
                <p>Price of Keys(After Fees) : </p>
                <div className='bg-gray-200 rounded-md p-2'>{(Number(keysToBuy) > 0 && keysToBuy != '') ? handleBuyPriceAfterFees(keySubjectAddress, Number(keysToBuy)) : '0'} APT</div>
            </div>
        </div>
        {
            (Number(keysToBuy) > 0 && keysToBuy != '') && <button onClick={()=>{
                handleBuyKeys(user,keySubjectAddress,Number(keysToBuy));
                toast.success('Bought Keys!',{
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                toast.warning('Reload the server to see updates!',{
                    position: toast.POSITION.TOP_RIGHT
                })
                setBuyModalOpenIndex(-1)
            }} className="w-full py-2 px-5 w-full bg-green-500 text-white text-md rounded-full">Buy Keys</button>
        }
    </div>
    )
}

export default BuyKeys;