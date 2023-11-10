import { getOwnedCollections } from "@/lib/contract"
import { Session } from "@/lib/types"

export const Hero = async ({session}:{
    session: Session
}) =>{
    const keys = await getOwnedCollections(session.user);
    console.log(keys)
    return <div className="px-20 py-10">
    <h1 className="font-bold text-xl">Your Keys</h1>
    </div>
}