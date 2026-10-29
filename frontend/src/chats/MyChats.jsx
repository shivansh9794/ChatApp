// import React, { useEffect, useState } from 'react'
// import { chatState } from '../context/chatProvider'
// import axios from 'axios';
// import io from 'socket.io-client'
// import { getSender, getSenderId } from '../config/ChatLogics'
// import { baseUrl } from '../config/KeyConfig';

// const ENDPOINT = baseUrl;
// var socket;
// const MyChats = ({ fetchAgain, setFetchAgain, setShowChatPage }) => {

//   const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();
//   const [loggedUser, setLoggedUser] = useState();
//   const [openAddGroup, setOpenAddGroup] = useState(false);
//   const [groupUserList, setGroupUserList] = useState([]);
//   const [groupName, setGropuName] = useState('');
//   const [totalUnreadCount, setTotalUnreadCount] = useState(0);

//   useEffect(() => {
//     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
//   }, []);

//   const addToGroupUserList = (chatId) => {
//     setGroupUserList((prevList) =>
//       prevList.includes(chatId)
//         ? prevList.filter(id => id !== chatId)
//         : [...prevList, chatId]
//     );
//   };

//   const createGroup = async () => {
//     try {

//       const payload = {
//         name: groupName,
//         users: JSON.stringify(groupUserList), // 👈 this is crucial!
//       };


//       const config = {
//         headers: {
//           Authorization: `Bearer ${(JSON.parse(localStorage.getItem("userInfo"))).token}`,
//         },
//       };

//       const { data } = await axios.post(`${baseUrl}/api/chat/group`, payload, config);
//       fetchChats();
//       setOpenAddGroup(false);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // Fetch All Chats
//   const fetchChats = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${(JSON.parse(localStorage.getItem("userInfo"))).token}`,
//         },
//       };
//       const { data } = await axios.get(`${baseUrl}/api/chat`, config);
//       setChats(data);
//       setFetchAgain(false);
//     } catch (error) {
//       console.log(error);
//       setFetchAgain(true);
//     }
//   }
//   if (!user) return
//   else {
//     useEffect(() => {
//       let data = JSON.parse(localStorage.getItem("userInfo"));
//       socket = io(ENDPOINT);
//       socket.emit("setupChat", data);
//       fetchChats();
//     }, [fetchAgain]);
//   }

//   // Adding new Notification
//   useEffect(() => {
//     if (!socket) return;
//     socket.on("increment unseen", ({ chatId }) => {
//       setChats((prevChats) =>
//         prevChats.map((chat) =>
//           chat._id === chatId
//             ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
//             : chat
//         )
//       );
//       fetchChats();
//     });
//     return () => {
//       socket.off("increment unseen");
//     };
//   }, [socket, user]);

//   // Clearing Unread Messages
//   useEffect(() => {
//     if (!socket) return;
//     socket.on("update unread count", ({ chatId, count }) => {
//       setChats((prevChats) =>
//         prevChats.map((chat) =>
//           chat._id === chatId
//             ? { ...chat, unreadCount: (chat.unreadCount = 0) }
//             : chat
//         )
//       );
//       fetchChats();
//     });
//     return () => {
//       socket.off("update unread count");
//     };
//   }, [socket]);

//   useEffect(() => {
//     const total = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//     setTotalUnreadCount(total);
//     console.log(totalUnreadCount);
//   }, [chats]);


//   return (
//     <div className='bg-gray-300 w-full h-auto border-b-2  border-r-2'>

//       {/* Chats Header */}
//       <div className='bg-gray-300 shadow-lg w-full p-2 flex justify-between'>
//         <h1 className='text-xl font-bold'>My Chats</h1>
//         <div className='flex justify-center items-center gap-2'>
//           <button className='p-2 bg-green-500 rounded-2xl font-semibold cursor-pointer hover:bg-green-300' onClick={() => setOpenAddGroup((prev) => !prev)}>Create new Group</button>
//           {totalUnreadCount!=0 ? <h2 className='font-bold text-white rounded-full p-1 bg-red-600'>{totalUnreadCount}</h2> :''}
//         </div>
        
