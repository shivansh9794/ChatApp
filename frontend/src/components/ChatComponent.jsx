import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { chatState } from '../context/chatProvider';
import { baseUrl } from '../config/KeyConfig';
import { io } from 'socket.io-client';
const ENDPOINT = baseUrl;
var socket;

function ChatComponent({ messages, setMessages }) {
  const { user, setUser, selectedChat } = chatState();
  const messagesContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [msgId, setMsgId] = useState();
  let Userdata;




  useEffect(() => {
    Userdata = JSON.parse(localStorage.getItem("userInfo"));
    socket = io(ENDPOINT);
    socket.emit("setup", Userdata);
  }, []);

  const modalRef = useRef(null);

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


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function trimTime(isoDatetime) {
    return isoDatetime.split("T")[0];
  }


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




  const addReaction = async (msgId) => {

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios.post(`${baseUrl}/api/message/react/${msgId}`, { emoji: "👍" }, config)
      .then((result) => {
        setOpen(() => false);
        console.log(result.data);
        socket.emit("react", result.data); // socket to send reaction
      }).catch((err) => {
        console.log(err);
      });
  }


  const openDoubleClick = () => {
    return (
      <div ref={modalRef} className='w-[15%] h-[15%] top-60 left-130  bg-white absolute'>

        <button
          className='bg-transparent cursor-pointer hover:animate-spin text-white font-bold'
          onClick={(e) => { e.preventDefault; addReaction(msgId); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e2b016" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2q.85 0 1.65.125t1.575.4q.35.125.563.438T16 3.65v1.425q0 .8.563 1.363T17.925 7H18v.575q0 .575.425 1t1 .425H20.7q.375 0 .675.225t.4.6q.125.525.175 1.063T22 12q0 2.075-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-4.5q1.45 0 2.675-.7t1.975-1.9q.15-.3-.025-.6T16.1 14H7.9q-.35 0-.525.3t-.025.6q.75 1.2 1.988 1.9t2.662.7M8.5 11q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11m7 0q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11M20 5h-1q-.425 0-.712-.288T18 4t.288-.712T19 3h1V2q0-.425.288-.712T21 1t.713.288T22 2v1h1q.425 0 .713.288T24 4t-.288.713T23 5h-1v1q0 .425-.288.713T21 7t-.712-.288T20 6z" /></svg>
        </button>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#06a541" d="m4.825 11l3.9 3.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-4.6-4.6q-.15-.15-.213-.325T2.426 11t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.275T8.7 5.7q.3.3.3.713t-.3.712zm6 1l2.9 2.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-4.6-4.6q-.15-.15-.213-.325T7.426 11t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L10.825 10H17q2.075 0 3.538 1.463T22 15v3q0 .425-.288.713T21 19t-.712-.288T20 18v-3q0-1.25-.875-2.125T17 12z" />
          </svg>
        </button>
      </div>
    )
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
              message.reactions != null ?
                <button className='hover:animate-ping cursor-pointer rounded-full bg-transparent font-bold text-xl text-center'>{message?.reactions[0]?.emoji}</button>
                : ""
            }
            {
              message.reactions != null ?
                <button className='hover:animate-ping cursor-pointer rounded-full bg-transparent font-bold text-xl text-center'>{message?.reactions[0]?.emoji}</button>
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