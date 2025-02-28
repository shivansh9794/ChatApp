import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import Chat from './pages/Ui'
import Search from './search/Search'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
            <Route path='/search' element={<Search />} />
        </Routes>
    )
}

export default App