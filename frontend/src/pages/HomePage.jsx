import React, { useState } from 'react'

const Home = () => {

  const [loginState, setLoginState] = useState(true);

  const loginCard = () => {
    return (
      <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
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

  const signUpCard=()=>{
    return(
      <div className="flex h-auto py-2 w-auto px-20 rounded-b-xl bg-gray-300 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create your New Account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              {/* Confirm Password */}

              <div>
              <label
                htmlFor="cpass"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  placeholder='Confirm Password...'
                  type="password"
                  name="cpass"
                  id="cpass"
                  autoComplete="current-password"
                  required=""
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>


            </div>
            <div>
              <button
                type="submit"
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
        {(loginState)?loginCard():signUpCard()}
      </div>
    </div>
  )
}

export default Home