import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';


function ChatbotPage() {
	return (
		<div className="h-screen bg-gray-900">
			<Header page={"chatbot"}/>
		</div>
	);
}

export default ChatbotPage;