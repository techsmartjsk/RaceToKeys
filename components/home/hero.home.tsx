import { getTradeHistory } from "@/lib/contract";
import { Session } from "@/lib/types"

const Hero = async ({ session }: { session: Session }) => {
    const tradeHistory = await getTradeHistory();

    return (
        <div className="px-20 py-10">
            <h1 className="font-bold text-xl">Your Keys</h1>
            <h1 className="text-xl">Trade History</h1>
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
