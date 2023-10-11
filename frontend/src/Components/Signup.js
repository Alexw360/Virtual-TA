import { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from "../firebase";
import logo from '../Assets/VirtualTALogoTransparent.png'
import { Link } from 'react-router-dom';


// TODO
//  - Make terms and conditions link to actual terms/conditions
const Signup = () => {
    return(
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

            {/* Logo */}
            <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
                <img src={logo} className="h-8 mr-3" alt="Logo" />
                UTD Virtual TA
            </Link>

            {/* form */}
            <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Create an account
                    </h1>
                    
                    <div class="space-y-4 md:space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input type="email" class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="bobross12@gmail.com"/>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                            <input type="password" placeholder="••••••••" class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-white">Confirm Password</label>
                            <input type="password" placeholder="••••••••" class="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input type="checkbox" class="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"/>
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="font-light text-gray-300">I accept the <a class="font-medium hover:underline text-primary-500" href="https://www.gptindustries.com/terms-conditions/">Terms and Conditions</a></label>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-primary-700 focus:ring-primary-800">Submit</button>

                        <p class="text-sm font-light text-gray-400">
                            Already have an account? <Link to="/signin" class="font-medium hover:underline text-primary-500">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        
        </div>
    );
}


export default Signup;