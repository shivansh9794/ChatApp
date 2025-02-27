import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import Chat from './pages/ChatPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
            {/* <Route path='/phone' element={<Test />} /> */}
        </Routes>
    )
}

export default App