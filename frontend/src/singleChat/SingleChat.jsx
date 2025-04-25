import React, { useEffect, useRef, useState } from 'react';
import { chatState } from '../context/chatProvider';
import axios from 'axios';
import io from 'socket.io-client'
import ChatComponent from '../components/ChatComponent'
import { baseUrl } from '../config/KeyConfig';
import VideoCall from './VideoCall'

const ENDPOINT = baseUrl;
var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { user, setUser, selectedChat } = chatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState();
    const [showFileInput, setShowFileInput] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    let Userdata;

    useEffect(() => {
        Userdata = JSON.parse(localStorage.getItem("userInfo"));
        socket = io(ENDPOINT);
        socket.emit("setup", Userdata);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);



    // Fetch messages when selectedChat changes
    const fetchMessages = async () => {

        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${baseUrl}/api/message/${selectedChat._id}`, config);
            setMessages(data);  // Update messages state with fetched data
            console.log('all msgs -->', data);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log("Error fetching messages:", error);
        }
    };

    // Set mark as seen when we refetch the message 
    useEffect(() => {
        Userdata = JSON.parse(localStorage.getItem("userInfo"));
        socket.emit("mark seen", { "chatId": selectedChat._id, "userId": Userdata?._id })
        // console.log("Hiii")
    }, [messages]);

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
    });




    let [previewUrl, setPreview] = useState(null);
    useEffect(() => {
        if (file) {
            previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file]);

    // Send message handler
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage.trim()) {

            const formData = new FormData();
            formData.append("chatId", selectedChat._id);
            formData.append("content", newMessage);
            if (file) { formData.append("file", file) }

            socket.emit('stop typing', selectedChat._id)

            try {
                const config = {
                    headers: {
                        // "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post(`${baseUrl}/api/message`, formData, config)
                setMessages(prevMessages => [...prevMessages, data]);
                setNewMessage("");
                setFile('');
                setShowFileInput(false);
                socket.emit("new message", data); // socket to send data
                setFetchAgain();
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

    let SenderName = "";
    let chatId = 0;
    if (selectedChat.isGroupChat == true) {
        SenderName = selectedChat.chatName;
        chatId = selectedChat._id;
    }
    else if (selectedChat?.users[1]?._id == user?._id) {
        SenderName = selectedChat?.users[0].name;
        chatId = selectedChat._id;
    }
    else if (selectedChat?.users[0]?._id == user?._id) {
        SenderName = selectedChat?.users[1]?.name;
        chatId = selectedChat?._id;
    }
    else {
        SenderName = "Reload page to Load Name"
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const toggleFileInput = () => {
        setShowFileInput((prev) => !prev);
    };

    return (
        <div className="bg-gray-300 border-l-2 border-r-2 border-b-2 h-[91vh] hide-scrollbar w-full flex flex-col justify-end">

            {/* Message Page Header */}
            <div className='w-full p-2 bg-gray-300 shadow-lg flex'>
                <img className='w-[15%] h-full' src={selectedChat?.groupProfilePic?.url} alt="N/A" />
                <h1 className='font-bold text-2xl'>{SenderName}</h1>
            </div>

            {/* Message Container */}
            <ChatComponent messages={messages} user={user} setMessages={setMessages} ></ChatComponent>

            {/* Typing Indicator */}
            {istyping ? (<div className='font-bold text-black font-mono bg-transparent w-auto '>Typing...</div>) : (<></>)}

            {/* Message Input */}
            <div className="w-full max-w-full flex-col items-end mt-4">
                {/* File input (conditionally rendered) */}
                {showFileInput && (

                    <div className="mt-2 h-auto rounded-t-2xl w-full flex flex-col gap-2">
                        <input
                            type="file"
                            onChange={(e) => {
                                const selected = e.target.files[0];
                                setFile(selected);
                            }}
                            className="block w-full h-10 text-sm text-gray-900 bg-gray-200 rounded border border-gray-300 cursor-pointer"
                        />

                        {file && (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="h-[30%] w-[30%] object-contain rounded"
                            />
                        )}
                    </div>
                )}


                <div className="flex w-full items-center space-x-2">
                    {/* + Button */}
                    <button
                        onClick={toggleFileInput}
                        className="w-10 h-10 flex items-center justify-center bg-slate-300 text-black font-bold text-xl rounded shadow hover:bg-slate-400 transition"
                    >
                        +
                    </button>

                    {/* Message input */}
                    <input
                        className="flex-1 placeholder:text-black text-black text-sm border border-slate-200 bg-gray-400 px-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Type your message..."
                        onChange={typingHandler}
                        value={newMessage}
                        onKeyDown={sendMessage} // Send message when Enter is pressed
                    />
                </div>


            </div>

            {/* Video Call */}
            {/* <div className='absolute w-[60%] h-[50%] border-2 border-amber-300 m-3'>
                {VideoCall(SenderName,chatId)}
            </div> */}

        </div>
    );
};

export default ChatBox;