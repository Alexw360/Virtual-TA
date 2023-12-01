import Header from './Components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatbotTA from './Components/ChatbotTA';
import { useLocation } from 'react-router-dom';
import { db, auth } from './firebase';
import { ref, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";


function ChatbotPage() {

	// if user coming from home-page search-bar, retrieve their entered input
	const {state} = useLocation();
	let userMsg = "";
	if (state != null) {
		const {userIn} = state;
		userMsg = userIn;
	}

	const [selected, setSelected] = useState("");
	const [uid, SetUID] = useState("");

	useEffect(()=>{
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				const uid = user.uid;
				SetUID(uid);
			} else {
				console.log("user is logged out")
			}
			});
	}, [])

	const sendFeedback = () => {
		if (uid != "") {
			set(ref(db, 'feedback/' + uid), {
				rating: selected
			});
		}
	}

	return (
		<div className="h-screen bg-gray-900">
			<Header page={"chatbot"}/>
			
			{/* chatbot */}
			<div className="mx-20 mt-10">
				<ChatbotTA initialUserMessage={userMsg}/>
				<div class="flex flex-col items-end p-4">
					<div className="flex items-center">
					<label class="mr-2 text-white">Rate the chatbot:</label>
					<select class="bg-gray-100 text-gray-800 p-2 rounded" onChange={(e) => setSelected(e.target.value)} value={selected}>
						<option value="1">1 (Bad)</option>
						<option value="2">2 (Poor)</option>
						<option value="3">3 (Decent)</option>
						<option value="4">4 (Helpful)</option>
						<option value="5">5 (Excellent)</option>
					</select>
					<button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={sendFeedback}>
        			Send
      				</button>
					</div>
					<a class="text-blue-500 text-md p-4 underline" target="_blank" href="https://forms.gle/4a6uTXzeWTvQHpFd9">Fill out our survey form too!</a>
				</div>
			</div>
		</div>
	);
}

export default ChatbotPage;