//       </div>

//       {/* Open Add to group Toggle */}
//       {openAddGroup && <div className='z-50 bg-gray-400 absolute top-31 left-[40%] w-[30%] h-[400px] rounded-xl flex flex-col justify-start items-center p-4'>
//         <h1 className='font-bold text-xl font-sans text-green-700 mb-2'>Create New Group</h1>

//         <h2 className='text-md font-bold text-blue-900 self-start'>Enter Group Name</h2>
//         {/* Group Name Input */}
//         <input
//           type='text'
//           value={groupName}
//           onChange={(e) => setGropuName(e.target.value)}
//           className='w-full p-2 mb-3 rounded-md border font-bold border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
//         />

//         {/* Select Users Heading */}
//         <h2 className='text-md font-semibold text-blue-900 self-start pl-2'>Select Users</h2>

//         {/* User List */}
//         <div className='overflow-y-auto hide-scrollbar w-full h-[199px] mt-1'>
//           {chats
//             ?.filter(chat => !chat.isGroupChat)
//             .map(chat => (
//               <div
//                 key={chat._id}
//                 className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${groupUserList.includes(getSenderId(loggedUser, chat.users)) ? 'bg-green-300' : 'bg-blue-100'
//                   }`}
//                 onClick={() => addToGroupUserList(getSenderId(loggedUser, chat.users))}
//               >
//                 <h1
//                   className={`text-xl font-bold ${groupUserList.includes(chat._id) ? 'text-green-800' : 'text-black'
//                     }`}
//                 >
//                   {getSender(loggedUser, chat.users)}
//                 </h1>
//               </div>
//             ))}
//         </div>

//         <div className='flex justify-end w-full gap-2'>
//           <button className='mt-4 w-[50%] bg-red-800 h-10 rounded-lg hover:bg-red-600 font-bold text-white' onClick={() => setOpenAddGroup((prev) => !prev)}>
//             Cancel
//           </button>
//           <button className='w-[50%] mt-4 bg-green-800 h-10 rounded-lg hover:bg-green-600 font-bold text-white' onClick={() => createGroup()}>
//             Create A Group
//           </button>
//         </div>
//         {/* Create Button */}</div>}

//       {/* All the Chats */}
//       <div>
//         {chats ? (
//           <div className='overflow-y-auto hide-scrollbar h-[81vh] w-full'>
//             {
//               chats?.map((chat) => {
//                 return (
//                   <div
//                     onClick={() => { setSelectedChat(chat), setShowChatPage(true) }} key={chat._id}
//                     className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${selectedChat?._id === chat?._id ? 'bg-green-300' : 'bg-blue-50'} flex justify-between items-center`}
//                   >

//                     <div>
//                       <h1 className='text-xl text-black font-bold '>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</h1>
//                       <h6 className={`${(chat?.latestMessage?.sender?._id === loggedUser?._id) ? "text-green-700" : "text-blue-800"}`}>{chat?.latestMessage?.content}</h6>
//                     </div>
//                     <div>
//                       {chat?.unreadCount > 0 && (
//                         <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
//                           {chat.unreadCount}
//                         </span>
//                       )}
//                     </div>

//                   </div>
//                 )
//               })
//             }
//           </div>
//         ) : (

//           <div className='w-full h-[80vh] flex items-center justify-center'>
//             <h1>Loading.....</h1>
//           </div>
//         )
//         }
//       </div>

//     </div >
//   )
// }

// export default MyChats


import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { chatState } from "../context/chatProvider";
import { getSender, getSenderId } from "../config/ChatLogics";
import { baseUrl } from "../config/KeyConfig";

