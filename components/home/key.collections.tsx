"use client"

import { getKeySubjects} from "@/lib/contract";
import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Session, User } from "@/lib/types"
import Modal from "../common/modal";
import { Collection } from "@/lib/types";
import BuyKeys from "../keys/buyKey";

export default function KeyCollections({ session }:{
    session: Session
}){
    const [keyCollections, setKeyCollections] = useState<Collection[]>([])
    const [buyModalOpenIndex, setBuyModalOpenIndex] = useState<number>(-1);
    const [keysToBuy, setKeysToBuy] = useState<string>("")

    const itemsPerPage = 10; // Adjust the number of items per page as needed
    const [currentPage, setCurrentPage] = useState<number>(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentKeyCollections = keyCollections.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const totalPages = Math.ceil(keyCollections.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    async function fetchKeyCollections(user: User){
        const keys = await getKeySubjects(user)
        setKeyCollections(keys)
    }
    useEffect(()=>{
        fetchKeyCollections(session.user)
    },[session.user])

    async function searchKeyCollections(formData: FormData){
        const searchValue = formData.get("searchValue")?.toString()
        if(searchValue){
            handleSearchByAddress(searchValue)
        }
    }

    const handleSearchByAddress = async (searchValue: string) => {
        if (searchValue === "") {
            const keys = await getKeySubjects(session.user)
            setKeyCollections(keys);
        } else {
            const filteredKeys = keyCollections?.filter((key) =>
                key.address.toLowerCase().includes(searchValue.toLowerCase())
            );
            setKeyCollections(filteredKeys);
        }
    }

    const changeKeyCollection = async (event: ChangeEvent<HTMLInputElement>) =>{
        if(event.target?.value === ''){
            const keys = await getKeySubjects(session.user)
            setKeyCollections(keys)
        }
    }

    return(
        <>
            <h1 className="text-xl mt-20">Key Collections</h1>
            <div className="flex gap-10">
                <form action={searchKeyCollections} className="flex gap-5 items-center mt-10">
                    <input name="searchValue" onChange={(event)=>{
                        changeKeyCollection(event)
                    }} className="rounded-full p-2 border-[1px] w-[500px] text-md" placeholder='Search By Address'></input>
                    <button className="text-white text-md bg-[#30D5C8] py-2 px-5 rounded-full">Search</button>
                </form>
            </div>
            <div className="rounded-md w-full flex flex-col shadow-md p-5 mt-5">
                <div className="ml-auto">
                    <nav className="flex gap-5 items-center border-[1px] bg-[#30D5C8] text-white p-2">
                        <p>Page</p>
                        <select
                            value={currentPage}
                            onChange={(event) => {
                            handlePageChange(Number(event.target.value));
                            }}
                            className="pagination bg-[#30D5C8] text-white focus:outline-none hover:outline-none"
                        >
                            {Array.from({ length: totalPages }).map((_, index) => (
                            <option
                                value={index + 1}
                                key={index}
                                className={`page-item ${
                                index + 1 === currentPage ? "active" : ""
                                }`}
                            >
                                {index + 1}
                            </option>
                            ))}
                        </select>
                        <p>of {totalPages}</p>
                    </nav>
                </div>
                <div className="flex gap-10 border-b-[0.5px] border-black p-2">
                    <p className="w-[10%] text-center">Serial Number</p>
                    <p className="w-[30%] text-center">Address</p>
                    <p className="w-[10%] text-center">Buy</p>
                </div>
                {
                    currentKeyCollections.map((key,index)=>{
                        return <div key={((index+ 1) + ((currentPage - 1) * itemsPerPage))} className="flex gap-10 p-2 border-b-[0.5px] cursor-pointer hover:shadow-lg">
                            <p className="w-[10%] text-center">{((index+ 1) + ((currentPage - 1) * itemsPerPage))}</p>
                            <p className="w-[30%] text-center">{key.address.slice(0,20)}...{key.address.slice(-4)}</p>
                            <div className="w-[10%] text-center">
                                <button onClick={()=>{
                                            setBuyModalOpenIndex(index)
                                        }
                                    } className="rounded-full p-1 bg-green-500 text-white">Buy Keys</button>
                            </div>
                        </div>
                    })
                }

                {
                   buyModalOpenIndex !== null && buyModalOpenIndex !== -1 ? <Modal title="Buy Keys" isOpen={true} onClose={()=>{
                        setBuyModalOpenIndex(-1)
                        setKeysToBuy('')
                    }}>
                        <BuyKeys 
                        user={session.user}
                        keySubjectAddress={keyCollections[buyModalOpenIndex].address}
                        keysToBuy={keysToBuy}
                        setKeysToBuy={setKeysToBuy}
                        setBuyModalOpenIndex={setBuyModalOpenIndex}
                        />
                    </Modal>:null
                }
            </div>
        </>
    )
}