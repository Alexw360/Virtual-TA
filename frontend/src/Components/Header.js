import { NavLink, Link } from 'react-router-dom';
import logo from '../Assets/VirtualTALogoTransparent.png';
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from '../firebase';
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from 'react';


// Header component shared among all main pages
const Header = (props) => {

    // highlight currently active tab
    let homeLinkStyle = "px-2 py-1 rounded-md";
    let chatbotLinkStyle = "px-2 py-1 rounded-md";
    let dashboardLinkStyle = "px-2 py-1 rounded-md";
    let profileLinkStyle = "px-2 py-1 rounded-md";
    let logInLinkStyle = "px-2 py-1 rounded-md";

    // for updating profile pic if logged in
    let [userLoggedIn, setUserLoggedIn] = useState(false);
    let [usernameInit, setUsernameInit] = useState("");

    if (props.page == "home") {
        homeLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "chatbot") {
        chatbotLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "dashboard") {
        dashboardLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    } else if (props.page == "profile") {
        profileLinkStyle = "bg-blue-500 px-2 py-1 rounded-md";
    }

    // TEMP TEST CODE
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                const userRef = ref(db, 'users/students/' + uid + '/name');
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    const [firstName, lastName] = data.split(' ');
                    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
                    setUsernameInit(initials);
                });

                setUserLoggedIn(true);
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
            });
            
    }, [])


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
                        
                        {userLoggedIn ?
                            <li className={profileLinkStyle}>
                            <NavLink to='/profile'>
                            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <span className="font-medium text-gray-300">{usernameInit}</span>
                            </div>
                            </NavLink>
                            </li>
                        :
                            <li className={logInLinkStyle}>
                            <NavLink to='/signin'>
                            <p className="block py-2 pl-3 pr-4 rounded text-white hover:text-amber-200 bg-transparent underline">Log In</p>
                            </NavLink>
                            </li>
                        }

                    </ul>
                </div>
                
            </div>
        </nav>
    );
}

export default Header;
