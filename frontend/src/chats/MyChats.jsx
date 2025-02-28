import React, { useState } from 'react'
import { chatState } from '../context/chatProvider'
import axios from 'axios';

const MyChats = () => {

  const { selectedChat, setSelectedChat,user,chats,setChats }=chatState();
  const [loggedUser,setLoggedUser]=useState();

  const fetchChats=async()=>{
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get("http://localhost:8000/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
        hello chats
    </div>
  )
}

export default MyChats