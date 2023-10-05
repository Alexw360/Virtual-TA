import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import './ChatbotTA.css';


// custom configuration for chat-bot
const config = {
    initialMessages: [createChatBotMessage('Welcome to Virtual-TA!')],
    botName: "Virtual TA",
}

// handles responding to user input
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const handleInput = (msg) => {
		const botMessage = createChatBotMessage(msg);
		setState((prev) => ({
			...prev,
			messages: [...prev.messages, botMessage],
		}));
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
  

const ChatbotTA = () => {
    return (
        <>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </>
    );
}

export default ChatbotTA;