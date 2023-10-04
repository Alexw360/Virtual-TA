import { NavLink, Link } from 'react-router-dom';
import logo from '../Assets/VirtualTALogoTransparent.png'

// Header component shared among all main pages
const Header = (props) => {

    // highlight currently active tab
    let homeLinkStyle = "px-2 py-1 rounded-md";
    let chatbotLinkStyle = "px-2 py-1 rounded-md";
    let dashboardLinkStyle = "px-2 py-1 rounded-md";

    if (props.page == "home") {
        homeLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "chatbot") {
        chatbotLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "dashboard") {
        dashboardLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    }


    return (
        <nav className="border-b border-gray-600 rounded-2xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 shadow-2xl drop-shadow-2xl">

                {/* Logo */}
                <Link to="/app" className="flex items-center">
                    <img src={logo} className="h-8 mr-3" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UTD Virtual TA</span>
                </Link>

                {/* Menu elements */}
                <div className="w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <li className={homeLinkStyle}>
                        <NavLink to='/'>
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0 dark:text-white md:dark:hover:text-amber-200 dark:hover:bg-gray-700 dark:hover:text-amber-200 md:dark:hover:bg-transparent">Home</p>
                        </NavLink>
                        </li>

                        <li className={chatbotLinkStyle}>
                        <NavLink to='/chatbot'>
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0 dark:text-white md:dark:hover:text-amber-200 dark:hover:bg-gray-700 dark:hover:text-amber-200 md:dark:hover:bg-transparent">Chatbot</p>
                        </NavLink>
                        </li>

                        <li className={dashboardLinkStyle}>
                        <NavLink to='/dashboard'>
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0 dark:text-white md:dark:hover:text-amber-200 dark:hover:bg-gray-700 dark:hover:text-amber-200 md:dark:hover:bg-transparent">Dashboard</p>
                        </NavLink>
                        </li>
                    </ul>
                </div>
                
            </div>
        </nav>
    );
}

export default Header;
