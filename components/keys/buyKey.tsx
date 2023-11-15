import { getKeyBalance, getKeyHolders, getKeySupply } from '@/lib/contract';
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
    keysToBuy: string,
    setKeysToBuy: React.Dispatch<React.SetStateAction<string>>,
    setBuyModalOpenIndex:React.Dispatch<React.SetStateAction<number>>
}) =>{
    const keyHolders = await getKeyHolders(keySubjectAddress)
    let keys;
    let keysCurrentValue;

    if(selectedAddress === ''){
        keys = await getKeySupply(keySubjectAddress)
        keysCurrentValue = await getKeyBalance(keyHolders[0].address,keySubjectAddress)
    }else{
        keys = await getKeySupply(keySubjectAddress)
        keysCurrentValue = await getKeyBalance(selectedAddress,keySubjectAddress)
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
            <p className="w-1/2 font-semibold text-left">Key Holder Current Value : </p>
            <p>{keysCurrentValue}</p>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Key Supply : </p>
            <p>{keys}</p>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Keys to buy : </p>
            <input type="number" value={keysToBuy} onChange={(event)=>{
                setKeysToBuy(event.target.value)
            }} className="rounded-full border-[0.5px]" placeholder='Enter Keys to Buy'></input>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Price of Keys : </p>
            <p>{handleBuyPrice(keySubjectAddress, Number(keysToBuy))}</p>
        </div>
        <div className='flex gap-5'>
            <p className="w-1/2 font-semibold text-left">Price of Keys(After Fees) : </p>
            <p>{handleBuyPriceAfterFees(keySubjectAddress, Number(keysToBuy))}</p>
        </div>
        <button onClick={()=>{
                handleBuyKeys(user,keySubjectAddress,Number(keysToBuy));
                toast.success('Bought Keys!',{
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                setBuyModalOpenIndex(-1)
            }} className="w-full py-2 px-5 w-full bg-green-500 text-white text-md rounded-full">Buy Keys</button>
    </div>
    )
}

export default BuyKeys;