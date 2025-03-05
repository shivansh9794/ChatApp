import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import axios from 'axios';
import { getSender } from '../config/ChatLogics'

const MyChats = ({fetchAgain , setFetchAgain ,setShowChatPage}) => {

  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();
  const [loggedUser, setLoggedUser] = useState();

  // const fetchChats = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //       },
  //   };
  //     const { data } = await axios.get("http://localhost:8000/api/chat", config);
  //     console.log("All chts :", data);
  //     setChats(data);
  //     setFetchAgain(false);
  //   } catch (error) {
  //     console.log(error);
  //     setFetchAgain(true);
  //   }
  // }

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${(JSON.parse(localStorage.getItem("userInfo"))).token}`,
        },
      };
      const { data } = await axios.get("http://localhost:8000/api/chat", config);
      setChats(data);
      setFetchAgain(false);
    } catch (error) {
      console.log(error);
      setFetchAgain(true);
    }
  }

  if(!user) return
  else{
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain]);}
  

  return (
    <div className='bg-gray-300 w-full h-full border-b-2  border-r-2'>
      <div className='bg-gray-300 shadow-lg w-full p-2'>
        <h1 className='text-2xl'>My Chats</h1>
      </div>

      <div>
        {chats ? (
          <div>
            {
              chats?.map((chat) => {
                return (
                  <div className={`cursor-pointer py-5 rounded-lg p-2 m-2 ${selectedChat===chat?'bg-green-300':'bg-blue-50'}`}  onClick={()=>{setSelectedChat(chat), setShowChatPage(true)}} key={chat._id}>
                    <h1 className='text-xl text-black font-bold '>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</h1>
                  </div>
                )
              })
            }
          </div>
        ) : (
          <div>
            Loading.....
          </div>
        )
        }
      </div>
    </div >
  )
}

export default MyChats