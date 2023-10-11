import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Signup from './Components/Signup';
import Signin from './Components/Signin';

const LoginPage = () => {

	const location = useLocation();
	const [signupPageRequested, setPageRequested] = useState(true);
	
	// based on whether pathname is signin or signup, display corresponding component
	useEffect(() => {
		if (location.pathname == "/signin") {
			setPageRequested(false);
		} else {
			setPageRequested(true);
		}
	})

	return (
		<div className="h-screen bg-gray-900">
			{signupPageRequested ? <Signup/> : <Signin/>}
		</div>
	);
}

export default LoginPage;