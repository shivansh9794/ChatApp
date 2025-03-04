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


    const toggleSearchDrawer = () => {
        setSearchDrawer(!searchDrwer);  // Toggle state
    };

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
        <div className='bg-gray-100 w-[100%] flex flex-col'>

            {/* Navbar */}
            <div className='bg-blue-700 p-2 h-auto flex justify-between w-[100%]'>
                <div className='font-extrabold text-2xl text-black '>CHAT App</div>
                <div className='bg-green-600 text-white p-1 cursor-help rounded-sm' onClick={toggleSearchDrawer}>search</div>
            </div>

            {/* Search Bar */}
            <div className={`absolute top-0 right-[350px]  ${searchDrwer ? 'hidden' : ''}`}>
                {Search()}
            </div>

            <div className='grid grid-cols-10 w-full h-[91vh] gap-1 bg-gray-300'>
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