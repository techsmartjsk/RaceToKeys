import { authOptions } from "@/authentication/auth"
import { Header } from "../navbar/header"
import { getServerSession } from "next-auth"

export const Homepage = async () =>{
    const session = await getServerSession(authOptions)
    if(session){
        return(
            <div>
                <Header session={session}/>
            </div>
            )
    }
}