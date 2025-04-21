import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { chatState } from '../context/chatProvider';
import { baseUrl } from '../config/KeyConfig';
import { io } from 'socket.io-client';
const ENDPOINT = baseUrl;
var socket;

function ChatComponent({ messages, setMessages }) {
  const { user } = chatState();
  const messagesContainerRef = useRef(null);
  const modalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [msgId, setMsgId] = useState();
  let Userdata;
  useEffect(() => {
    Userdata = JSON.parse(localStorage.getItem("userInfo"));
    socket = io(ENDPOINT);
    socket.emit("setup", Userdata);
  }, []);

  // scroll to Last message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Close The reaction popup on outside click handler
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // show the reaction in receiver side
  useEffect(() => {
    socket.on("reaction received", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });
    // Cleanup on unmount
    return () => socket.off("reaction received");
  }, []);

  // Add reaction API
  const addReaction = async (msgId, emoji) => {

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios.post(`${baseUrl}/api/message/react/${msgId}`, { emoji }, config)
      .then((result) => {
        const updatedMessage = result.data;
        socket.emit("reaction", updatedMessage);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
        setOpen(false);
      })
      .catch((err) => {
        console.error("Reaction error:", err);
      });
  }

  // Double click open module
  const openDoubleClick = () => {
    const emojis = ['😄', '❤️', '👍', '😢', '😂']; // 5 emojis

    return (
      <div ref={modalRef} className='w-auto h-auto top-[45%] left-[50%] bg-gray-500 absolute p-2 rounded-xl shadow-lg'>

        <div className="flex justify-between mt-3 space-x-2">
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              className="text-xl hover:scale-125 transition-transform select-none"
              onClick={() => addReaction(msgId, emoji)}

            >
              {emoji}
            </button>
          ))}
        </div>

        <button className='mt-3 text-center'>
          reply
        </button>
      </div>
    );
  }


  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="overflow-y-auto h-full w-full flex flex-col"
        ref={messagesContainerRef}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`py-2 px-2 rounded-lg m-1 w-auto h-auto ${message?.sender?._id === user._id
              ? 'bg-green-200 ml-auto text-right'
              : 'bg-blue-50 mr-auto text-left'
              }`}
            onDoubleClick={() => { setMsgId(message._id); setOpen(() => true); }}          >

            {message?.replyOf != null ?
              <div>
                <h6>Reply Of : </h6>
                <a className='text-red-600'>{message?.replyOf?.content}</a>
              </div>
              : ''
            }

            {message.attachment != null && message.type === "image" ? <img className='w-[200px] h-[300px] object-contain' src={message.attachment.secure_url} /> : ""}
            {message.attachment != null && message.type === "video" ? <video autoPlay muted className='w-[200px] h-[300px] object-contain' src={message.attachment.secure_url} /> : ""}
            {message.attachment != null && message.type === "file" ? <a className='text-red-500 font-mono font-semibold m-2' href={message.attachment.secure_url}><svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24"><path fill="#f30707" d="M4 22v-2h16v2zm8-4L5 9h4V2h6v7h4z"></path></svg><strong>download File</strong></a> : ""}

            <strong>{message?.sender?.name}:</strong> {message?.content}

            <h1>{message?.createdTime || (message.createdAt).split("T")[1].slice(0, 5)}</h1>

            {
              message.reactions != null ?
                <button className='hover:animate-ping cursor-pointer rounded-full bg-transparent font-bold text-xl text-center'>{message?.reactions[0]?.emoji}</button>
                : ""
            }
            {
              message.senderReactions != null ?
                <button className='hover:animate-ping cursor-pointer rounded-full bg-transparent font-bold text-xl text-center'>{message?.
                  receiverReactions[0]?.emoji}</button>
                : ""
            }
            {
              message.receiverReactions != null ?
                <button className='hover:animate-ping cursor-pointer rounded-full bg-transparent font-bold text-xl text-center'>{message?.senderReactions[0]?.emoji}</button>
                : ""
            }

          </div>
        ))}
        {open ? openDoubleClick() : ''}

      </div>
    </div>
  );
}

export default ChatComponent;