const MyChats = ({ fetchAgain, setFetchAgain, setShowChatPage }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  } = chatState();

  const [loggedUser, setLoggedUser] = useState(null);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groupUserList, setGroupUserList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Load logged-in user
  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("userInfo") || "null"
      );
      setLoggedUser(storedUser);
    } catch (error) {
      console.error("Unable to read user information:", error);
      setLoggedUser(null);
    }
  }, []);

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    let storedUser;

    try {
      storedUser = JSON.parse(
        localStorage.getItem("userInfo") || "null"
      );
    } catch {
      storedUser = null;
    }

    if (!storedUser?.token) {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: "Bearer " + storedUser.token,
        },
      };

      const { data } = await axios.get(
        baseUrl + "/api/chat",
        config
      );

      setChats(Array.isArray(data) ? data : []);
      setFetchAgain(false);
    } catch (error) {
      console.error(
        "Failed to fetch chats:",
        error.response?.data || error.message
      );
      setFetchAgain(false);
    } finally {
      setLoading(false);
    }
  }, [setChats, setFetchAgain]);

  // Refresh chats when needed
  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setLoading(false);
    }
  }, [user, fetchAgain, fetchChats]);

  // Socket.IO notifications
  useEffect(() => {
    if (!user || !loggedUser) return;

    const socket = io(baseUrl);

    socket.emit("setupChat", loggedUser);

    const handleNewMessage = () => {
      fetchChats();
    };

    const handleUnreadUpdate = ({ chatId, count }) => {
      setChats((previousChats) =>
        previousChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, unreadCount: count ?? 0 }
            : chat
        )
      );

      fetchChats();
    };

    socket.on("increment unseen", handleNewMessage);
    socket.on("update unread count", handleUnreadUpdate);

    return () => {
      socket.off("increment unseen", handleNewMessage);
      socket.off("update unread count", handleUnreadUpdate);
      socket.disconnect();
    };
  }, [user, loggedUser, fetchChats, setChats]);

  // Calculate total unread messages
  useEffect(() => {
    const total = chats.reduce(
      (sum, chat) => sum + (Number(chat.unreadCount) || 0),
      0
    );

    setTotalUnreadCount(total);
  }, [chats]);

  // Select or deselect group members
  const addToGroupUserList = (userId) => {
    if (!userId) return;

    setGroupUserList((previousList) =>
      previousList.includes(userId)
        ? previousList.filter((id) => id !== userId)
        : [...previousList, userId]
    );
  };

  // Close group modal
  const closeGroupModal = () => {
    if (creatingGroup) return;

    setOpenAddGroup(false);
    setGroupName("");
    setGroupUserList([]);
    setError("");
  };

  // Create group according to the EXISTING backend API
  const createGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName) {
      setError("Please enter a group name.");
      return;
    }

    if (groupUserList.length < 2) {
      setError("Select at least two users to create a group.");
      return;
    }

    let storedUser;

    try {
      storedUser = JSON.parse(
        localStorage.getItem("userInfo") || "null"
      );
    } catch {
      storedUser = null;
    }

    if (!storedUser?.token) {
      setError("Please log in again.");
      return;
    }

    try {
      setCreatingGroup(true);
      setError("");

      // Backend expects groupName and userList
      const payload = {
        groupName: trimmedName,
        userList: JSON.stringify(groupUserList),
      };

      const config = {
        headers: {
          Authorization: "Bearer " + storedUser.token,
        },
      };

      const { data } = await axios.post(
        baseUrl + "/api/chat/group",
        payload,
        config
      );

      console.log("Group created successfully:", data);

      setGroupName("");
      setGroupUserList([]);
      setOpenAddGroup(false);
      setError("");

      await fetchChats();
    } catch (error) {
      console.error(
        "Create group error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to create the group. Please try again."
      );
    } finally {
      setCreatingGroup(false);
    }
  };

  // Filter chats
  const filteredChats = chats.filter((chat) => {
    const chatTitle = chat.isGroupChat
      ? chat.chatName
      : loggedUser
        ? getSender(loggedUser, chat.users)
        : "";

    return (chatTitle || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  });

  if (!user) return null;

  return (
    <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">

      {/* Header */}
      <header className="shrink-0 border-b border-gray-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              My Chats
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Your recent conversations
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {totalUnreadCount > 0 && (
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-red-100 px-2 text-sm font-bold text-red-600">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setError("");
                setOpenAddGroup(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 sm:px-4"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span className="hidden sm:inline">New Group</span>
              <span className="sm:hidden">Group</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path
              d="m16 16 4 4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </header>

      {/* Chats list */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Recent conversations
          </p>
          <span className="text-xs text-gray-400">
            {filteredChats.length} chats
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 p-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <svg
                className="h-8 w-8 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-8 6 3-3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v10a3 3 0 0 0 2 3Z"
                />
              </svg>
            </div>

            <h3 className="font-semibold text-gray-800">
              {search ? "No matching chats" : "No conversations yet"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              {search
                ? "Try searching with a different name."
                : "Start a conversation or create a group to get going."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const unreadCount = Number(chat.unreadCount) || 0;

              const title = chat.isGroupChat
                ? chat.chatName
                : getSender(loggedUser, chat.users);

              const isOwnMessage =
                chat.latestMessage?.sender?._id === loggedUser?._id;

              return (
                <button
                  key={chat._id}
                  type="button"
                  onClick={() => {
                    setSelectedChat(chat);
                    setShowChatPage(true);
                  }}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-2xl p-3 text-left transition duration-200 ${
                    isSelected
                      ? "bg-indigo-50 ring-1 ring-indigo-100"
                      : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm sm:h-12 sm:w-12">
                    {(title || "?").charAt(0).toUpperCase()}

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Chat details */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h2
                        className={`truncate text-sm ${
                          unreadCount > 0
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-800"
                        }`}
                      >
                        {title || "Unknown chat"}
                      </h2>

                      {chat.isGroupChat && (
                        <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                          GROUP
                        </span>
                      )}
                    </div>

                    <p
                      className={`truncate text-xs ${
                        unreadCount > 0
                          ? "font-semibold text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {chat.latestMessage ? (
                        <>
                          {isOwnMessage && (
                            <span className="font-medium text-indigo-600">
                              You:{" "}
                            </span>
                          )}
                          {chat.latestMessage.content || "Attachment"}
                        </>
                      ) : (
                        <span className="italic text-gray-400">
                          Start a conversation
                        </span>
                      )}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create group modal */}
      {openAddGroup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={closeGroupModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-group-title"
            className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
              <div>
                <h2
                  id="create-group-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Create a group
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Bring everyone into one conversation
                </p>
              </div>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={closeGroupModal}
                disabled={creatingGroup}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="min-h-0 space-y-4 overflow-y-auto p-4 sm:p-5">
              <div>
                <label
                  htmlFor="groupName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Group name
                </label>

                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="e.g. College Friends"
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Select members
                  </label>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                    {groupUserList.length} selected
                  </span>
                </div>

                <div className="max-h-60 space-y-1 overflow-y-auto rounded-xl border border-gray-100 p-2">
                  {chats
                    .filter((chat) => !chat.isGroupChat)
                    .map((chat) => {
                      const memberId = getSenderId(loggedUser, chat.users);
                      const memberName = getSender(loggedUser, chat.users);
                      const isChecked = groupUserList.includes(memberId);

                      return (
                        <button
                          key={chat._id}
                          type="button"
                          onClick={() => addToGroupUserList(memberId)}
                          className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                            isChecked
                              ? "bg-indigo-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600">
                            {(memberName || "?").charAt(0).toUpperCase()}
                          </span>

                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                            {memberName || "Unknown user"}
                          </span>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              isChecked
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  d="m5 12 4 4L19 6"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      );
                    })}

                  {chats.filter((chat) => !chat.isGroupChat).length === 0 && (
                    <p className="px-3 py-8 text-center text-sm text-gray-500">
                      Start individual chats before creating a group.
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 gap-3 border-t border-gray-100 bg-gray-50/70 p-3 sm:p-4">
              <button
                type="button"
                onClick={closeGroupModal}
                disabled={creatingGroup}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 sm:px-4"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={creatingGroup}
                onClick={createGroup}
                className="flex-1 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
              >
                {creatingGroup ? "Creating..." : "Create group"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyChats;
