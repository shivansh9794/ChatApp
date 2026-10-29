// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';
// import { chatState } from '../context/chatProvider';
// import { baseUrl } from '../config/KeyConfig';

// const Home = () => {  
//   const { user, setUser } = chatState();
//   const navigate = useNavigate();
//   const [loginState, setLoginState] = useState(true);
//   const [formData, setFormData] = useState({});
//   const [image, setImage] = useState(null);
//   // const [user, setUser] = useState();

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
//     setUser(userInfo);
//     if (userInfo) {
//       navigate('/chats');
//     }
//   }, [navigate]);

//   // handling changes in a form  
//   const handleChange = (e) => {
//     if (e.target.type === "file") {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//       setImage(e.target.files[0]); // Set the selected image
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   // login form handling
//   const handleSubmit = async () => {
//     console.log(formData);
//     try {
//       const res = await axios.post(`${baseUrl}/api/user/login`, formData);
//       console.log(res.data);
//       // localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userInfo", JSON.stringify(res.data));
//       navigate('/chats');
//     }
//     catch (error) {
//       console.log(error);
//     }
//   }

//   // SignUp form handling
//   const handleSignUp=async()=>{
//     console.log(formData);
//     try {
//       const res = await axios.post(`${baseUrl}/api/user/register`, formData);
//       console.log(res.data);  
//       alert("User Added");    
//     }
//     catch (error) {
//       console.log(error);
//     }
//   }

//   const loginCard = () => {
//     return (
//       <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">

//           <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">

//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   placeholder='Email...'
//                   type="email"
//                   name="email"
//                   id="email"
//                   autoComplete="email"
//                   required=""
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm/6 font-medium text-gray-900"
//                 >
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <a
//                     href="#"
//                     className="font-semibold text-indigo-600 hover:text-indigo-500"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <input
//                   placeholder='Password...'
//                   type="password"
//                   name="password"
//                   id="password"
//                   autoComplete="current-password"
//                   required=""
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>
//             <div>
//               <button
//                 type="button"
//                 onClick={() => { handleSubmit() }}
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//         </div>
//       </div>
//     )
//   }

//   const signUpCard = () => {
//     return (
//       <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">

//           <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//             Create your New Account
//           </h2>
//         </div>
//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">

//             {/* Name */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Name
//               </label>
//               <div className="mt-2">
//                 <input
//                   placeholder='Name.....'
//                   type="text"
//                   name="name"
//                   id="name"
//                   autoComplete="name"
//                   required=""
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   placeholder='Email...'
//                   type="email"
//                   name="email"
//                   id="email"
//                   autoComplete="email"
//                   required=""
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm/6 font-medium text-gray-900"
//                 >
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <a
//                     href="#"
//                     className="font-semibold text-indigo-600 hover:text-indigo-500"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <input
//                   placeholder='Password...'
//                   type="password"
//                   name="password"
//                   id="password"
//                   autoComplete="current-password"
//                   required=""
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>

//             </div>
//             <div>
//               <button
//                 type="button"
//                 onClick={() => { handleSignUp() }}
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//         </div>
//       </div>
//     )
//   }

//   const handleLoginState = () => {
//     setLoginState((prevState) => !prevState);
//   };

//   return (

//     <div className='flex w-full h-screen justify-center items-center'>

//       <div>
//         <div className='grid grid-cols-2 h-auto w-full bg-gray-300'>
//           <button className='col-span-1 py-1 active:bg-gray-600 active:rounded-4xl mt-2 m-1' onClick={handleLoginState}>Login</button>
//           <button className='col-span-1 py-1 active:bg-gray-600 active:rounded-4xl mt-2 m-1' onClick={handleLoginState} >Sign Up</button>
//         </div>
//         {(loginState) ? loginCard() : signUpCard()}
//       </div>
//     </div>
//   )
// }

// export default Home





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { chatState } from '../context/chatProvider';
import { baseUrl } from '../config/KeyConfig';

