import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import axios from 'axios';
import { getSender } from '../config/ChatLogics'
import { baseUrl } from '../config/KeyConfig';

const MyChats = ({ fetchAgain, setFetchAgain, setShowChatPage }) => {

  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();
  const [loggedUser, setLoggedUser] = useState();
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groupUserList,setGroupUserList]=useState([]);

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
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
    }, [fetchAgain]);
  }




  return (
    <div className='bg-gray-300 w-full h-full border-b-2  border-r-2'>
      <div className='bg-gray-300 shadow-lg w-full p-2 flex justify-between'>
        <h1 className='text-xl font-bold'>My Chats</h1>
        <button className='p-2 bg-green-500 rounded-2xl font-semibold cursor-pointer hover:bg-green-300' onClick={() => setOpenAddGroup((prev) => !prev)}>Create new Group</button>
      </div>
      {openAddGroup &&
        <div className='z-50 bg-gray-400 absolute top-31 left-0.5 w-[30%] h-[300px] rounded-xl'>
          <h1 className='font-bold text-xl font-sans p-3 text-green-700'>Add to group</h1>
          <div className='overflow-y-auto max-h-[250px]'>
            {chats
              ?.filter(chat => !chat.isGroupChat) //  only including non-group chats
              .map(chat => {
                return (
                  <div
                    className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${selectedChat === chat ? 'bg-green-300' : 'bg-blue-50'
                      }`}
                    onClick={() => {
                      setSelectedChat(chat);
                      // setShowChatPage(true);
                    }}
                    
                    key={chat._id}
                  >
                    <h1 className="text-xl text-black font-bold">
                      {getSender(loggedUser, chat.users)}
                    </h1>
                  </div>
                );
              })}
          </div>
        </div>
      }
      {/* All the Chats */}
      <div>
        {chats ? (
          <div>
            {
              chats?.map((chat) => {
                return (
                  <div className={`cursor-pointer py-3 rounded-lg p-2 m-2 ${selectedChat === chat ? 'bg-green-300' : 'bg-blue-50'}`} onClick={() => { setSelectedChat(chat), setShowChatPage(true) }} key={chat._id}>
                    <h1 className='text-xl text-black font-bold '>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</h1>
                    <h6 className={`${(chat?.latestMessage?.sender?._id == user?._id) ? "text-green-700" : "text-blue-800"}`}>{chat?.latestMessage?.content}</h6>
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