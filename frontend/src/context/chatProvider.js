import { useContext, useState } from 'react'
import { createContext } from 'react'

const chatContext = createContext()


const chatProvider = ({ children }) => {

    const [user, setUser] = useState();

    return (
        <chatContext.Provider value={{user,setUser}}>
            {children}
        </chatContext.Provider>
    )
}

export const chatState = () => {
    useContext(chatContext)
};

export default chatProvider;