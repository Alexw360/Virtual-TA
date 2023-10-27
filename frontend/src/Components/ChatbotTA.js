import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import { createChatBotMessage } from 'react-chatbot-kit';
import React, { useEffect, useRef } from 'react';
import './ChatbotTA.css';
import axios from 'axios';
import { useState } from 'react';

// loads necessary desmos script to create graphs
const loadDesmosScript = () =>{
	return new Promise(function(resolve, reject){
		const script = document.createElement('script');
		script.src = 'https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6'; // public api key
		script.async = true;
		script.type = 'text/javascript';	
		script.onload = resolve;
		script.onerror = reject;
		script.id = 'desmosScript';
		document.head.appendChild(script);
	});
};

// same as useEffect hook but not called on component initialization
function useUpdateEffect(callback, dependencies){
	const isMounted = useRef(false);

	useEffect(()=>{
		if(isMounted.current){
			return callback();
		}
		isMounted.current = true;
	}, dependencies);
} 

// widget that displays the graph 
const GraphWidget = (props) => {
	const [scriptLoaded, setScriptLoaded] = useState(false);

	useEffect(()=>{	
		if(document.getElementById('desmosScript') !== null)
			setScriptLoaded(true); 
		else{
			loadDesmosScript().then(function(){
				setScriptLoaded(true);
			}).catch(function(error){
				console.log("ERR: Desmos Script could not be loaded");
			}); 
		}    
	},[]);

	useUpdateEffect(() => {
		let element = document.getElementById('graph'+props.payload.id);
		if(element !== null && element.children.length !== 0)
			element.children.item(0).remove();

		const calculator = window.Desmos.GraphingCalculator(document.getElementById('graph'+props.payload.id),{expressions:false,settingsMenu:false});
		let lines = props.payload.lines;
		for(var i = 0; i < lines.length; i++){
			calculator.setExpression({id:'line' + i, latex:'y='+lines[i]});
		}
		 
	}, [scriptLoaded]);

	return (
		<div id= {'graph'+props.payload.id} style={{ width: 375, height: 250}}> </div>
	)
};

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
			let botMessage = null;
			if(Array.isArray(response.data.Graph) && response.data.Graph.length !== 0){
				botMessage = createChatBotMessage(response.data.Answer, {widget:'desmos', payload:{id:response.data.GraphID,lines:response.data.Graph}});
			}
			else{
				botMessage = createChatBotMessage(response.data.Answer);
			}
			setState((prev) => ({
				...prev,
				messages: [...prev.messages, botMessage],
			}));
		}).catch(error => {
			const botMessage = createChatBotMessage("Error!");
			console.log(error);
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
				},
				widgets:[
					{
						widgetName: 'desmos',
						widgetFunc: (props) => <GraphWidget {...props} />,
					},
				]
			}}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </>
    );
}

export default ChatbotTA;