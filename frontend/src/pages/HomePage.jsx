import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { chatState } from '../context/chatProvider';
import { baseUrl } from '../config/KeyConfig';


const Home = () => {
  const { user, setUser } = chatState();
  
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(true);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  // const [user, setUser] = useState();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo);
    if (userInfo) {
      navigate('/chats');
    }
  }, [navigate]);

  // handling changes in a form  
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
      setImage(e.target.files[0]); // Set the selected image
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // login form handling
  const handleSubmit = async () => {
    console.log(formData);
    try {
      const res = await axios.post(`${baseUrl}/api/user/login`, formData);
      console.log(res.data);
      // localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate('/chats');
    }
    catch (error) {
      console.log(error);
    }
  }

  // SignUp form handling
  const handleSignUp=async()=>{
    console.log(formData);
    try {
      const res = await axios.post(`${baseUrl}/api/user/register`, formData);
      console.log(res.data);  
      alert("User Added");    
    }
    catch (error) {
      console.log(error);
    }
  }


  const loginCard = () => {
    return (
      <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  placeholder='Email...'
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required=""
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  placeholder='Password...'
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required=""
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => { handleSubmit() }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

        </div>
      </div>
    )
  }

  const signUpCard = () => {
    return (
      <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create your New Account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  placeholder='Name.....'
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required=""
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  placeholder='Email...'
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required=""
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  placeholder='Password...'
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required=""
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

            </div>
            <div>
              <button
                type="button"
                onClick={() => { handleSignUp() }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

        </div>
      </div>
    )
  }

  const handleLoginState = () => {
    setLoginState((prevState) => !prevState);
  };

  return (

    <div className='flex w-full h-screen justify-center items-center'>

      <div>
        <div className='grid grid-cols-2 h-auto w-full bg-gray-300'>
          <button className='col-span-1 py-1 active:bg-gray-600 active:rounded-4xl mt-2 m-1' onClick={handleLoginState}>Login</button>
          <button className='col-span-1 py-1 active:bg-gray-600 active:rounded-4xl mt-2 m-1' onClick={handleLoginState} >Sign Up</button>
        </div>
        {(loginState) ? loginCard() : signUpCard()}
      </div>
    </div>
  )
}

export default Home