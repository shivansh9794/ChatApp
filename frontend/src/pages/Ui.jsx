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

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

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
        <div className="min-w-0 flex-1 max-w-md">
          <Search />
        </div>

        {/* Profile */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-indigo-50 sm:h-10 sm:w-10"
          title={user.name || "Your profile"}
        >
          {user.name?.charAt(0)?.toUpperCase() || "U"}
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
              setShowChatPage={(value) => {
                setShowChatPage(value);
              }}
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

                {/* Chat component must fill remaining height */}
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