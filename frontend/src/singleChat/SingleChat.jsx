// import React, { useEffect, useRef, useState } from 'react';
// import { chatState } from '../context/chatProvider';
// import axios from 'axios';
// import io from 'socket.io-client'
// import ChatComponent from '../components/ChatComponent'
// import { baseUrl } from '../config/KeyConfig';
// import VideoCall from './VideoCall'

// const ENDPOINT = baseUrl;
// var socket, selectedChatCompare;

// const ChatBox = ({ fetchAgain, setFetchAgain }) => {
//     const { user, setUser, selectedChat } = chatState();
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [file, setFile] = useState();
//     const [showFileInput, setShowFileInput] = useState(false);
//     const [socketConnected, setSocketConnected] = useState(false);
//     const [typing, setTyping] = useState(false);
//     const [istyping, setIsTyping] = useState(false);
//     let Userdata;

//     useEffect(() => {
//         Userdata = JSON.parse(localStorage.getItem("userInfo"));
//         socket = io(ENDPOINT);
//         socket.emit("setup", Userdata);
//         socket.on("connected", () => setSocketConnected(true))
//         socket.on("typing", () => setIsTyping(true));
//         socket.on("stop typing", () => setIsTyping(false));
//     }, []);

//     // Fetch messages when selectedChat changes
//     const fetchMessages = async () => {

//         if (!selectedChat) return;
//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             };

//             const { data } = await axios.get(`${baseUrl}/api/message/${selectedChat._id}`, config);
//             setMessages(data);  // Update messages state with fetched data
//             console.log('all msgs -->', data);
//             socket.emit('join chat', selectedChat._id);
//         } catch (error) {
//             console.log("Error fetching messages:", error);
//         }
//     };

//     // Set mark as seen when we refetch the message 
//     useEffect(() => {
//         Userdata = JSON.parse(localStorage.getItem("userInfo"));
//         socket.emit("mark seen", { "chatId": selectedChat._id, "userId": Userdata?._id })
//         // console.log("Hiii")
//     }, [messages]);

//     useEffect(() => {
//         fetchMessages();
//         selectedChatCompare = selectedChat;
//     }, [selectedChat]); // Re-fetch messages when selectedChat changes

//     // receive message from socket
//     useEffect(() => {
//         socket.on("message received", (newMessageReceived) => {
//             if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
//                 // give notification
//             }
//             else {
//                 setMessages([...messages, newMessageReceived]);
//             }
//         })
//     });

//     // Show File
//     let [previewUrl, setPreview] = useState(null);
//     useEffect(() => {
//         if (file) {
//             previewUrl = URL.createObjectURL(file);
//             setPreview(previewUrl);
//         }
//         return () => {
//             if (previewUrl) {
//                 URL.revokeObjectURL(previewUrl);
//             }
//         };
//     }, [file]);

//     // Send message handler
//     const sendMessage = async (event) => {
//         if (event.key === "Enter" && newMessage.trim()) {

//             const formData = new FormData();
//             formData.append("chatId", selectedChat._id);
//             formData.append("content", newMessage);
//             if (file) { formData.append("file", file) }

//             socket.emit('stop typing', selectedChat._id)

//             try {
//                 const config = {
//                     headers: {
//                         // "Content-Type": "application/json",
//                         Authorization: `Bearer ${user.token}`,
//                     },
//                 };

//                 const { data } = await axios.post(`${baseUrl}/api/message`, formData, config)
//                 setMessages(prevMessages => [...prevMessages, data]);
//                 setNewMessage("");
//                 setFile('');
//                 setShowFileInput(false);
//                 socket.emit("new message", data); // socket to send data
//                 setFetchAgain();
//             } catch (error) {
//                 console.log("Error sending message:", error);
//             }
//         }
//     };

//     // Handle typing input
//     const typingHandler = (e) => {
//         setNewMessage(e.target.value);

//         if (!socketConnected) return;