const Home = () => {
    const { user, setUser } = chatState();
    const navigate = useNavigate();

    const [loginState, setLoginState] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');

        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);

                if (parsedUser) {
                    setUser(parsedUser);
                    navigate('/chats', { replace: true });
                }
            } catch {
                localStorage.removeItem('userInfo');
            }
        }
    }, [navigate, setUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError('');
        setSuccess('');
    };

    const handleLoginState = (isLogin) => {
        setLoginState(isLogin);
        setShowForgotPassword(false);
        setShowPassword(false);
        setError('');
        setSuccess('');

        setFormData({
            name: '',
            email: '',
            password: '',
        });
    };

    // Login API
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${baseUrl}/api/user/login`,
                {
                    email: formData.email.trim(),
                    password: formData.password,
                }
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);

            navigate('/chats', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to login. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Signup API
    const handleSignUp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${baseUrl}/api/user/register`,
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                }
            );

            setSuccess(
                'Account created successfully! You can now log in.'
            );

            setLoginState(true);

            setFormData({
                name: '',
                email: formData.email.trim(),
                password: '',
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to create your account.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Direct password change API.
    // This assumes your backend route is PUT /api/user/forgot-password.
    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { data } = await axios.put(
                `${baseUrl}/api/user/forgot-password`,
                {
                    email: forgotData.email.trim(),
                    password: forgotData.password,
                }
            );

            setSuccess(
                data.message || 'Password changed successfully.'
            );

            setShowForgotPassword(false);
            setForgotData({ email: '', password: '' });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to change password.'
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        block w-full rounded-xl border border-slate-200
        bg-slate-50 px-4 py-3 text-sm text-slate-800
        placeholder:text-slate-400 outline-none
        transition duration-200
        focus:border-indigo-500 focus:bg-white
        focus:ring-4 focus:ring-indigo-100
    `;

    const primaryButtonClass = `
        flex w-full items-center justify-center gap-2
        rounded-xl bg-indigo-600 px-4 py-3
        text-sm font-semibold text-white
        shadow-lg shadow-indigo-200
        transition duration-200
        hover:bg-indigo-700
        disabled:cursor-not-allowed disabled:opacity-60
    `;

    return (
        <div className="relative min-h-screen w-full overflow-hidden
            flex items-center justify-center
            bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100
            px-4 py-8">

            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-24 -top-24
                h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24
                -right-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

            <div className="relative z-10 w-full max-w-md">

                {/* Brand */}
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16
                        items-center justify-center rounded-2xl
                        bg-gradient-to-br from-indigo-500 to-violet-600
                        text-white shadow-xl shadow-indigo-200">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8"
                        >
                            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8
                                8.5 8.5 0 0 1-7.6 4.7
                                8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7
                                a8.4 8.4 0 0 1-.9-3.8
                                8.5 8.5 0 0 1 4.7-7.6
                                8.4 8.4 0 0 1 3.8-.9h.5
                                a8.5 8.5 0 0 1 8 8v.5Z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-extrabold
                        tracking-tight text-slate-900">
                        ChatSide
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Stay connected, wherever you are.
                    </p>
                </div>

                {/* Authentication Card */}
                <div className="overflow-hidden rounded-3xl
                    border border-white/70 bg-white/90
                    shadow-2xl shadow-slate-300/50 backdrop-blur-xl">

                    {/* Tabs */}
                    {!showForgotPassword && (
                        <div className="grid grid-cols-2 gap-1
                            bg-slate-100/80 p-1.5 m-4 rounded-xl">

                            <button
                                type="button"
                                onClick={() => handleLoginState(true)}
                                className={`rounded-lg px-4 py-2.5 text-sm
                                    font-semibold transition ${
                                        loginState
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() => handleLoginState(false)}
                                className={`rounded-lg px-4 py-2.5 text-sm
                                    font-semibold transition ${
                                        !loginState
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    <div className="px-6 pb-7 pt-3 sm:px-8">

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold
                                tracking-tight text-slate-900">
                                {showForgotPassword
                                    ? 'Change password'
                                    : loginState
                                        ? 'Welcome back!'
                                        : 'Create your account'}
                            </h2>

                            <p className="mt-2 text-sm leading-6
                                text-slate-500">
                                {showForgotPassword
                                    ? 'Enter your registered email and choose a new password.'
                                    : loginState
                                        ? 'Sign in to continue your conversations.'
                                        : 'Join ChatSide and start connecting.'}
                            </p>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div role="alert" className="mb-5 rounded-xl
                                border border-red-100 bg-red-50
                                px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div role="status" className="mb-5 rounded-xl
                                border border-emerald-100 bg-emerald-50
                                px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        {/* Forgot Password Form */}
                        {showForgotPassword ? (
                            <form
                                onSubmit={handleForgotPassword}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="forgotEmail"
                                        className="mb-2 block text-sm
                                            font-semibold text-slate-700"
                                    >
                                        Registered email
                                    </label>

                                    <input
                                        id="forgotEmail"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={forgotData.email}
                                        onChange={(event) => {
                                            setForgotData((previous) => ({
                                                ...previous,
                                                email: event.target.value,
                                            }));
                                        }}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="mb-2 block text-sm
                                            font-semibold text-slate-700"
                                    >
                                        New password
                                    </label>

                                    <input
                                        id="newPassword"
                                        type="password"
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        value={forgotData.password}
                                        onChange={(event) => {
                                            setForgotData((previous) => ({
                                                ...previous,
                                                password: event.target.value,
                                            }));
                                        }}
                                        className={inputClass}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={primaryButtonClass}
                                >
                                    {loading
                                        ? 'Updating password...'
                                        : 'Change password'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="w-full py-2 text-sm
                                        font-semibold text-slate-500
                                        hover:text-indigo-600"
                                >
                                    Back to login
                                </button>

                                <p className="text-xs leading-5 text-amber-700">
                                    This direct-change flow does not verify
                                    email ownership. Do not expose it publicly.
                                </p>
                            </form>
                        ) : (
                            <form
                                onSubmit={loginState
                                    ? handleSubmit
                                    : handleSignUp}
                                className="space-y-5"
                            >
                                {/* Name */}
                                {!loginState && (
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm
                                                font-semibold text-slate-700"
                                        >
                                            Full name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm
                                            font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center
                                        justify-between gap-3">

                                        <label
                                            htmlFor="password"
                                            className="text-sm font-semibold
                                                text-slate-700"
                                        >
                                            Password
                                        </label>

                                        {loginState && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForgotData({
                                                        email: formData.email,
                                                        password: '',
                                                    });

                                                    setShowForgotPassword(true);
                                                    setError('');
                                                    setSuccess('');
                                                }}
                                                className="text-xs font-semibold
                                                    text-indigo-600
                                                    hover:text-indigo-800"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword
                                                ? 'text'
                                                : 'password'}
                                            required
                                            minLength={loginState ? undefined : 8}
                                            autoComplete={loginState
                                                ? 'current-password'
                                                : 'new-password'}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`${inputClass} pr-20`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPassword((previous) => !previous);
                                            }}
                                            className="absolute right-3 top-1/2
                                                -translate-y-1/2 text-xs
                                                font-semibold text-slate-500
                                                hover:text-indigo-600"
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={primaryButtonClass}
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4
                                                animate-spin rounded-full
                                                border-2 border-white/40
                                                border-t-white" />

                                            Please wait...
                                        </>
                                    ) : (
                                        loginState
                                            ? 'Sign in to ChatSide →'
                                            : 'Create account →'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {!showForgotPassword && (
                        <div className="border-t border-slate-100
                            bg-slate-50/80 px-6 py-4 text-center">

                            <p className="text-xs text-slate-500">
                                {loginState
                                    ? "Don't have an account? "
                                    : 'Already have an account? '}

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleLoginState(!loginState);
                                    }}
                                    className="font-bold text-indigo-600
                                        hover:text-indigo-800"
                                >
                                    {loginState ? 'Sign up' : 'Login'}
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} ChatSide. Stay connected.
                </p>
            </div>
        </div>
    );
};

export default Home;
