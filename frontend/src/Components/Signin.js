import { useState, useEffect } from 'react';
import { auth } from "../firebase";
import logo from '../Assets/VirtualTALogoTransparent.png'
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import Alert from './Alert';

// TODO
//  - Forget password functionality
//  - Remember me functionality
const Signin = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState(["", ""]);

    // attempts to login a user with the given email and password
    const loginUser = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const _ = userCredential.user;
            setLoginError(["", ""]);
            setLoginSuccess(true);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoginError([errorCode.toString(), errorMessage.toString()]);
        });
    }

    // after account creation success, navigates to the home-page
    useEffect(() => {
        if (loginSuccess) {
            const _ = setTimeout(() => {
                navigate("/profile");
            }, 3000)
        }
    }, [loginSuccess])


    return(
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

            {/* Logo */}
            <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
                <img src={logo} className="h-8 mr-3" alt="Logo" />
                UTD Virtual TA
            </Link>

            {/* form */}
            <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {/* label */}
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Sign in to your account
                    </h1>

                    {/* main content */}
                    <div className="space-y-4 md:space-y-6">
                        {/* email */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="bobross12@gmail.com"/>
                        </div>

                        {/* password */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                        </div>

                        {/* options */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" className="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <Link to="/" className="text-sm font-medium hover:underline text-white">Forgot password?</Link>
                        </div>

                        {/* error/success alerts */}
                        {loginError[0] && <Alert title={loginError[0]} items={[loginError[1]]} isSuccess={false}/>}
                        {loginSuccess && <Alert title={"Login successful!"} items={["Going to your dashboard..."]} isSuccess={true}/>}
                        
                        {/* submit button */}
                        <button onClick={loginUser} type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-primary-700 focus:ring-primary-800">Sign in</button>
                        <p className="text-sm font-light text-gray-400">
                            Don't have an account yet? <Link to="/signup" className="font-medium hover:underline text-primary-500">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;