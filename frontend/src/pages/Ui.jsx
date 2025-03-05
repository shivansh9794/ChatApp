import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Search from '../search/Search';
import MyChats from '../chats/MyChats';
import SingleChat from '../singleChat/SingleChat';
import { chatState } from '../context/chatProvider';

const Ui = () => {

    const { user } = chatState();
    const [searchDrwer, setSearchDrawer] = useState(true);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [showChatPage,setShowChatPage]=useState(false);


   

    const toggleChatPage = () => {
        setShowChatPage(!showChatPage);
    };

    if (!user) {
        return (
            <div>
                No User......
            </div>
        )
    }
    // Main Return
    return (
        <div className='w-[100%] flex flex-col'>

            {/* Navbar */}
            <div className='bg-green-300 p-2 h-auto flex justify-between w-[100%]'>
                <div className='font-extrabold text-2xl text-black '>CHAT App</div>
                <div>{Search()}</div>
            </div>

            <div className='grid grid-cols-10 w-full h-[91vh] gap-1 '>
                {/* All Chats */}
                <div className='col-span-4 w-full'>
                    {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setShowChatPage={setShowChatPage}/>}
                </div>

                {/* Message Page */}
                <div className={`col-span-6 w-full ${!showChatPage ? 'hidden' : ""} `} >
                    {user && <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </div>
            </div>

        </div>
    )
}

export default Ui