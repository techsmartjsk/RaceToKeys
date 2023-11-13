import { authOptions } from "@/authentication/auth"
import { Header } from "../navbar/header"
import { getServerSession } from "next-auth"
import  Hero from "./hero.home"
import { getOwnedCollections, getTradeHistory, getProtocolFeePercentage, getSubjectFeePercentage, getKeySubjects  } from "@/lib/contract"


export const Homepage = async () =>{
    const session = await getServerSession(authOptions)
    const history = await getTradeHistory();
    const protocol = await getProtocolFeePercentage();
    const subject = await getSubjectFeePercentage();
    const owned = await getOwnedCollections({
        username: session?.user.username,
        publicKey: session?.user.address,
        name: session?.user.name,
        image: session?.user.image,
        address: session?.user.address,
        privateKey: session?.user.privateKey
    });
    const keys = await getKeySubjects(session?.user)
    if(session){
        return(
            <div>
                <Header session={session}/>
                <Hero session={session} 
                history={history}
                protocol={protocol}
                subject={subject}
                owned={owned}
                keys={keys}
                />
            </div>
            )
    }
}