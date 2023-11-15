import TradeHistory from "../components/home/trade.history";
import { UserTradingHistory } from "../components/home/user.trading.history";
import KeyCollections from "../components/home/key.collections";
import ProtocolInformation from "../components/home/protocol.info";
import UserKeys from "../components/home/user.keys";
import { Header } from "../components/navbar/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authentication/auth";

const Homepage = async () => {
    const session = await getServerSession(authOptions)
    if(session){
        return (
            <>
            <Header session={session}/>
                <div className="px-20 py-10 w-full">
                    <ProtocolInformation/>
                    <UserKeys session={session}/>
                    <KeyCollections session={session}/>
                    <UserTradingHistory session={session}/>
                    <TradeHistory/>
                </div>
            </>
        );
    }
};

export default Homepage;
