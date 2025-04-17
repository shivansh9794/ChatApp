import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import axios from 'axios';
import io from 'socket.io-client'
import { getSender } from '../config/ChatLogics'
import { baseUrl } from '../config/KeyConfig';

const ENDPOINT = baseUrl;
var socket;
const MyChats = ({ fetchAgain, setFetchAgain, setShowChatPage }) => {

  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();
  const [loggedUser, setLoggedUser] = useState();
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groupUserList, setGroupUserList] = useState([]);
  const [groupName,setGropuName]=useState('');

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  },[]);

  const addToGroupUserList = (chatId) => {
    setGroupUserList((prevList) =>
      prevList.includes(chatId)
        ? prevList.filter(id => id !== chatId)
        : [...prevList, chatId]
    );
  };

  const createGroup=async()=>{
    try {

      const payload = {
        name: groupName,
        users: JSON.stringify(groupUserList), // 👈 this is crucial!
      };


      const config = {
        headers: {
          Authorization: `Bearer ${(JSON.parse(localStorage.getItem("userInfo"))).token}`,
        },
      };
      
      const { data } = await axios.post(`${baseUrl}/api/chat/group`,payload,config);
      fetchChats();
      setOpenAddGroup(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch All Chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${(JSON.parse(localStorage.getItem("userInfo"))).token}`,
        },
      };
      const { data } = await axios.get(`${baseUrl}/api/chat`, config);
      setChats(data);
      setFetchAgain(false);
    } catch (error) {
      console.log(error);
      setFetchAgain(true);
    }
  }
  if (!user) return
  else {
    useEffect(() => {
      let data = JSON.parse(localStorage.getItem("userInfo"));
      socket = io(ENDPOINT);
      socket.emit("setupChat", data);
      fetchChats();
    }, [fetchAgain]);
  }

  // Adding new Notification
  useEffect(() => {
    if (!socket) return;
    socket.on("increment unseen", ({ chatId }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
            : chat
        )
      );
      fetchChats();
    });
    return () => {
      socket.off("increment unseen");
    };
  }, [socket, user]);

  // Clearing Unread Messages
  useEffect(() => {
    if (!socket) return;
    socket.on("update unread count", ({ chatId, count }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, unreadCount: (chat.unreadCount = 0) }
            : chat
        )
      );
      fetchChats();
    });
    return () => {
      socket.off("update unread count");
    };
  }, [socket]);


  return (
    <div className='bg-gray-300 w-full h-full border-b-2  border-r-2'>

      {/* Chats Header */}
      <div className='bg-gray-300 shadow-lg w-full p-2 flex justify-between'>
        <h1 className='text-xl font-bold'>My Chats</h1>
        <button className='p-2 bg-green-500 rounded-2xl font-semibold cursor-pointer hover:bg-green-300' onClick={() => setOpenAddGroup((prev) => !prev)}>Create new Group</button>
      </div>

      {/* Open Add to group Toggle */}
      {openAddGroup &&
        
        <div className='z-50 bg-gray-400 absolute top-31 left-[40%] w-[30%] h-[400px] rounded-xl flex flex-col justify-start items-center p-4'>
          <h1 className='font-bold text-xl font-sans text-green-700 mb-2'>Create New Group</h1>

          <h2 className='text-md font-bold text-blue-900 self-start'>Enter Group Name</h2>
          {/* Group Name Input */}
          <input
            type='text'
            value={groupName}
            onChange={(e)=>setGropuName(e.target.value)}
            className='w-full p-2 mb-3 rounded-md border font-bold border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          {/* Select Users Heading */}
          <h2 className='text-md font-semibold text-blue-900 self-start pl-2'>Select Users</h2>

          {/* User List */}
          <div className='overflow-y-auto hide-scrollbar w-full h-[199px] mt-1'>
            {chats
              ?.filter(chat => !chat.isGroupChat)
              .map(chat => (
                <div
                  key={chat._id}
                  className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${groupUserList.includes(chat._id) ? 'bg-green-300' : 'bg-blue-100'
                    }`}
                  onClick={() => addToGroupUserList(getSender(loggedUser, chat.users))}
                >
                  <h1
                    className={`text-xl font-bold ${groupUserList.includes(chat._id) ? 'text-green-800' : 'text-black'
                      }`}
                  >
                    {getSender(loggedUser, chat.users)}
                  </h1>
                </div>
              ))}
          </div>

          <div className='flex justify-end w-full gap-2'>
            <button className='mt-4 w-[50%] bg-red-800 h-10 rounded-lg hover:bg-red-600 font-bold text-white' onClick={() => setOpenAddGroup((prev) => !prev)}>
              Cancel
            </button>
            <button className='w-[50%] mt-4 bg-green-800 h-10 rounded-lg hover:bg-green-600 font-bold text-white' onClick={()=>createGroup()}>
              Create A Group
            </button>
          </div>
          {/* Create Button */}

        </div>

      }

      {/* All the Chats */}
      <div>
        {chats ? (
          <div>
            {
              chats?.map((chat) => {
                return (
                  <div
                    onClick={() => { setSelectedChat(chat), setShowChatPage(true) }} key={chat._id}
                    className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${selectedChat?._id === chat?._id ? 'bg-green-300' : 'bg-blue-50'} flex justify-between items-center`}
                  >

                    <div>
                      <h1 className='text-xl text-black font-bold '>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</h1>
                      <h6 className={`${(chat?.latestMessage?.sender?._id === loggedUser?._id) ? "text-green-700" : "text-blue-800"}`}>{chat?.latestMessage?.content}</h6>
                    </div>
                    <div>
                      {chat?.unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                  </div>
                )
              })
            }
          </div>
        ) : (

          <div className='w-full h-[80vh] flex items-center justify-center'>
            <h1>Loading.....</h1>
          </div>
        )
        }
      </div>

    </div >
  )
}

export default MyChats