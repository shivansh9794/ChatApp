// import React, { useState } from 'react'
// import { chatState } from '../context/chatProvider';
// import spinner from '../components/Spinner'
// import axios from 'axios';
// import { baseUrl } from '../config/KeyConfig';


// const Search = () => {

//     const { user, selectedChat, setSelectedChat ,chats,setChats, } = chatState();
//     const [search, setSearch] = useState();
//     const [searchResult, setSearchResult] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!search) {
//             alert("please enter Something");
//         }
//         try {
//             setLoading(true);
//             console.log("Inside handleSearch");

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             };

//             const { data } = await axios.get(`${baseUrl}/api/user/register?search=${search}`, config);
//             setLoading(false);
//             setSearch("");
//             setSearchResult(data);
//         }
//         catch (error) {
//             console.log(error);
//         }
//     }

//     const accessChat = async (userId) => {
//         try {
//             const config = {
//                 headers: {
//                     "content-type": "application/json",
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             };

//             const { data } = await axios.post(`${baseUrl}/api/chat`,{userId}, config);
//             setSelectedChat(data);
//             if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
//             console.log("chat fetched==>", data);
//             setSearchResult(null);
//         } catch (error) {
//             console.log(error);
//         }
//     }

    
//     return (
//         <div className='h-auto w-40'>

//             <form className="max-w-full mx-auto">
//                 <label
//                     htmlFor="default-search"
//                     className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//                 >
//                     Search
//                 </label>
//                 <div className="relative">
//                     <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                         <svg
//                             className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                         >
//                             <path
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                             />
//                         </svg>
//                     </div>
//                     <input
//                         type="search"
//                         id="default-search"
//                         className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
//                         placeholder="Search ...."
//                         required=""
//                         value={search}
//                         onChange={(e) => { setSearch(e.target.value) }}
//                     />
//                     <button
//                         type="submit"
//                         className="text-white absolute end-2.5 bottom-2.5 text-center py-1 top-2 bg-green-400 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1"
//                         onClick={handleSearch}
//                     >
//                         Search
//                     </button>
//                 </div>
//             </form>

//             {loading ? (
//                 spinner()
//             ) : (
//                 searchResult?.map(user => {
//                     return (
//                         <div key={user._id} className='absolute cursor-pointer z-40 flex bg-gray-200 m-2 rounded-lg w-[140px] justify-center p-2'
//                             onClick={()=>accessChat(user._id)}
//                         >
//                             <ul>
//                                 <h1 className='font-bold font-mono text-xl'>{user.name}</h1>
//                             </ul>
//                         </div>
//                     )
//                 })
//             )}
//         </div>
//     )
// }

// export default Search



import React, { useState } from "react";
import { chatState } from "../context/chatProvider";
import axios from "axios";
import { baseUrl } from "../config/KeyConfig";

const Search = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
  } = chatState();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Search users
  const handleSearch = async (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      setError("Please enter a name or email to search.");
      setSearchResult([]);
      setShowResults(true);
      return;
    }

    if (!user?.token) {
      setError("Please log in to search for users.");
      setShowResults(true);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShowResults(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/api/user/register?search=${encodeURIComponent(query)}`,
        config
      );

      setSearchResult(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("User search failed:", err);
      setSearchResult([]);
      setError(
        err.response?.data?.message || "Unable to search users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open or create a chat
  const accessChat = async (userId) => {
    if (!user?.token) return;

    try {
      setLoading(true);
      setError("");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${baseUrl}/api/chat`,
        { userId },
        config
      );

      setSelectedChat(data);

      setChats((previousChats) => {
        const alreadyExists = previousChats.some(
          (chat) => chat._id === data._id
        );

        return alreadyExists
          ? previousChats.map((chat) =>
              chat._id === data._id ? data : chat
            )
          : [data, ...previousChats];
      });

      setSearchResult([]);
      setSearch("");
      setShowResults(false);
    } catch (err) {
      console.error("Unable to open chat:", err);
      setError(
        err.response?.data?.message || "Unable to open this conversation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-w-0">
      {/* Search form */}
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          <svg
            className="pointer-events-none absolute left-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              strokeWidth="2"
            />
            <path
              d="m16 16 4 4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setError("");
            }}
            onFocus={() => {
              if (searchResult.length > 0 || error) {
                setShowResults(true);
              }
            }}
            placeholder="Search people..."
            aria-label="Search users"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-24 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchResult([]);
                setError("");
                setShowResults(false);
              }}
              aria-label="Clear search"
              className="absolute right-[88px] rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  strokeWidth="2"
                />
                <path
                  d="m16 16 4 4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            Search
          </button>
        </div>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <>
          {/* Click outside to close */}
          <button
            type="button"
            aria-label="Close search results"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setShowResults(false)}
          />

          <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[min(65vh,420px)] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/70">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Search results
              </p>

              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-8">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
                <span className="text-sm text-gray-500">
                  Searching users...
                </span>
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : searchResult.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      strokeWidth="1.8"
                    />
                    <path
                      d="m16 16 4 4"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  No users found
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Try searching with another name or email.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {searchResult.map((resultUser) => (
                  <button
                    key={resultUser._id}
                    type="button"
                    onClick={() => accessChat(resultUser._id)}
                    disabled={loading}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-indigo-50 disabled:opacity-60"
                  >
                    {/* User avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
                      {(resultUser.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* User details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-800">
                        {resultUser.name || "Unknown user"}
                      </h3>

                      {resultUser.email && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {resultUser.email}
                        </p>
                      )}
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-hover:bg-indigo-100">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 17 17 7M7 7h10v10"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
