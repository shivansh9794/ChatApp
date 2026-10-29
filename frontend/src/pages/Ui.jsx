// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import Search from '../search/Search';
// import MyChats from '../chats/MyChats';
// import SingleChat from '../singleChat/SingleChat';
// import { chatState } from '../context/chatProvider';

// const Ui = () => {

//     const { user } = chatState();
//     const navigate = useNavigate();
//     const [searchDrwer, setSearchDrawer] = useState(true);
//     const [fetchAgain, setFetchAgain] = useState(false);
//     const [showChatPage, setShowChatPage] = useState(false);

//     useEffect(()=>{
//         if(!user){
//             navigate('/');
//         }
//     },[navigate])

//     const skeleton = () => {
//         return (
//             <div className="w-full h-full bg-gray-300 rounded-sm shadow-sm animate-pulse dark:divide-gray-400 dark:border-gray-500 justify-center items-center flex flex-col">
//                 <h1 className='font-mono text-center font-extrabold text-xl max-sm:text-[13px] '>Click On any Chat to talk with them </h1>
//             </div>
//         )
//     }


//     if (!user) {
//         return (
//             <div>
//                 No User......
//             </div>
//         )
//     }
//     // Main Return
//     return (
//         <div className='w-[100%] flex flex-col h-screen'>            
//             {/* Navbar */}
//             <div className='bg-green-300 p-2 h-auto flex justify-between w-[100%]'>
//                 <div className='font-extrabold text-2xl text-black '>CHAT SIDE</div>
//                 <div>{Search()}</div>
//             </div>

//             <div className='grid grid-cols-10 w-full h-[90vh] gap-1 '>
//                 {/* All Chats */}
//                 <div className='col-span-3 w-full'>
//                     {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setShowChatPage={setShowChatPage} />}
//                 </div>

//                 {/* Message Page */}
//                 <div className={`col-span-7 w-full hide-scrollbar`} >
//                     {showChatPage ?
//                         <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> : skeleton()}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Ui



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Search from '../search/Search';
import MyChats from '../chats/MyChats';
import SingleChat from '../singleChat/SingleChat';
import { chatState } from '../context/chatProvider';

const Ui = () => {
    const { user } = chatState();
    const navigate = useNavigate();

    const [fetchAgain, setFetchAgain] = useState(false);
    const [showChatPage, setShowChatPage] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center
                bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 rounded-full
                        border-4 border-indigo-200 border-t-indigo-600
                        animate-spin" />
                    <p className="text-sm font-medium text-slate-500">
                        Loading your chats...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden
            bg-slate-100 text-slate-800">

            {/* Modern Navbar */}
            <header className="z-20 flex h-[72px] shrink-0 items-center
                justify-between gap-4 border-b border-slate-200
                bg-white px-4 sm:px-6 shadow-sm">

                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center
                        justify-center rounded-xl
                        bg-gradient-to-br from-indigo-500 to-violet-600
                        text-white shadow-md shadow-indigo-200">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8
                                8.5 8.5 0 0 1-7.6 4.7
                                8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7
                                a8.4 8.4 0 0 1-.9-3.8
                                8.5 8.5 0 0 1 4.7-7.6
                                8.4 8.4 0 0 1 3.8-.9h.5
                                a8.5 8.5 0 0 1 8 8v.5Z"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-lg sm:text-xl
                            font-extrabold tracking-tight text-slate-900">
                            ChatSide
                        </h1>
                        <p className="hidden sm:block text-xs text-slate-500">
                            Stay connected, always.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        {Search()}
                    </div>

                    <div className="hidden sm:flex h-10 w-10 shrink-0
                        items-center justify-center rounded-full
                        bg-indigo-100 text-indigo-700 font-bold
                        ring-2 ring-indigo-50"
                        title={user.name || 'Your profile'}>

                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            {/* Main Chat Layout */}
            <main className="flex-1 min-h-0 p-2 sm:p-4 lg:p-5">
                <div className="mx-auto flex h-full max-w-[1800px]
                    gap-3 sm:gap-4">

                    {/* Chat Sidebar */}
                    <aside className={`
                        ${showSidebar ? 'flex' : 'hidden'}
                        ${showChatPage ? 'w-full md:w-[320px] lg:w-[360px]' : 'w-full md:w-[320px] lg:w-[360px]'}
                        shrink-0 flex-col overflow-hidden
                        rounded-2xl border border-slate-200
                        bg-white shadow-sm
                        ${showChatPage ? 'md:flex' : 'md:flex'}
                    `}>

                        <div className="flex items-center justify-between
                            border-b border-slate-100 px-4 py-4">

                            <div>
                                <h2 className="text-lg font-bold
                                    text-slate-900">
                                    Messages
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Your conversations
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center
                                justify-center rounded-xl bg-indigo-50
                                text-indigo-600">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                >
                                    <path d="M8 12h8M12 8v8" />
                                    <circle cx="12" cy="12" r="9" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto
                            p-2">
                            <MyChats
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                setShowChatPage={(value) => {
                                    setShowChatPage(value);
                                    setShowSidebar(true);
                                }}
                            />
                        </div>
                    </aside>

                    {/* Conversation Area */}
                    <section className={`
                        ${showChatPage ? 'flex' : 'hidden md:flex'}
                        flex-1 min-w-0 flex-col overflow-hidden
                        rounded-2xl border border-slate-200
                        bg-white shadow-sm
                    `}>

                        {showChatPage ? (
                            <>
                                {/* Mobile chat navigation */}
                                <div className="flex items-center gap-3
                                    border-b border-slate-100 bg-white
                                    px-4 py-3 md:hidden">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSidebar(true);
                                            setShowChatPage(false);
                                        }}
                                        className="flex h-9 w-9 items-center
                                            justify-center rounded-xl
                                            text-slate-600 hover:bg-slate-100
                                            transition"
                                        aria-label="Back to chats"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-5 w-5"
                                        >
                                            <path d="m15 18-6-6 6-6" />
                                        </svg>
                                    </button>

                                    <span className="text-sm font-semibold
                                        text-slate-700">
                                        Conversation
                                    </span>
                                </div>

                                <div className="flex-1 min-h-0 overflow-hidden">
                                    <SingleChat
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex flex-1
                                flex-col items-center justify-center
                                bg-gradient-to-br from-white to-indigo-50/50
                                px-6 text-center">

                                <div className="mb-6 flex h-24 w-24
                                    items-center justify-center
                                    rounded-3xl bg-white text-indigo-600
                                    shadow-lg shadow-indigo-100
                                    ring-1 ring-indigo-100">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-12 w-12"
                                    >
                                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8
                                            8.5 8.5 0 0 1-7.6 4.7
                                            8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7
                                            a8.4 8.4 0 0 1-.9-3.8
                                            8.5 8.5 0 0 1 4.7-7.6
                                            8.4 8.4 0 0 1 3.8-.9h.5
                                            a8.5 8.5 0 0 1 8 8v.5Z"
                                        />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-extrabold
                                    tracking-tight text-slate-800">
                                    Your space to connect
                                </h2>

                                <p className="mt-3 max-w-sm text-sm
                                    leading-6 text-slate-500">
                                    Choose a conversation from your chats
                                    and start talking. Your messages are
                                    waiting for you.
                                </p>

                                <div className="mt-6 flex items-center gap-2
                                    rounded-full border border-indigo-100
                                    bg-white px-4 py-2 text-xs font-medium
                                    text-indigo-600 shadow-sm">
                                    <span className="h-2 w-2 rounded-full
                                        bg-emerald-500" />
                                    Ready to chat
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Ui;
