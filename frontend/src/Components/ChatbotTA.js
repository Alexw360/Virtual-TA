import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import './ChatbotTA.css';
import axios from 'axios';
import { useState } from 'react';


// custom configuration for chat-bot
const config = {
    initialMessages: [createChatBotMessage('Welcome to Virtual-TA!')],
    botName: "Virtual TA",
	state: {
		initialUserMessage: "",
	}
}

// handles responding to user input
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
	const handleInput = async (msg) => {
		let apiURL = 'http://127.0.0.1:8095/botresponse';
		axios.post(apiURL, {
			query: msg,
			sid: 1
		}).then(response => {
			const botMessage = createChatBotMessage(response.data.Answer);
			setState((prev) => ({
				...prev,
				messages: [...prev.messages, botMessage],
			}));
		}).catch(error => {
			const botMessage = createChatBotMessage(error);
			setState((prev) => ({
				...prev,
				messages: [...prev.messages, botMessage],
			}));
		});
	}

	return (
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					actions: {
						handleInput,
					},
				});
			})}
		</div>
    );
};

// handles processing user input
const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
		actions.handleInput(message);
    };
  
    return (
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					parse: parse,
					actions: {},
				});
			})}
		</div>
    );
};
  

const ChatbotTA = (props) => {
    return (
        <>
          <Chatbot
            config={{
				initialMessages: [createChatBotMessage('Welcome to Virtual-TA!')],
				botName: "Virtual TA",
				state: {
					initialUserMessage: "SAKDJASKJD",
				}
			}}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </>
    );
}

export default ChatbotTA;