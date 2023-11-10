import { getOwnedCollections, getProtocolFeePercentage, getSubjectFeePercentage, getTradeHistory } from "@/lib/contract";
import { ContractGetOwnedCollectionsResponse, ContractTradeEvent, Session } from "@/lib/types"
import Image from "next/image"

const Hero = async ({ session }: { session: Session }) => {
    const tradeHistory: ContractTradeEvent[] = await getTradeHistory();
    const protocolPercentage = await getProtocolFeePercentage();
    const subjectPercentage = await getSubjectFeePercentage();
    const ownedKeys = await getOwnedCollections(session.user)

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
                    </div>:null
            }
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
