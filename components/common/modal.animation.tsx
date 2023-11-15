import Lottie from "lottie-react";
import modalAnimation from '@/public/assets/animations/modalAnimation.json'

export default function ModalAnimation(){
    return(
        <div className="h-[150px] w-full flex items-center justify-center">
            <Lottie animationData={modalAnimation} loop={true}/> 
        </div>
    )
} 