'use client'

import { LoginLayout } from "./login.layout"
import animation from '../../public/assets/animations/loginAnimation.json'
import Lottie from "lottie-react"


export const LoginPage = () =>{
    return(
        <div className="bg-[#30D5C8] p-20 h-screen flex items-center">
            <div className="flex items-center bg-white p-20 shadow-lg rounded-lg">
                <div className="flex items-center h-[500px] gap-5">
                    <div className="w-1/2">
                        <Lottie animationData={animation} loop={true}/>
                    </div>
                    <div className="w-1/2">
                        <LoginLayout/>
                    </div>
                </div>
            </div>
        </div>
    )
}