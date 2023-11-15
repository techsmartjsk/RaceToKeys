import { getKeyBalance, getKeyHolders } from '@/lib/contract';
import { Session, User } from '@/lib/types';
import { handleBuyKeys, handleBuyPrice, handleBuyPriceAfterFees } from '@/server/actions';
import { toast } from 'react-toastify';

const BuyKeys = async ({
    user,
    keySubjectAddress,
    selectedAddress,
    setSelectedAddress,
    keysHolded,
    setKeysHolded,
    keysToBuy,
    setKeysToBuy,
    setBuyModalOpenIndex
}:{
    user: User,
    keySubjectAddress: string,
    selectedAddress: string,
    setSelectedAddress: React.Dispatch<React.SetStateAction<string>>,
    keysHolded: number,
    setKeysHolded:React.Dispatch<React.SetStateAction<number>>,
    keysToBuy: number,
    setKeysToBuy: React.Dispatch<React.SetStateAction<number>>,
    setBuyModalOpenIndex:React.Dispatch<React.SetStateAction<number>>
}) =>{
    const keyHolders = await getKeyHolders(keySubjectAddress)
    let keys;

    if(selectedAddress === ''){
        keys = await getKeyBalance(keyHolders[0].address,keySubjectAddress)
    }else{
        keys = await getKeyBalance(selectedAddress,keySubjectAddress)
    }

    return(
    <div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Select Key Holder : </p>
            <select defaultValue={keyHolders[0].address} value={
                selectedAddress === '' ? keyHolders[0].address : selectedAddress 
            } onChange={(event)=>{
                setSelectedAddress(event.target.value)
            }} className="p-2 rounded-md w-1/2">
                {
                    keyHolders.map((keyHolder, index)=>{
                        return <option key={index} value={keyHolder.address}>{keyHolder.address.slice(0,4)}...{keyHolder.address.slice(-4)}</option>
                    })
                }
            </select>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Number of Keys : </p>
            <p>{keys}</p>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Keys to buy : </p>
            <input type="number" value={keysToBuy} onChange={(event)=>{
                setKeysToBuy(Number(event.target.value))
            }} className="rounded-md border-[0.5px]" placeholder='Enter Keys to Buy'></input>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Price of Keys : </p>
            <p>{handleBuyPrice(keySubjectAddress, Number(keysToBuy))}</p>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Price of Keys(After Fees) : </p>
            <p>{handleBuyPriceAfterFees(keySubjectAddress, Number(keysToBuy))}</p>
        </div>
        {
            keys >= keysToBuy ? <button onClick={()=>{
                handleBuyKeys(user,keySubjectAddress,keysToBuy);
                toast.success('Bought Keys!',{
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                setBuyModalOpenIndex(-1)
            }} className="w-full py-2 px-5 w-full bg-green-500 text-white text-md">Buy Keys</button>:<p>Not Enough Keys available!</p>
        }
    </div>
    )
}

export default BuyKeys;