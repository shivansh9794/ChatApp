import React, { useState } from 'react'
import { chatState } from '../context/chatProvider';
import spinner from '../components/Spinner'
import axios from 'axios';
import { baseUrl } from '../config/KeyConfig';


const Search = () => {

    const { user, selectedChat, setSelectedChat ,chats,setChats, } = chatState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            alert("please enter Something");
        }
        try {
            setLoading(true);
            console.log("Inside handleSearch");

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${baseUrl}/api/user/register?search=${search}`, config);
            setLoading(false);
            setSearch("");
            setSearchResult(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`${baseUrl}/api/chat`,{userId}, config);
            setSelectedChat(data);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            console.log("chat fetched==>", data);
            setSearchResult(null);
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <div className='h-auto w-40'>

            <form className="max-w-full mx-auto">
                <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder="Search ...."
                        required=""
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />
                    <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 text-center py-1 top-2 bg-green-400 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                spinner()
            ) : (
                searchResult?.map(user => {
                    return (
                        <div key={user._id} className='absolute cursor-pointer z-40 flex bg-gray-200 m-2 rounded-lg w-[140px] justify-center p-2'
                            onClick={()=>accessChat(user._id)}
                        >
                            <ul>
                                <h1 className='font-bold font-mono text-xl'>{user.name}</h1>
                            </ul>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default Search