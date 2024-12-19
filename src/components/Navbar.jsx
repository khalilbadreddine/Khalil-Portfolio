import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-50">
      {/* Logo */}
      <div className="text-white text-3xl font-extrabold tracking-widest hover:text-pink-600 transition duration-300">
        KHALIL<span className="text-pink-600">*</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-gray-400 uppercase text-sm font-medium tracking-widest">
        <li>
          <a href="#work" className="hover:text-white transition duration-300">
            Work
          </a>
        </li>
        <li>
          <a href="#playground" className="hover:text-white transition duration-300">
            Playground
          </a>
        </li>
        <li>
          <a href="#about" className="hover:text-white transition duration-300">
            About Me
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
