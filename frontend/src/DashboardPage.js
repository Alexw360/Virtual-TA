import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';


function DashboardPage() {
	return (
		<div className="h-screen bg-gray-900">
			<Header page={"dashboard"}/>
		</div>
	);
}

export default DashboardPage;