//         if (!typing) {
//             setTyping(true);
//             socket.emit("typing", selectedChat._id);
//         }
//         let lastTypingTime = new Date().getTime();
//         var timerLength = 1000;
//         setTimeout(() => {
//             var timeNow = new Date().getTime();
//             var timeDiff = timeNow - lastTypingTime;
//             if (timeDiff >= timerLength && typing) {
//                 socket.emit("stop typing", selectedChat._id);
//                 setTyping(false);
//             }
//         }, timerLength);
//     };

//     let SenderName = "";
//     let chatId = 0;
//     if (selectedChat.isGroupChat == true) {
//         SenderName = selectedChat.chatName;
//         chatId = selectedChat._id;
//     }
//     else if (selectedChat?.users[1]?._id == user?._id) {
//         SenderName = selectedChat?.users[0].name;
//         chatId = selectedChat._id;
//     }
//     else if (selectedChat?.users[0]?._id == user?._id) {
//         SenderName = selectedChat?.users[1]?.name;
//         chatId = selectedChat?._id;
//     }
//     else {
//         SenderName = "Reload page to Load Name"
//     }

//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     };

//     const toggleFileInput = () => {
//         setShowFileInput((prev) => !prev);
//     };

//     return (
//         <div className="bg-gray-300 border-l-2 border-r-2 border-b-2 h-[90vh] hide-scrollbar w-full flex flex-col justify-end">

//             {/* Message Page Header */}
//             <div className='w-full p-2 bg-gray-300 shadow-lg flex'>
//                 <img className='w-[15%] h-full' src={selectedChat?.groupProfilePic?.url} alt="N/A" />
//                 <h1 className='font-bold text-2xl'>{SenderName}</h1>
//             </div>

//             {/* Message Container */}
//             <ChatComponent messages={messages} user={user} setMessages={setMessages} ></ChatComponent>

//             {/* Typing Indicator */}
//             {istyping ? (<div className='font-bold text-black font-mono bg-transparent w-auto '>Typing...</div>) : (<></>)}

//             {/* Message Input */}
//             <div className="w-full max-w-full flex-col items-end mt-4">
//                 {/* File input (conditionally rendered) */}
//                 {showFileInput && (

//                     <div className="mt-2 h-auto rounded-t-2xl w-full flex flex-col gap-2">
//                         <input
//                             type="file"
//                             onChange={(e) => {
//                                 const selected = e.target.files[0];
//                                 setFile(selected);
//                             }}
//                             className="block w-full h-10 text-sm text-gray-900 bg-gray-200 rounded border border-gray-300 cursor-pointer"
//                         />

//                         {file && (
//                             <img
//                                 src={URL.createObjectURL(file)}
//                                 alt="Preview"
//                                 className="h-[30%] w-[30%] object-contain rounded"
//                             />
//                         )}
//                     </div>
//                 )}


//                 <div className="flex w-full items-center space-x-2">
//                     {/* + Button */}
//                     <button
//                         onClick={toggleFileInput}
//                         className="w-10 h-10 flex items-center justify-center bg-slate-300 text-black font-bold text-xl rounded shadow hover:bg-slate-400 transition"
//                     >
//                         +
//                     </button>

//                     {/* Message input */}
//                     <input
//                         className="flex-1 placeholder:text-black text-black text-sm border border-slate-200 bg-gray-400 px-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
//                         placeholder="Type your message..."
//                         onChange={typingHandler}
//                         value={newMessage}
//                         onKeyDown={sendMessage} // Send message when Enter is pressed
//                     />
//                 </div>


//             </div>

//             {/* Video Call */}
//             {/* <div className='absolute w-[60%] h-[50%] border-2 border-amber-300 m-3'>
//                 {VideoCall(SenderName,chatId)}
//             </div> */}

//         </div>
//     );
// };

// export default ChatBox;




