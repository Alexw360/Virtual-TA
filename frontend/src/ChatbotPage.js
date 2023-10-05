import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatbotTA from './Components/ChatbotTA';
import { useLocation } from 'react-router-dom';


function ChatbotPage() {

	// if user coming from home-page search-bar, retrieve their entered input
	const {state} = useLocation();
	const userMsg = "";
	if (state != null) {
		const {userIn} = state;
		userMsg = userIn;
	}

	return (
		<div className="h-screen bg-gray-900">
			<Header page={"chatbot"}/>
			
			{/* chatbot */}
			<div className="mx-20 mt-10">
				<ChatbotTA initialUserMessage={userMsg}/>
			</div>
		</div>
	);
}

export default ChatbotPage;