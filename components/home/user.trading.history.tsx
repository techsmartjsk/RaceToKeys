import { getTradeHistory } from "@/lib/contract"
import { Session } from "@/lib/types";

export async function UserTradingHistory({ session }: {
    session: Session
}){
    const tradeHistory = await getTradeHistory()
    const userTradeHistory = tradeHistory.filter(trade => {
        return trade.data.trader === session.user.address;
    });
    return(
        <>
            <h1 className="text-xl mt-20">Recent User Trade History</h1>
            <div className="rounded-md w-full shadow-md p-5 mt-10">
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[10%]">Subject</p>
                    <p className="w-[10%]">Trader</p>
                    <p className="w-[10%]">Event Type</p>
                    <p className="w-[10%]">Key Amount</p>
                    <p className="w-[20%] text-center">Purchase Amount</p>
                </div>
                {
                    userTradeHistory.map((trade,index)=>{
                        return <div key={index} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                        <p className="w-[20%]">{trade.sequence_number}</p>
                        <p className="w-[10%]">{trade.data.subject.slice(0,4)}...{trade.data.subject.slice(-4)}</p>
                        <p className="w-[10%]">{trade.data.trader.slice(0,4)}...{trade.data.trader.slice(-4)}</p>
                        <div className="w-[10%]">{
                            trade.data.is_buy ?
                            <p className="bg-green-500 text-md w-fit text-white p-2 rounded-full">Buying</p>:
                            <p className="bg-red-500 text-md w-fit text-white p-2 rounded-full">Selling</p>
                        }
                        </div>
                        <p className="w-[10%] text-center">{trade.data.key_amount} {
                            trade.data.key_amount > 1 ? ' Keys':' Key'
                        }</p>
                        <p className="w-[20%] text-center">{(trade.data.purchase_apt_amount / 1_0000_0000).toFixed(2)} APT</p>
                    </div>
                    })
                }
            </div>
        </>
    )
}