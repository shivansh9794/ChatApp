import React, { useEffect, useRef } from 'react';

function ChatComponent({ messages, user }) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function trimTime(isoDatetime) {
    return isoDatetime.split("T")[0];
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
            className={`py-2 px-2 rounded-lg m-1 w-auto h-auto ${message.sender._id === user._id
              ? 'bg-green-200 ml-auto text-right'
              : 'bg-blue-50 mr-auto text-left'
              }`}
          >
            

            {message.attachment != null && message.type === "image" ? <img className='w-[200px] h-[300px] object-contain' src={message.attachment.secure_url} /> : ""}
            {message.attachment != null && message.type === "video" ? <video autoPlay className='w-[200px] h-[300px] object-contain' src={message.attachment.secure_url} /> : ""}

            {message.attachment != null && message.type === "file" ? <a className='text-red-500 font-mono font-semibold m-2' href={message.attachment.secure_url}><svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24"><path fill="#f30707" d="M4 22v-2h16v2zm8-4L5 9h4V2h6v7h4z"></path></svg><strong>download File</strong></a> : ""}

            <strong>{message.sender.name}:</strong> {message.content}
            
            <h1>{(message.createdAt).split("T")[1].slice(0, 5)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;