import React, { useEffect, useRef, useState } from 'react';
import { chatState } from '../context/chatProvider';
// import axios from 'axios';
// import io from 'socket.io-client'

// const ENDPOINT = baseUrl;
// var socket, selectedChatCompare;
import { findReply, askQuestion } from '../Questions/ReplyHandler'
import data from '../Questions/DummyQuestions'
import { baseUrl } from '../config/KeyConfig';

const Ques = () => {
    const { user } = chatState();
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [newMessage, setNewMessage] = useState("");
    const messagesContainerRef = useRef(null);
    // const [socketConnected, setSocketConnected] = useState(false);


    // useEffect(() => {
    //     let data = JSON.parse(localStorage.getItem("userInfo"));
    //     socket = io(ENDPOINT);
    //     socket.emit("setup", data);
    //     socket.on("connected", () => setSocketConnected(true))
    //     socket.on("typing", () => setIsTyping(true));
    //     socket.on("stop typing", () => setIsTyping(false));
    // }, []);

    // // Fetch messages when selectedChat changes
    // const fetchMessages = async () => {
    //     if (!selectedChat) return; // No chat selected, exit early

    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         };

    //         const { data } = await axios.get(`${baseUrl}/api/message/${selectedChat._id}`, config);
    //         setMessages(data);  // Update messages state with fetched data
    //         console.log('all msgs -->', data);
    //         socket.emit('join chat', selectedChat._id);
    //     } catch (error) {
    //         console.log("Error fetching messages:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchMessages();
    //     selectedChatCompare = selectedChat;
    // }, [selectedChat]); // Re-fetch messages when selectedChat changes

    // // receive message from socket
    // useEffect(() => {
    //     socket.on("message received", (newMessageReceived) => {
    //         if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
    //             // give notification
    //         }
    //         else {
    //             setMessages([...messages, newMessageReceived]);
    //         }
    //     })
    // })

    // // Send message handler
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

                const { data } = await axios.post(`${baseUrl}/api/message`, {
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


    const sendQue = (que, item) => {
        setMessages((prevMessages) => [...prevMessages, que]); // Add user question to messages
        const reply = askQuestion(que);
        setMessages((prevMessages) => [...prevMessages, reply]); // Add assistant reply to messages
    };

    const sendReply = (event) => {
        if (event.key === "Enter") {
            setMessages((prevMessages) => [...prevMessages, question]); // Add user question to messages
            const reply = askQuestion(question);
            setMessages((prevMessages) => [...prevMessages, reply]); // Add assistant reply to messages
            setQuestion(''); // Clear the input field
        }
    }


    // Handle typing input
    const typingHandler = (e) => {
        setQuestion(e.target.value);
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);



    return (
        <div className="bg-gray-200 border-3 h-[100vh] w-full flex justify-center items-center" >
            <div className='w-[90%] h-[90%] border-2 flex flex-col justify-end'>
                {/* Message Container */}
                <div className="w-full overflow-hidden h-[60%]">
                    <div className='overflow-y-scroll h-full w-full flex flex-col' ref={messagesContainerRef}>
                        {messages?.map((message, idx) => (
                            <div key={idx} className={`py-2 px-2 rounded-lg m-1 w-auto h-auto ${message._id === user._id ? 'bg-green-200 ml-auto text-right' : 'bg-blue-50 mr-auto text-left'}`}>
                                {message}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Message Input */}
                <div className="w-full flex-col items-end px-5 h-[40%]">

                    <label className="text-green-600 font-bold mb-2">Frequently Asked Questions..</label>
                    <div className='overflow-y-scroll grid grid-cols-4 px-10 items-center h-[59%] w-full max-[450px]:grid-cols-1 max-[670px]:grid-cols-2 max-[1000px]:grid-cols-3 max-[500px]:flex max-[500px]:flex-col max-[500px]:items-center'>
                        {(data.chatbot_data).map(item =>
                            item.question.map(que => {
                                // console.log(que);
                                return <button className='overflow-visible col-span-1 min-w-64 w-60 rounded-lg p-2 bg-green-200 text-black font-bold mb-1' onClick={() => { sendQue(que, item) }}>{que}</button>;
                            })
                        )}
                    </div>

                    <div className='justify-center w-full flex items-center gap-2 mt-3'>
                        <input
                            className="w-[50%] cursor-text placeholder:text-black text-black text-sm border border-slate-200 bg-green-400 px-2 rounded-3xl py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Chat With Chat Assistent......."
                            onChange={typingHandler}
                            value={question}
                            onKeyDown={sendReply}  // Send message when Enter is pressed
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ques;
