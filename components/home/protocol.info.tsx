"use client"

import { getProtocolFeePercentage, getSubjectFeePercentage } from "@/lib/contract"
import { Suspense, useEffect, useState } from "react";
import ModalAnimation from "../common/modal.animation";

export default function ProtocolInformation(){
    const [protocolPercentage, setProtocolPercentage] = useState<number>()
    const [subjectPercentage, setSubjectPercentage] = useState<number>()

    async function fetchData(){
        const protocolPercentage = await getProtocolFeePercentage();
        const subjectPercentage = await getSubjectFeePercentage();

        setProtocolPercentage(protocolPercentage)
        setSubjectPercentage(subjectPercentage)
    }
    useEffect(()=>{
        fetchData()
    },[])
    return(
        <>
            <h1 className="text-xl">Dashboard</h1>
            <Suspense fallback={<ModalAnimation/>}>
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
            </Suspense>
        </>
    )
}