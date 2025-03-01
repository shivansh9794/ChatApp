import React, { useContext, useEffect, useState } from 'react'
import Search from '../search/Search';
import MyChats from '../chats/MyChats';
import ChatBox from '../chatBox/ChatBox';
import { chatState } from '../context/chatProvider';

const Ui = () => {
    const { user }=chatState();
    if(!user){
        <div>
            No User......
        </div>
    }
    // Main Return
    return(
        <div className='bg-gray-100 w-full gap-2 h-screen border-2 grid grid-cols-8 '>

            <div className='col-span-3'>
                {Search()}
            </div>


            <div className='grid col-span-5 grid-rows-10'>

                <div className='row-span-9'>
                    {MyChats()}
                </div>

                <div>
                    {ChatBox()}
                </div>
            </div>

        </div>
    )
}

export default Ui