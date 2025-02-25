import React, { useState } from 'react';
import './App.css'
import io from 'socket.io-client'

const socket = io.connect("http://localhost:8000");

function App() {


  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room",room);
    }
  };

  return (

    <div className='h-[100vh] w-full flex flex-col items-center mt-1 '>

      <div className='bg-gray-300 h-[200px] w-[250px] rounded-2xl flex flex-col items-center justify-center'>
        {/* Heading */}
        <h1 className='text-green-600 font-bold text-2xl'>Join a Chat</h1>

        {/* Input Div */}
        <div className='flex flex-col gap-3 m-2'>

          {/* User Name Input */}
          <input
            type="text"
            placeholder='Enter Your User Name'
            className='p-1 border border-gray-800 text-black'
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />

          {/* Room Id Input */}
          <input
            type="text"
            placeholder='Enter Room Id'
            className='p-1 border border-gray-800 text-black'
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />

        </div>

        {/* Join Button */}
        <button className='bg-green-500 rounded-lg p-1 cursor-pointer hover:bg-green-700'
        onClick={joinRoom}
        >
          Join Room
        </button>

      </div>

    </div>
  )
}

export default App