import React, { useEffect, useRef, useState } from 'react';
import { chatState } from '../context/chatProvider';
import axios from 'axios';
import io from 'socket.io-client';
import ChatComponent from '../components/ChatComponent';
import { baseUrl } from '../config/KeyConfig';

const ENDPOINT = baseUrl;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat } = chatState();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [sending, setSending] = useState(false);

    const socketRef = useRef(null);
    const selectedChatRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    // Initialize Socket.IO.
    useEffect(() => {
        const userData = JSON.parse(
            localStorage.getItem('userInfo') || 'null'
        );

        if (!userData?._id) return;

        const socket = io(ENDPOINT);
        socketRef.current = socket;

        socket.emit('setup', userData);

        const handleConnected = () => setSocketConnected(true);
        const handleDisconnect = () => setSocketConnected(false);
        const handleTyping = () => setIsTyping(true);
        const handleStopTyping = () => setIsTyping(false);

        socket.on('connected', handleConnected);
        socket.on('disconnect', handleDisconnect);
        socket.on('typing', handleTyping);
        socket.on('typing stopped', handleStopTyping);

        return () => {
            socket.off('connected', handleConnected);
            socket.off('disconnect', handleDisconnect);
            socket.off('typing', handleTyping);
            socket.off('typing stopped', handleStopTyping);

            socket.disconnect();
            socketRef.current = null;

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Fetch messages when the selected chat changes.
    useEffect(() => {
        if (!selectedChat?._id || !user?.token) {
            setMessages([]);
            return;
        }

        let cancelled = false;

        const fetchMessages = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(
                    `${baseUrl}/api/message/${selectedChat._id}`,
                    config
                );

                if (cancelled) return;

                setMessages(Array.isArray(data) ? data : []);

                socketRef.current?.emit(
                    'join chat',
                    selectedChat._id
                );
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        'Error fetching messages:',
                        error.response?.data || error.message
                    );
                }
            }
        };

        fetchMessages();

        return () => {
            cancelled = true;
        };
    }, [selectedChat?._id, user?.token]);

    // Mark messages as seen.
    useEffect(() => {
        const userData = JSON.parse(
            localStorage.getItem('userInfo') || 'null'
        );

        if (!selectedChat?._id || !userData?._id) return;

        socketRef.current?.emit('mark seen', {
            chatId: selectedChat._id,
            userId: userData._id,
        });
    }, [selectedChat?._id, messages]);

    // Receive messages. Register one listener per connection.
    useEffect(() => {
        const socket = socketRef.current;

        if (!socket || !socketConnected) return;

        const handleMessageReceived = (incomingMessage) => {
            const currentChat = selectedChatRef.current;

            if (
                !currentChat?._id ||
                String(currentChat._id) !==
                    String(incomingMessage.chat?._id)
            ) {
                return;
            }

            setMessages((previousMessages) => {
                const exists = previousMessages.some(
                    (message) =>
                        String(message._id) ===
                        String(incomingMessage._id)
                );

                return exists
                    ? previousMessages
                    : [...previousMessages, incomingMessage];
            });
        };

        socket.on('message received', handleMessageReceived);

        return () => {
            socket.off('message received', handleMessageReceived);
        };
    }, [socketConnected]);

    // File preview.
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Scroll to the latest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [messages, isTyping]);

    // Find the other participant by ID.
    const otherUser = selectedChat?.users?.find(
        (chatUser) =>
            String(chatUser?._id) !== String(user?._id)
    );

    const senderName = !selectedChat
        ? ''
        : selectedChat.isGroupChat
            ? selectedChat.chatName || 'Group Chat'
            : otherUser?.name || 'Chat';

    // Send message with Enter or the send button.
    const sendMessage = async (event) => {
        if (event.key !== 'Enter' || event.shiftKey) return;

        event.preventDefault();

        if (sending || (!newMessage.trim() && !file)) return;
        if (!selectedChat?._id || !user?.token) return;

        const currentChatId = selectedChat._id;
        const messageText = newMessage.trim();
        const selectedFile = file;

        const formData = new FormData();
        formData.append('chatId', currentChatId);
        formData.append('content', messageText);

        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socketRef.current?.emit('stop typing', currentChatId);
        setTyping(false);
        setSending(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                `${baseUrl}/api/message`,
                formData,
                config
            );

            // Add the saved message only once.
            setMessages((previousMessages) => {
                const exists = previousMessages.some(
                    (message) =>
                        String(message._id) === String(data._id)
                );

                return exists
                    ? previousMessages
                    : [...previousMessages, data];
            });

            setNewMessage('');
            setFile(null);
            setShowFileInput(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            socketRef.current?.emit('new message', data);

            if (typeof setFetchAgain === 'function') {
                setFetchAgain((previous) => !previous);
            }
        } catch (error) {
            console.error(
                'Error sending message:',
                error.response?.data || error.message
            );
        } finally {
            setSending(false);
        }
    };

    // Typing indicator.
    const typingHandler = (event) => {
        setNewMessage(event.target.value);

        if (!socketConnected || !selectedChat?._id) return;

        if (!typing) {
            setTyping(true);
            socketRef.current?.emit('typing', selectedChat._id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        const currentChatId = selectedChat._id;

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit('stop typing', currentChatId);
            setTyping(false);
        }, 1000);
    };

    const handleSendClick = () => {
        sendMessage({
            key: 'Enter',
            shiftKey: false,
            preventDefault: () => {},
        });
    };

    const removeFile = () => {
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!selectedChat) {
        return (
            <div className="h-full min-h-0 w-full flex items-center
                justify-center rounded-2xl border border-slate-200
                bg-white shadow-sm">

                <div className="px-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16
                        items-center justify-center rounded-2xl
                        bg-indigo-50 text-indigo-600">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-8 w-8"
                        >
                            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8
                                8.5 8.5 0 0 1-7.6 4.7
                                8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7
                                a8.4 8.4 0 0 1-.9-3.8
                                8.5 8.5 0 0 1 4.7-7.6
                                8.4 8.4 0 0 1 3.8-.9h.5
                                a8.5 8.5 0 0 1 8 8v.5Z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                        Your conversations
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Select a chat to start messaging.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col
            overflow-hidden rounded-2xl border border-slate-200
            bg-white shadow-sm">

            {/* Header: fixed height */}
            <header className="flex shrink-0 items-center gap-3
                border-b border-slate-100 bg-white px-4 py-3 sm:px-5">

                <div className="relative shrink-0">
                    {selectedChat.isGroupChat &&
                    selectedChat.groupProfilePic?.url ? (
                        <img
                            src={selectedChat.groupProfilePic.url}
                            alt={senderName}
                            className="h-11 w-11 rounded-full
                                object-cover ring-2 ring-indigo-100"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center
                            justify-center rounded-full
                            bg-gradient-to-br from-indigo-500 to-violet-600
                            text-lg font-bold text-white">
                            {senderName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}

                    <span className={`absolute bottom-0 right-0
                        h-3 w-3 rounded-full border-2 border-white ${
                            socketConnected
                                ? 'bg-emerald-500'
                                : 'bg-amber-400'
                        }`} />
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-bold
                        text-slate-800 sm:text-lg">
                        {senderName}
                    </h1>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {isTyping
                            ? 'Typing...'
                            : selectedChat.isGroupChat
                                ? `${selectedChat.users?.length || 0} members`
                                : 'Chat conversation'}
                    </p>
                </div>

                <div className="hidden shrink-0 items-center gap-2
                    rounded-full bg-slate-50 px-3 py-1.5 sm:flex">
                    <span className={`h-2 w-2 rounded-full ${
                        socketConnected
                            ? 'bg-emerald-500'
                            : 'bg-amber-400'
                    }`} />

                    <span className="text-xs text-slate-600">
                        {socketConnected ? 'Connected' : 'Connecting'}
                    </span>
                </div>
            </header>

            {/* Message list: only this section scrolls */}
            <main className="flex-1 min-h-0 overflow-y-auto
                overscroll-contain bg-slate-50 px-2 py-3 sm:px-4">
                <ChatComponent
                    messages={messages}
                    user={user}
                    setMessages={setMessages}
                />

                <div ref={messagesEndRef} />
            </main>

            {/* Typing indicator */}
            {isTyping && (
                <div className="shrink-0 border-t border-slate-100
                    bg-white px-4 py-2">
                    <span className="inline-flex items-center gap-2
                        text-sm font-medium text-indigo-600">
                        <span className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce
                                rounded-full bg-indigo-500" />
                            <span className="h-1.5 w-1.5 animate-bounce
                                rounded-full bg-indigo-500
                                [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce
                                rounded-full bg-indigo-500
                                [animation-delay:300ms]" />
                        </span>
                        Typing
                    </span>
                </div>
            )}

            {/* Attachment preview */}
            {showFileInput && (
                <div className="shrink-0 border-t border-slate-100
                    bg-white px-3 pt-3 sm:px-4">

                    {file && (
                        <div className="mb-3 flex items-center gap-3
                            rounded-xl border border-indigo-100
                            bg-indigo-50/70 p-3">

                            {file.type.startsWith('image/') && previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="File preview"
                                    className="h-12 w-12 rounded-lg
                                        border border-white object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 shrink-0
                                    items-center justify-center rounded-lg
                                    bg-white text-xl text-indigo-600">
                                    📎
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold
                                    text-slate-700">
                                    {file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Attachment ready
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={removeFile}
                                className="flex h-8 w-8 shrink-0
                                    items-center justify-center rounded-full
                                    text-slate-500 hover:bg-white
                                    hover:text-red-500"
                                aria-label="Remove attachment"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(event) => {
                            setFile(event.target.files?.[0] || null);
                        }}
                        className="mb-3 block w-full text-sm text-slate-600
                            file:mr-3 file:rounded-lg file:border-0
                            file:bg-indigo-100 file:px-4 file:py-2
                            file:font-semibold file:text-indigo-700
                            hover:file:bg-indigo-200"
                    />
                </div>
            )}

            {/* Composer: always stays at the bottom */}
            <footer className="relative z-10 shrink-0 border-t
                border-slate-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))]
                sm:p-4">

                <div className="flex items-center gap-2 rounded-2xl
                    border border-slate-200 bg-slate-50 p-2
                    transition-all focus-within:border-indigo-300
                    focus-within:ring-4 focus-within:ring-indigo-50">

                    <button
                        type="button"
                        onClick={() => {
                            setShowFileInput((previous) => !previous);
                        }}
                        className={`flex h-10 w-10 shrink-0
                            items-center justify-center rounded-xl
                            text-xl transition ${
                                showFileInput
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-500 hover:bg-slate-200'
                            }`}
                        title="Attach a file"
                        aria-label="Attach a file"
                    >
                        +
                    </button>

                    <input
                        type="text"
                        className="min-w-0 flex-1 bg-transparent
                            px-2 py-3 text-sm text-slate-800
                            outline-none placeholder:text-slate-400"
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={typingHandler}
                        onKeyDown={sendMessage}
                        aria-label="Write a message"
                    />

                    <button
                        type="button"
                        onClick={handleSendClick}
                        disabled={sending || (!newMessage.trim() && !file)}
                        className="flex h-10 w-10 shrink-0
                            items-center justify-center rounded-xl
                            bg-indigo-600 text-white shadow-sm
                            transition hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:bg-slate-200
                            disabled:text-slate-400"
                        title="Send message"
                        aria-label="Send message"
                    >
                        {sending ? (
                            <span className="h-4 w-4 animate-spin
                                rounded-full border-2 border-current
                                border-t-transparent" />
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatBox;
