import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatbotTA from './Components/ChatbotTA';


function ChatbotPage() {
	return (
		<div className="h-screen bg-gray-900">
			<Header page={"chatbot"}/>
			
			{/* chatbot */}
			<div className="mx-20 mt-10">
				<ChatbotTA/>
			</div>
		</div>
	);
}

export default ChatbotPage;