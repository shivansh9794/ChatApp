import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import Chat from './pages/Ui'
import Search from './search/Search'
import Ques from './Questions/Ques'


function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
            <Route path='/search' element={<Search />} />
            <Route path='/ask' element={<Ques/>}/>
        </Routes>
    )
}

export default App