import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState([]);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))  // Seting a user in a localstorage
        setUser(userInfo); // setting the user in a context
        if (!userInfo) { navigate('/') } // navigating to login page if there is No user Logged In 
    }, [navigate])

    return (
        <ChatContext.Provider value={{
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            notification,
            setNotification,
            chats,
            setChats,
          }}>
            {children}
        </ChatContext.Provider>
    )
}

export const chatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;