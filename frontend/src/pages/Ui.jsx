// {
// // import React, { useContext, useEffect, useState } from 'react'
// // import { useNavigate } from 'react-router-dom';
// // import Search from '../search/Search';
// // import MyChats from '../chats/MyChats';
// // import SingleChat from '../singleChat/SingleChat';
// // import { chatState } from '../context/chatProvider';
// // const Ui = () => {

// //     const { user } = chatState();
// //     const navigate = useNavigate();
// //     const [searchDrwer, setSearchDrawer] = useState(true);
// //     const [fetchAgain, setFetchAgain] = useState(false);
// //     const [showChatPage, setShowChatPage] = useState(false);

// //     useEffect(()=>{
// //         if(!user){
// //             navigate('/');
// //         }
// //     },[navigate])

// //     const skeleton = () => {
// //         return (
// //             <div className="w-full h-full bg-gray-300 rounded-sm shadow-sm animate-pulse dark:divide-gray-400 dark:border-gray-500 justify-center items-center flex flex-col">
// //                 <h1 className='font-mono text-center font-extrabold text-xl max-sm:text-[13px] '>Click On any Chat to talk with them </h1>
// //             </div>
// //         )
// //     }


// //     if (!user) {
// //         return (
// //             <div>
// //                 No User......
// //             </div>
// //         )
// //     }
// //     // Main Return
// //     return (
// //         <div className='w-[100%] flex flex-col h-screen'>            
// //             {/* Navbar */}
// //             <div className='bg-green-300 p-2 h-auto flex justify-between w-[100%]'>
// //                 <div className='font-extrabold text-2xl text-black '>CHAT SIDE</div>
// //                 <div>{Search()}</div>
// //             </div>

// //             <div className='grid grid-cols-10 w-full h-[90vh] gap-1 '>
// //                 {/* All Chats */}
// //                 <div className='col-span-3 w-full'>
// //                     {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setShowChatPage={setShowChatPage} />}
// //                 </div>

// //                 {/* Message Page */}
// //                 <div className={`col-span-7 w-full hide-scrollbar`} >
// //                     {showChatPage ?
// //                         <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> : skeleton()}
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default Ui
// }

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Search from "../search/Search";
import MyChats from "../chats/MyChats";
import SingleChat from "../singleChat/SingleChat";
import { chatState } from "../context/chatProvider";

const Ui = () => {
    const { user } = chatState();
    const navigate = useNavigate();

    const [fetchAgain, setFetchAgain] = useState(false);
    const [showChatPage, setShowChatPage] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const profileRef = useRef(null);

    // Redirect if user is not logged in
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // Close popup with Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowProfile(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Logout
    const logOut = () => {
        localStorage.removeItem("userInfo");
        setShowProfile(false);
        navigate("/");
        window.location.reload();
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-500">
                        Loading your chats...
                    </p>
                </div>
            </div>
        );
    }

    const userName = user.name || user.username || "User";

    return (
        <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-slate-100 text-slate-800">

            {/* Navbar */}
            <header className="relative z-30 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5 lg:px-7">

                {/* Logo */}
                <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-100 sm:h-11 sm:w-11">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                            ChatSide
                        </h1>
                        <p className="hidden text-xs text-slate-500 sm:block">
                            Stay connected, always.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="min-w-0 max-w-md flex-1">
                    <Search />
                </div>

                {/* Profile Button + Popup */}
                <div className="relative shrink-0" ref={profileRef}>

                    <button
                        type="button"
                        onClick={() =>
                            setShowProfile((previous) => !previous)
                        }
                        aria-label="Open profile menu"
                        aria-expanded={showProfile}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-sm ring-2 ring-indigo-100 transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:h-11 sm:w-11"
                        title={userName}
                    >
                        {userName.charAt(0).toUpperCase()}
                    </button>

                    {/* Popup */}
                    {showProfile && (
                        <div className="absolute right-0 top-14 z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/70">

                            {/* Profile information */}
                            <div className="bg-gradient-to-br from-indigo-50 to-white px-4 py-5">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-slate-900">
                                            {userName}
                                        </p>

                                        {user.email && (
                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                {user.email}
                                            </p>
                                        )}

                                        <p className="mt-1 text-xs font-medium text-emerald-600">
                                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-100" />

                            {/* Logout button */}
                            <div className="p-2">
                                <button
                                    type="button"
                                    onClick={logOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                        >
                                            <path d="M10 17l5-5-5-5" />
                                            <path d="M15 12H3" />
                                            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                                        </svg>
                                    </span>

                                    <span className="flex-1">
                                        Logout
                                        <span className="mt-0.5 block text-xs font-normal text-slate-400">
                                            Sign out of your account
                                        </span>
                                    </span>

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4 text-slate-400"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main layout */}
            <main className="min-h-0 flex-1 p-2 sm:p-3 lg:p-5">
                <div className="mx-auto flex h-full min-h-0 w-full max-w-[1800px] gap-2 sm:gap-4">

                    {/* Sidebar / chat list */}
                    <aside
                        className={`
                            min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl
                            border border-slate-200 bg-white shadow-sm
                            ${
                                showChatPage
                                    ? "hidden md:flex md:w-[300px] lg:w-[350px] xl:w-[380px]"
                                    : "flex w-full md:w-[300px] lg:w-[350px] xl:w-[380px]"
                            }
                            md:shrink-0
                        `}
                    >
                        <MyChats
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                            setShowChatPage={setShowChatPage}
                        />
                    </aside>

                    {/* Conversation area */}
                    <section
                        className={`
                            min-h-0 min-w-0 flex-1 flex-col overflow-hidden
                            rounded-2xl border border-slate-200 bg-white shadow-sm
                            ${
                                showChatPage
                                    ? "flex w-full"
                                    : "hidden md:flex"
                            }
                        `}
                    >
                        {showChatPage ? (
                            <>
                                {/* Mobile conversation header */}
                                <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 sm:px-4 md:hidden">

                                    <button
                                        type="button"
                                        onClick={() => setShowChatPage(false)}
                                        aria-label="Back to chats"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 active:scale-95"
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

                                    <div className="min-w-0">
                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Conversation
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            ChatSide messages
                                        </p>
                                    </div>
                                </div>

                                {/* Chat component */}
                                <div className="min-h-0 flex-1 overflow-hidden">
                                    <SingleChat
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </div>
                            </>
                        ) : (
                            /* Desktop empty state */
                            <div className="hidden min-h-0 flex-1 flex-col items-center justify-center bg-gradient-to-br from-white to-indigo-50/60 px-6 text-center md:flex">

                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-lg shadow-indigo-100 ring-1 ring-indigo-100 sm:h-24 sm:w-24">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-10 w-10 sm:h-12 sm:w-12"
                                    >
                                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-extrabold tracking-tight text-slate-800 sm:text-2xl">
                                    Your space to connect
                                </h2>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                                    Choose a conversation from your chats and start talking.
                                    Your messages are waiting for you.
                                </p>

                                <div className="mt-6 flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-medium text-indigo-600 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
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
