"use client"

import { getTradeHistory } from "@/lib/contract"
import { ContractTradeEvent, Session } from "@/lib/types";
import { useEffect, useState } from "react";

export default function UserTradingHistory({ session }: {
    session: Session
}){
    async function fetchData(){
        const tradeHistory = await getTradeHistory()
        setTradeHistory(tradeHistory)
    }

    useEffect(()=>{
        fetchData()
    },[])

    const [tradeHistory, setTradeHistory] = useState<ContractTradeEvent[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const userTradeHistory = tradeHistory.filter(trade => {
        return trade.data.trader === session.user.address;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUserTradeHistory = tradeHistory
        .filter((trade) => trade.data.trader === session.user.address)
        .slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(
        userTradeHistory.length / itemsPerPage
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    return(
        <>
            <h1 className="text-xl mt-20">Recent User Trade History</h1>
            <div className="rounded-md flex flex-col w-full shadow-md p-5 mt-10">
                <div className="ml-auto">
                    <nav className="flex gap-5 items-center border-[1px] bg-[#30D5C8] text-white p-2">
                        <p>Page</p>
                        <select
                            value={currentPage}
                            onChange={(event) => {
                            handlePageChange(Number(event.target.value));
                            }}
                            className="pagination bg-[#30D5C8] text-white focus:outline-none hover:outline-none"
                        >
                            {Array.from({ length: totalPages }).map((_, index) => (
                            <option
                                value={index + 1}
                                key={index}
                                className={`page-item ${
                                index + 1 === currentPage ? "active" : ""
                                }`}
                            >
                                {index + 1}
                            </option>
                            ))}
                        </select>
                        <p>of {totalPages}</p>
                    </nav>
                </div>
                <div className="flex gap-10 border-b-[0.5px] border-black p-2 mt-5">
                    <p className="w-[20%]">Sequence Number</p>
                    <p className="w-[10%]">Subject</p>
                    <p className="w-[10%]">Trader</p>
                    <p className="w-[10%]">Event Type</p>
                    <p className="w-[10%]">Key Amount</p>
                    <p className="w-[20%] text-center">Purchase Amount</p>
                </div>
                {
                    currentUserTradeHistory.map((trade,index)=>{
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