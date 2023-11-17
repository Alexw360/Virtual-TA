import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage';
import ChatbotPage from './ChatbotPage';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import AboutPage from './AboutPage';
import ProfilePage from './ProfilePage';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// make tree-structure directory for entire application
const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage/>
	},
	{
		path: "/chatbot",
		element: <ChatbotPage/>
	},
	{
		path: "/dashboard",
		element: <DashboardPage/>
	},
	{
		path: "/signup",
		element: <LoginPage/>
	},
	{
		path: "/signin",
		element: <LoginPage/>
	},
	{
		path: "/about",
		element: <AboutPage/>
	},
	{
		path: '/profile',
		element: <ProfilePage/>
	}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<RouterProvider router={router}/>
);

reportWebVitals();