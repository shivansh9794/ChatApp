import React, { useState } from 'react'

const ChatBox = () => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState();


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

    return (
        <div>
            <div class="w-full max-w-full flex-col items-end">
                <input className="w-full bg-white placeholder:text-black text-black text-sm border border-slate-200 rounded-md px-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..."
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={sendMessage}
                />
            </div>
        </div>
    )
}

export default ChatBox