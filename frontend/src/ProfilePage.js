import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import profilePic from './Assets/TemocProfile.jpeg';

function ProfilePage() {
	return (
		<div className="bg-gray-900 min-h-screen pb-4">
            <Header page={"profile"} />
            {/* Profile Card Section */}
            <section className="pt-4"> {/* Adjusted from pt-16 to pt-4 */}
                <div className="w-full lg:w-4/12 px-4 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-4"> {/* Also reduced mt-16 to mt-4 */}
                        <div className="px-6">
							{/* Profile Image and Stats */}
							<div className="flex flex-wrap justify-center">
								<div className="w-full px-4 flex justify-center">
									<div className="w-full flex justify-center">
										<img src={profilePic} alt="Profile" className="rounded-full max-w-xs" />
									</div>
								</div>
								<div className="w-full px-4 text-center mt-6">
									<div className="flex justify-center py-4 lg:pt-4 pt-8">
										<div className="mr-4 p-3 text-center">
											<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
												1
											</span>
											<span className="text-sm text-blueGray-400">Chats</span>
										</div>
										<div className="mr-4 p-3 text-center">
											<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
												1
											</span>
											<span className="text-sm text-blueGray-400"> Supported Courses</span>
										</div>
										<div className="lg:mr-4 p-3 text-center">
											<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
												89
											</span>
											<span className="text-sm text-blueGray-400">Credits</span>
										</div>
									</div>
								</div>
							</div>
							{/* Profile Information */}
							<div className="text-center mt-66">
								<h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
									Temoc Smith
								</h3>
								<div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
									<i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
									Student at University of Texas at Dallas
								</div>
								<div className="mb-2 text-blueGray-600 mt-8">
									<i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
									Supported Courses
								</div>
								<div className="mb-2 text-blueGray-600">
									<i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
									CS 4349
								</div>
							</div>
							{/* Credits Section */}
							<div className="mt-10 py-10 border-t border-blueGray-200 text-center">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-9/12 px-4">
										<p className="mb-4 text-lg leading-relaxed text-blueGray-700">
											Other Courses:
										</p>
										<div className="grid grid-cols-2 gap-4">
											<span>CS 3162</span>
											<span>CS 4348</span>
											<span>CS 4485</span>
											<span>CS 4390</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ProfilePage;
