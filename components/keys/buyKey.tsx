import { getKeyHolders } from '@/lib/contract';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const BuyKeys = async ({
    keySubjectAddress
}:{
    keySubjectAddress: string
}) =>{
    const keyHolders = await getKeyHolders(keySubjectAddress)
    return(
    <Popup trigger={<button className="rounded-full p-1 text-sm text-white bg-[#30D5C8]">Buy Keys</button>} modal>
        <div className="rounded-md">
            <p className="text-center font-bold">Buy Keys</p>
            <div>
                <div className="flex gap-10">
                    <p>Total Number of Keys</p>
                </div>
            </div>
        </div>
    </Popup>
    )
}

export default BuyKeys;