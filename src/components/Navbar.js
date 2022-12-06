import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex w-full max-w-[100%] justify-center">
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
    </div>
  );
};

export default Navbar;
