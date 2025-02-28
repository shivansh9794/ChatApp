import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider';
import axios, { Axios } from 'axios';
import Search from '../search/Search';

const Ui = () => {

    const { user, selectedChat, setSelectedChat } = chatState();
    console.log("user is:",user);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState();


    // useEffect(() => {
    //     console.log("getting msgs");
    //     fetchMessages();
    // }, [user])

    // Access Chat
    const accessChat = async (userId) => {
        try {

            console.log("token is :",user.token);
            

            const config = {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:8000/api/chat", {userId},config);
            setSelectedChat(data);

            console.log("chat fetched==>",data);

        } catch (error) {
            console.log(error);
            
        }
    }


    // fetch all msgs
    const fetchMessages = async () => {
        // if(!user) {console.log("no selected Chat")
        //  return;
        // }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)

            const { data } = await axios.get(`http://localhost:8000/api/message/${user._id}`, config
            )
            console.log("id is:", user._id);
            setMessages(data);
            setLoading(false);
            console.log("MsG--->", data);
        } catch (error) {
            console.log(error);
        }
    };

    

    // send message Handler
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");

                const { data } = await axios.post('http://localhost:8000/api/message', {
                    content: newMessage,
                    chatId: user._id,
                }, config);
                console.log(data);
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Typing Handlers
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

    // Loading Spinners
    const spinner = () => {
        return (
            <div className='w-full h-full'>
                Loading....
            </div>
        )
    }

    // Main Return
    return (
        <div className='bg-gray-100 w-full h-screen border-2 grid grid-cols-8 '>

            <div className='col-span-3'>
                {Search()}
            </div>

            {loading ? spinner() :
                (
                    <div className='col-span-5'>
                        <div>
                            <div class="w-full max-w-full flex-col items-end">
                                <input className="w-full bg-white placeholder:text-black text-black text-sm border border-slate-200 rounded-md px-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..."
                                    onChange={typingHandler}
                                    value={newMessage}
                                    onKeyDown={sendMessage}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Ui