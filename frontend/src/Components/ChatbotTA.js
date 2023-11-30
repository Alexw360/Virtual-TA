import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import { createChatBotMessage } from 'react-chatbot-kit';
import React, { useEffect, useRef } from 'react';
import './ChatbotTA.css';
import axios from 'axios';
import { useState } from 'react';
import { addStyles, StaticMathField } from 'react-mathquill';

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
		addStyles();
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


// React component to display line info at bottom of graph
const LinesDisplay = (props) => {

	const output  = useRef([]);
	const [observationFinished, setObservationFinished] = useState(false);
	const [linesReady, setLinesReady] = useState(false);
	const observations = useRef(null);

	useEffect(()=>{	
		observeLines(props.calculator).then(data => {
			observations.current = data;
			setObservationFinished(true);
		  }).catch(error => {
			console.error(error);
			return;
		  })
	},[]);

	useEffect(()=>{	
		if(!observationFinished){
			return;
		}

		if(output.current.length != 0){
			return; 
		}

		for(var i = 0; i < props.lines.length; i++){
			if(observations.current['line'+i].isError){
				output.current.push(<li key={i} className="line-info" style={{height:27.5,width:370}}><span style={{color:props.colors[i % props.colors.length]}}>{props.colors[i % props.colors.length]}: </span>Line could not be graphed</li>);
			}
			else{
				output.current.push(<li onClick={focusLine.bind(this, i, props.calculator, props.selectedLine)} key={i} className="line-info" style={{height:27.5,width:370}}> <span style={{color:props.colors[i % props.colors.length]}}>{props.colors[i % props.colors.length]}: </span><StaticMathField>{'y='+String(props.lines[i])}</StaticMathField></li>);
			}
		}
		setLinesReady(true);
	},[observationFinished]);

	return(
		<div>{linesReady ? <div className="line-info-container" style={{width:375}}><ul>{output.current}</ul></div> : <p>Loading...</p>}</div> 
	)
}


// changes selected line to be dashed
function focusLine(lineID, calculator, selectedLine){
	if(selectedLine.current != null)
		calculator.setExpression({id:'line'+selectedLine.current, lineStyle:window.Desmos.Styles.SOLID});
	calculator.setExpression({id:'line'+lineID, lineStyle:window.Desmos.Styles.DASHED});
	selectedLine.current = lineID;
	return;
}

// returns error status of all lines
const observeLines = (calculator) => {
	return new Promise(function(resolve, reject){
		let observations = null;
		calculator.observe('expressionAnalysis', function() {	
			observations = calculator.expressionAnalysis;
			
			if(observations == null)
				reject('ERR: Desmos returned null for line observations');
			else
				resolve(observations);
		});
	});
}

// widget that displays the graph 
const GraphWidget = (props) => {
	const [scriptLoaded, setScriptLoaded] = useState(false);
	const [lineReady, setLineReady] = useState(false);
	const lines = useRef(null);
	const colors = useRef(null);
	const calculator = useRef(null);
	const selectedLine = useRef(null);

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
		if(element !== null && element.children.length !== 0){
			element.children.item(0).remove();
		}
			
		calculator.current = window.Desmos.GraphingCalculator(document.getElementById('graph'+props.payload.id),{expressions:false,settingsMenu:false});
		lines.current = props.payload.lines;
		colors.current = Object.keys(window.Desmos.Colors);

		for(var i = 0; i < lines.current.length; i++){
			calculator.current.setExpression({id:'line' + i, latex:'y='+lines.current[i], color:colors.current[i % colors.current.length]});
		}

		setLineReady(true);
		 
	}, [scriptLoaded]);

	return (
		<div>
			<div id= {'graph'+props.payload.id} style={{ width: 375, height: 250}}> </div>
			{lineReady ? <LinesDisplay {...{lines:lines.current, colors:colors.current, calculator:calculator.current, selectedLine:selectedLine}}></LinesDisplay> : <p>Loading...</p>}
		</div>
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