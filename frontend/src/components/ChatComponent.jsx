import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { chatState } from '../context/chatProvider';
import { baseUrl } from '../config/KeyConfig';

function ChatComponent({ messages }) {
  const { user, setUser, selectedChat } = chatState();
  const messagesContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [msgId, setMsgId] = useState();;

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function trimTime(isoDatetime) {
    return isoDatetime.split("T")[0];
  }

  const addReaction = async (msgId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios.post(`${baseUrl}/api/message/react/${msgId}`, config, { emoji: "✅" })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  }


  const openDoubleClick = () => {
    return (
      <div className='w-[30%] h-[15%] top-60 left-130  bg-white absolute'>
        <h1>Token:-{user.token}</h1>
        <h3>Id:-{msgId}</h3>
        <h1></h1>
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
            className={`py-2 px-2 rounded-lg m-1 w-auto h-auto ${message.sender?._id === user._id
              ? 'bg-green-200 ml-auto text-right'
              : 'bg-blue-50 mr-auto text-left'
              }`}
            onDoubleClick={() => { setMsgId(message._id); setOpen(prev => !prev); addReaction(msgId) }}          >

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

            <h1>{(message.createdAt).split("T")[1].slice(0, 5)}</h1>
            {message.reactions != null ? <a className='rounded-full bg-black font-bold text-center'>{message?.reactions[0]?.emoji}</a> : ""}

          </div>
        ))}
        {open ? openDoubleClick() : ''}

      </div>
    </div>
  );
}

export default ChatComponent;