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
            className={`py-2 px-2 rounded-lg m-1 w-auto h-auto ${
              message.sender._id === user._id
                ? 'bg-green-200 ml-auto text-right'
                : 'bg-blue-50 mr-auto text-left'
            }`}
          >
            <strong>{message.sender.name}:</strong> {message.content}
            <h1>{(message.createdAt).split("T")[1].slice(0, 5)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;