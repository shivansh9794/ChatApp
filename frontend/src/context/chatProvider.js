import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

const ChatContext = createContext()


const chatProvider = ({ children }) => {

    const [user, setUser] = useState();

    useEffect(()=>{
        localStorage.getItem()
    },[])

    return (
        <ChatContext.Provider value={{user,setUser}}>
            {children}
        </ChatContext.Provider>
    )
}

export const chatState = () => {
    useContext(ChatContext)
};

export default chatProvider;