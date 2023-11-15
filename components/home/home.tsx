import TradeHistory from "./trade.history";
import { UserTradingHistory } from "./user.trading.history";
import KeyCollections from "./key.collections";
import ProtocolInformation from "./protocol.info";
import UserKeys from "./user.keys";
import { Header } from "../navbar/header";
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
