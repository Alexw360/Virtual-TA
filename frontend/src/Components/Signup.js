import { useState, useEffect } from 'react';
import { auth } from "../firebase";
import logo from '../Assets/VirtualTALogoTransparent.png'
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Alert from './Alert';

// TODO
//  - Make terms and conditions link to actual terms/conditions
const Signup = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTOC, setAcceptedTOC] = useState(false);
    const [accountSuccess, setAccountSuccess] = useState(false);
    const [creationError, setError] = useState(["", ""]);

    // creates a user account if password fields match and terms-conditions are accepted
    // and also passes all firebase auth rules (valid email, valid password, etc)
    const addUserToDB = () => {
        // validate and add user to DB
        if (password === confirmPassword && acceptedTOC) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const _ = userCredential.user;
                setError(["", ""]);
                setAccountSuccess(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError([errorCode.toString(), errorMessage.toString()]);
            });
        } else if (password !== confirmPassword) {
            setError(["Password's don't match!", "The entered password fields don't have the same value"]);
        } else {
            setError(["Terms and Conditions not accepted!", "Please accept our TOC to make an account"]);
        }
    }

    // after account creation success, navigates to the home-page
    useEffect(() => {
        if (accountSuccess) {
            const _ = setTimeout(() => {
                navigate("/profile");
            }, 3000)
        }
    }, [accountSuccess])

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
                        Create an account
                    </h1>
                    
                    <div className="space-y-4 md:space-y-6">
                        {/* email */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="bobross12@gmail.com"/>
                        </div>
                        
                        {/* password fields */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                        </div>

                        {/* terms and conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input onChange={(e) => setAcceptedTOC(e.target.checked)} type="checkbox" className="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"/>
                            </div>
                            <div className="ml-3 text-sm">
                                <label className="font-light text-gray-300">I accept the <a className="font-medium hover:underline text-primary-500" href="https://www.gptindustries.com/terms-conditions/">Terms and Conditions</a></label>
                            </div>
                        </div>

                        {/* error/success alerts */}
                        {creationError[0] && <Alert title={creationError[0]} items={[creationError[1]]} isSuccess={false}/>}
                        {accountSuccess && <Alert title={"Account Created!"} items={["Going to your dashboard..."]} isSuccess={true}/>}

                        <button onClick={addUserToDB} type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-primary-700 focus:ring-primary-800">Submit</button>
                        <p className="text-sm font-light text-gray-400">
                            Already have an account? <Link to="/signin" className="font-medium hover:underline text-primary-500">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Signup;