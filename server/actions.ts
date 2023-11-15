import { buyKeys, getBuyPrice, getBuyPriceAfterFees, getSellPrice, getSellPriceAfterFees, sellKeys } from "@/lib/contract";
import { User } from '@/lib/types';


export const handleSellPrice = async (address: string, amount: number) : Promise<number> =>{
    try{
        const sellPriceOfKeys = await getSellPrice(address, amount)
        return sellPriceOfKeys
    }catch(error){
        return 0;
    }
}

export const handleSellPriceAfterFees = async (address: string, amount: number) : Promise<number> =>{
    try{
        const sellPriceOfKeysAfterFees = await getSellPriceAfterFees(address, amount)
        return sellPriceOfKeysAfterFees
    }catch(error){
        return 0;
    }
}


export const handleBuyPrice = async (address: string, amount: number) : Promise<number> =>{
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

export const handleSellKeys = async (seller: User, keySubjectAddress: string, amount: number) : Promise<void> =>{
    await sellKeys(seller,keySubjectAddress,amount)
}