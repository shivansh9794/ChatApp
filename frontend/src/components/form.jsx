import React from "react";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config/KeyConfig";
import { chatState } from '../context/chatProvider';


export default function Formpage() {
    const [chatId, setChatId] = useState("");
    const [content, setContent] = useState("");
    const [replyOf, setReplyOf] = useState("");
    const [file, setFile] = useState(null);
    const { user, setUser, selectedChat } = chatState();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("chatId", chatId);
        formData.append("content", content);
        if (replyOf) formData.append("replyOf", replyOf);
        if (file) formData.append("file", file);


        console.log("<<<<<<>>>>>>",formData);
        
        

        // Debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const { data } = await axios.post(`${baseUrl}/api/message/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            console.log("Server response:", data);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md mx-auto p-4 border rounded">
            <input
                type="text"
                placeholder="Chat ID"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                required
                className="p-2 border rounded"
            />
            <input
                type="text"
                placeholder="Message content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="p-2 border rounded"
            />
            <input
                type="text"
                placeholder="Reply to (optional)"
                value={replyOf}
                onChange={(e) => setReplyOf(e.target.value)}
                className="p-2 border rounded"
            />
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="p-2 border rounded"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Send Message
            </button>
        </form>
    );
}
