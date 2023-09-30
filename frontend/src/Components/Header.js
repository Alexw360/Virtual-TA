import { NavLink, Link } from 'react-router-dom';
import logo from '../Assets/VirtualTALogoTransparent.png'
import { useState } from 'react';

// TODO
const Header = () => {

    const activeLinkStyle = "bg-amber-600 px-2 py-1 rounded-md";
    const normalLinkStyle = "px-2 py-1";

    useEffect(() => {
        
    }, [])


  return (
    <nav className="bg-[#54b878] border-gray-200">
        
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/app" className="flex items-center">
            <img src={logo} className="h-8 mr-3" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UTD Virtual TA</span>
        </Link>

        <div className={"w-full block w-auto"} id="navbar-default">



        {/* className={({isActive, isPending}) => isPending ? "pending" : isActive ? "active" : ""} */}

        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li className='bg-amber-600 px-2 py-1 rounded-md'>
                <NavLink to='/'>
                    <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</p>
                </NavLink>
            </li>

            {/* <li>
            <NavLink activeStyle={{color: 'blue'}} to='/map'>
            <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Map</p>
            </NavLink>
            </li> */}
        </ul>
        </div>
    </div>
    </nav>
  );
}

export default Header;
