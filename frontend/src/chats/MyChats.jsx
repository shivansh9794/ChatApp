import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import axios from 'axios';

const MyChats = () => {

  const { user,selectedChat, setSelectedChat,chats,setChats }=chatState();
  const [loggedUser,setLoggedUser]=useState();
  console.log("user---token--->",user.token);
  

  const fetchChats=async()=>{
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get("http://localhost:8000/api/chat", config);
      console.log("haha",data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[])

  return (
    <div>
        hello chats
    </div>
  )
}

export default MyChats