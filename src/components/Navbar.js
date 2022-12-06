import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {AiOutlineClose, AiOutlineMenu, AiOutlineMail} from 'react-icons/ai'
import {FaLinkedinIn, FaGithub} from 'react-icons/fa'
import {BsFillPersonLinesFill} from 'react-icons/bs'

const Navbar = () => {

    const [nav, setNav] = useState(false);

  return (
    <div className="w-full h-20 shadow-xl bg-[#ecf0f3] z-[100]">
        <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
            <h1>SCHEDULER</h1>
            <div>
            <ul className="hidden md:flex">
            <Link
        to="/"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        ACASA
      </Link>
      <Link
        to="/todoist"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        Todoist
      </Link>
      <Link
        to="/toggl"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        TOGGL
      </Link>
      <Link
        to="/admin"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        Admin
      </Link>
            </ul>
            <div className="md:hidden">
                <AiOutlineMenu size={25} onClick={() => {setNav(!nav)}}/>
            </div>
            <div className={nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""}>
                <div className={nav ? 
                    "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 ease-in duration-500" : 
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
                <div className="py-4 flex flex-col">
                    <ul className="uppercase flex flex-col">
                    <Link
                    onClick={() => {setNav(!nav)}}
        to="/"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        ACASA
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/todoist"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        Todoist
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/toggl"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        TOGGL
      </Link>
      <Link
      onClick={() => {setNav(!nav)}}
        to="/admin"
        className="bg-red-100 text-xl shadow-xl rounded-xl p-3 m-1 hover:scale-[110%]"
      >
        Admin
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
