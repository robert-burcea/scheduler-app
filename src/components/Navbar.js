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
            <h1>SCHEDULER</h1>
            {isLoggedIn && (<div className="text-center">
              <p>Welcome, {user?.displayName}</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>)}
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
        <BiUserCircle size={35}/>
      </Link>
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
        <img className="rounded-xl" src={user?.photoURL} /> 
        {/*<BiUserCircle size={35} className="ml-[130%]" />*/}
      </Link>
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
