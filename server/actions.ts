import { buyKeys, getBuyPrice, getBuyPriceAfterFees } from "@/lib/contract";
import { User } from '@/lib/types';


export const handleBuyPrice = async (address: string, amount: number) : Promise<number>=>{
    try{
        const buyPriceOfKeys = await getBuyPrice(address, amount)
        return buyPriceOfKeys 
    }catch(error){
        return 0;
    }
}

export const handleBuyPriceAfterFees = async (address: string, amount: number) : Promise<number> => {
    try{
        const buyPriceOfKeysAfterFees = await getBuyPriceAfterFees(address, amount)
        return buyPriceOfKeysAfterFees
    }catch(error){
        return 0;
    }
}

export const handleBuyKeys = async (buyer: User, keySubjectAddress: string, amount: number) : Promise<void> =>{
    await buyKeys(buyer,keySubjectAddress,amount)
}