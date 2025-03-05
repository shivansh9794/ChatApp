import React, { useEffect, useRef, useState } from 'react';
import { chatState } from '../context/chatProvider';
import axios from 'axios';
import io from 'socket.io-client'
import ChatComponent from '../components/ChatComponent'

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { user, setUser, selectedChat } = chatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);


    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("userInfo"));
        socket = io(ENDPOINT);
        socket.emit("setup", data);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);


    // Fetch messages when selectedChat changes
    const fetchMessages = async () => {
        if (!selectedChat) return; // No chat selected, exit early

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:8000/api/message/${selectedChat._id}`, config);
            setMessages(data);  // Update messages state with fetched data
            console.log('all msgs -->', data);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]); // Re-fetch messages when selectedChat changes

    // receive message from socket
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })

    // Send message handler
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage.trim()) {

            socket.emit('stop typing', selectedChat._id)

            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post('http://localhost:8000/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,  // Make sure you send the chat ID properly
                },
                    config
                );

                // After successfully sending the message, update messages state
                setMessages(prevMessages => [...prevMessages, data]);
                setNewMessage("");  // Clear the input field
                console.log(data);
                socket.emit("new message", data); // socket send data
            } catch (error) {
                console.log("Error sending message:", error);
            }
        }
    };

    // Handle typing input
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 1000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <div className="bg-gray-300 border-l-2 border-r-2 border-b-2 h-[91vh] w-full flex flex-col justify-end">

            {/* Message Container */}
            <ChatComponent messages={messages} user={user}></ChatComponent>

            {/* Typing Indicator */}
            {istyping ? (<div className='font-bold text-black font-mono bg-transparent w-auto '>Typing...</div>) : (<></>)}

            {/* Message Input */}
            <div className="w-full max-w-full flex-col items-end mt-4">
                <input
                    className="w-full placeholder:text-black text-black text-sm border border-slate-200 bg-gray-400 px-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Type here..."
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={sendMessage}  // Send message when Enter is pressed
                />
            </div>
        </div>


    );
};

export default ChatBox;