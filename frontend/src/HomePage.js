import Header from './Components/Header';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// TODO
// 	- Make dropdown menu disappear when hovered away from
//  - Multiple classes makes space appear between searchbar and dropdown
//  - Link section in hero moves when dropdown is visible
const HomePage = () => {

	const supportedClasses = ["CS 4349"];
    const [dropdownVisible, setDropdownVisible] = useState(false);
	const [selectedClass, setSelectedClass] = useState(supportedClasses[0]);
	const [searchValue, setSearchValue] = useState("");
	const navigate = useNavigate();

	// on new class selection in dropdown menu
	const handleDropdownChange = (val) => {
		setSelectedClass(val);
		setDropdownVisible(false);
	}

	// on user prompt submit
	const handleSubmit = () => {
		console.log(searchValue);
		navigate("/chatbot", {state: {userIn: searchValue}});
		// HANDLE AXIOS REQUEST TO BACKEND, OPEN UP CHATBOT PAGE WITH USER PROMPT

	}

    return (
        <div className="h-screen bg-gray-900">
      		<Header page={"home"}/>

			{/* main content */}
			<div className="h-full overflow-hidden">
				<div className="relative isolate bg-gray-900 px-16 h-full">

					{/* gradient effect */}
					<svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
						<circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
						<defs>
						<radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
							<stop stopColor="#7775D6" />
							<stop offset="1" stopColor="#E935C1" />
						</radialGradient>
						</defs>
					</svg>

					{/* hero section */}
					<div className="mx-auto max-w-lg text-center lg:flex-auto lg:py-32">
						{/* hero text */}
						<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">a new way of learning</h2>
						<p className="mt-6 text-lg leading-8 text-gray-300">choose a class and start asking Virtual-TA any question you may have by entering it in the box below</p>
					
						{/* searchbox */}
						<div className="mt-10 flex">
							<div className="grid grid-rows-2">
								<button onClick={() => setDropdownVisible(!dropdownVisible)} className="h-12 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-l-lg focus:ring-4 focus:outline-none bg-gray-700 hover:bg-gray-600 focus:ring-gray-700 border-gray-600 text-white w-36">
									{selectedClass}
									<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
									</svg>
								</button>

								<div className={dropdownVisible ? "z-10 divide-y divide-gray-100 rounded-lg shadow bg-gray-700" : "z-10 hidden divide-y divide-gray-100 rounded-lg shadow bg-gray-700"}>
									<ul className="py-2 text-sm text-gray-200">
										{
											supportedClasses.map((obj, idx) => {
												return(
													<li key={idx}>
														<button value={obj} onClick={(e) => handleDropdownChange(e.target.value)} className="inline-flex w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-600 hover:text-white">
															{obj}
														</button>
													</li>
												);
											})
										}
									</ul>
								</div>
							</div>

							<div className="relative w-full">
								<input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="block p-2.5 h-12 w-full z-20 text-sm rounded-r-lg border-l-2 border focus:ring-blue-500 bg-gray-700 border-l-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500" placeholder="Enter prompt here..."/>
								<button onClick={handleSubmit} type="submit" className="absolute top-0 right-0 h-12 p-2.5 text-sm font-medium text-white rounded-r-lg border border-blue-700 focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
									<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
									</svg>
								</button>
							</div>
						</div>

						{/* links */}
						<div className="mt-5 flex items-center justify-center gap-x-6">
							<Link to="signup" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Sign Up</Link>
							<Link to="about" className="text-sm font-semibold leading-6 text-white">Learn more <span>→</span></Link>
						</div>
					</div>

        		</div>
      		</div>
    	</div>
  	);
}

export default HomePage;