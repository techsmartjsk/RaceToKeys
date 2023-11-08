'use client'

import Lottie from "lottie-react";
import loadingBar from '../public/assets/animations/loadingBar.json'

export default function Loading(){
    return (
        <div className="w-full flex  items-center justify-center h-screen">
            <Lottie animationData={loadingBar} loop={true}/>
        </div>
    )
}