import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {AiOutlineClose, AiOutlineMenu, AiOutlineMail} from 'react-icons/ai'
import {FaLinkedinIn, FaGithub} from 'react-icons/fa'
import {BsFillPersonLinesFill} from 'react-icons/bs'
import { AiFillHome } from "react-icons/ai";
import { SiTodoist, SiToggl } from "react-icons/si";
import { BiUserCircle } from "react-icons/bi";
import userEvent from "@testing-library/user-event";
import {useData, useSetData} from '../GlobalContext'
import 'firebase/auth';
import { signInWithGoogle, logout } from '../firebase';

const Navbar = ({user, handleSignOut, setIsLoggedIn, isLoggedIn}) => {
    const data = useData();
    const setData = useSetData();
    const [nav, setNav] = useState(false);
    
  return (
    <div className="w-full h-20 shadow-xl bg-[#220a2e] z-[100]">
        <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
            <h1>SCHEDULER
            {isLoggedIn && (<div className="">
              <p className="text-sm">for {user?.displayName}</p>
            </div>)}
            </h1>
            <div>
            <ul className="hidden md:flex">
            <Link
        to="/"
        className="flex items-center text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        <AiFillHome size={40}/>
      </Link>
      <Link
        to="/todoist"
        className="flex items-center text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        <SiTodoist size={35} color={'red'}/>
      </Link>
      <Link
        to="/toggl"
        className="flex items-center text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        <SiToggl size={35} color={'#a04a97'}/>
      </Link>
      <Link
        to="/admin"
        className="flex items-center text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        {isLoggedIn ? <img className="rounded-full h-[50px] align-center" src={user?.photoURL} /> : <BiUserCircle size={35}/>}
      </Link>
      <button onClick={handleSignOut} type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.0 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign out
              </button>
            </ul>
            <div className="md:hidden">
                <AiOutlineMenu size={25} onClick={() => {setNav(!nav)}}/>
            </div>
            <div className={nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""}>
                <div className={nav ? 
                    "fixed left-0 top-0 w-[45%] sm:w-[45%] md:w-[15%] h-screen bg-[#220a2e] p-10 ease-in duration-500" : 
                    "fixed left-[-100] hidden"}>
                <div>
                    <div className="flex w-full items-center justify-between">
                        <h1>SCHEDULER</h1>
                        <div className="rounded-full shadow-3xl shadow-black p-3 cursor-pointer">
                            <AiOutlineClose size={25} onClick={() => {setNav(!nav)}} />
                        </div>
                    </div>
                    <div className="border-b border-gray-300 my-4 text-left">
                        <p className="w-[85%] md:w-[90%] py-4">MENU</p>
                    </div>
                </div>
                <div className="py-4 flex items-center">
                    <ul className="uppercase flex flex-col justify-items-center">
                    <Link
                    onClick={() => {setNav(!nav)}}
        to="/"
        className="text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
       <AiFillHome size={35} className="ml-[130%]" />
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/todoist"
        className="text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        <SiTodoist size={35} color={'red'} className="ml-[130%]" />
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/toggl"
        className="text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        <SiToggl size={35} color={'#a04a97'} className="ml-[130%]" />
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/admin"
        className="text-xl shadow-xl rounded-xl m-1 hover:scale-[90%] md:hover:scale-[110%]"
      >
        {isLoggedIn ? <img className="rounded-full h-[50px] ml-[110%]" src={user?.photoURL} /> : <BiUserCircle size={35} className="ml-[130%]" />}
      </Link>
      <button onClick={handleSignOut} type="button" class="rounded-full h-[50px] ml-[110%] bg-[#412a4c]">
                Sign out
              </button>
                    </ul>
                </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default Navbar;
