import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';


function ProfilePage() {
	return (
		<div className="h-screen bg-gray-900">
			<Header page={"profile"}/>
		</div>
	);
}

export default ProfilePage;