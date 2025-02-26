import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatContext = createContext()


const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }
    }, [navigate])

    return (
        <ChatContext.Provider value={{ user, setUser }}>
            {children}
        </ChatContext.Provider>
    )
}

export const chatState = () => {
    useContext(ChatContext)
};

export default ChatProvider;