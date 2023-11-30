import { NavLink, Link } from 'react-router-dom';
import logo from '../Assets/VirtualTALogoTransparent.png'
import profile from '../Assets/TemocProfile.jpeg'

// Header component shared among all main pages
const Header = (props) => {

    // highlight currently active tab
    let homeLinkStyle = "px-2 py-1 rounded-md";
    let chatbotLinkStyle = "px-2 py-1 rounded-md";
    let dashboardLinkStyle = "px-2 py-1 rounded-md";
    let profileLinkStyle = "px-2 py-1 rounded-md";

    if (props.page == "home") {
        homeLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "chatbot") {
        chatbotLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "dashboard") {
        dashboardLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "profile") {
        profileLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    }


    return (
        <nav className="border-b border-gray-600 rounded-2xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 shadow-2xl drop-shadow-2xl">

                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src={logo} className="h-8 mr-3" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UTD Virtual TA</span>
                </Link>

                {/* Menu elements */}
                <div className="w-auto md:block" id="navbar-default">
                    <ul className="font-medium flex p-0 mt-0 rounded-lg flex-row space-x-4 content-center">
                        <li className={homeLinkStyle}>
                            <NavLink to='/'>
                                <p className="block py-2 pl-3 pr-4 rounded text-white hover:text-amber-200 bg-transparent">Home</p>
                            </NavLink>
                        </li>

                        <li className={chatbotLinkStyle}>
                            <NavLink to='/chatbot'>
                                <p className="block py-2 pl-3 pr-4 rounded text-white hover:text-amber-200 bg-transparent">Chatbot</p>
                            </NavLink>
                        </li>

                        <li className={dashboardLinkStyle}>
                            <NavLink to='/dashboard'>
                                <p className="block py-2 pl-3 pr-4 rounded text-white hover:text-amber-200 bg-transparent">Dashboard</p>
                            </NavLink>
                        </li>

                        <li className={profileLinkStyle}>
                            <NavLink to='/profile'>
                                <img src={profile} alt="Profile" className="h-10 w-10 rounded-full" />
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Header;
