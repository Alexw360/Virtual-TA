import Header from './Components/Header';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from './firebase';
import { ref, onValue, set, update, push } from "firebase/database";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ProfilePage() {

	// grabbing user details
	const navigate = useNavigate();
	let [uid, setUID] = useState("");
	let [userLoggedIn, setUserLoggedIn] = useState("");
    let [username, setUsername] = useState("");
	let [usernameInit, setUsernameInit] = useState("");
	let [email, setEmail] = useState("");
	let [name, setName] = useState("");
	let [credits, setCredits] = useState(0);
	let [courses, setCourses] = useState([]);
	let [chats, setChats] = useState(0);

	let [enteredCredits, setEnteredCredits] = useState(0);
	let [enteredCourse, setEnteredCourse] = useState("");

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
				setUID(uid);
                const userRef = ref(db, 'users/students/' + uid);
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
					setUsername(data.username);
					setEmail(data.email);
					setName(data.name);
					setCredits(data.credits);
					const courseArr = [];
					Object.values(data.courses).forEach(value => {
						if(value != "NULL") {
							courseArr.push(value);
						}
					});
					setCourses(courseArr);
					setChats(data.chats);
                    const [firstName, lastName] = data.name.split(' ');
                    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
                    setUsernameInit(initials);
                });

				setUserLoggedIn(true);
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
            });
            
    }, [])

	const updateDBCredit = () => {
		if (enteredCredits != "" && /^\d+$/.test(enteredCredits)) {
			update(ref(db, 'users/students/' + uid), {
				credits: enteredCredits
			});
		}
	}

	const updateDBCourses = () => {
		if (enteredCourse != "") {
			push(ref(db, 'users/students/' + uid + '/courses'), enteredCourse);
		}
	}

	const doLogOut = () => {
		if (userLoggedIn) {
			signOut(auth).then(() => {
				navigate("/");
			}).catch((error) => {
				console.log(error);
			});
		}
	}

	return (
		<div className="h-screen bg-gray-900 overflow-y-auto">
			<Header page={"profile"}/>

            {/* Profile Card Section */}
			<div className="w-full lg:w-4/12 px-4 mx-auto">
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-4"> {/* Also reduced mt-16 to mt-4 */}
					<div className="px-6">
						{/* Profile Image and Stats */}
						<div className="flex flex-wrap justify-center">
							<div className="w-full px-4 flex justify-center">
								<div className="w-full flex justify-center">
									<div className="mt-8 relative inline-flex items-center justify-center w-40 h-40 overflow-hidden bg-blue-500 rounded-full">
										<span className="font-medium text-4xl text-white">{usernameInit}</span>
									</div>
								</div>
							</div>
							<div className="w-full px-4 text-center mt-6">
								<div className="flex justify-center py-4 lg:pt-4 pt-8">
									<div className="mr-4 p-3 text-center">
										<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
											{chats}
										</span>
										<span className="text-sm text-blueGray-400">Chats</span>
									</div>
									<div className="mr-4 p-3 text-center">
										<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
											{courses.length}
										</span>
										<span className="text-sm text-blueGray-400"> Supported Courses</span>
									</div>
									<div className="lg:mr-4 p-3 text-center">
										<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
											{credits}
										</span>
										<span className="text-sm text-blueGray-400">Credits</span>
									</div>
								</div>
							</div>
						</div>
						{/* Profile Information */}
						<div className="text-center mt-66">
							<h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
								{name}
							</h3>
							<div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
								Student at University of Texas at Dallas
							</div>
							<div className="mb-4 text-blueGray-600 mt-8">
								Email: {email}
							</div>
							<div className="mb-2 text-blueGray-600 mt-2">
								Supported Courses
							</div>
							<div className="mb-2 text-blueGray-600">
								{courses.length != 0 ? courses.map((course, index) => {
									if(course !== "NULL") {
										return(<p key={index}>{course}</p>);
									}
								}) : <p>No Courses</p>
								}
							</div>
						</div>
						{/* Credits Section */}
						<div className="mt-10 py-10 border-t border-blueGray-200 text-center">
							<div className="flex flex-wrap justify-center">
								<div className="w-full px-4">
									<p className="mb-4 text-lg leading-relaxed text-blueGray-700">
										Settings
									</p>

									<div className="grid grid-cols-2 grid-rows-2 gap-4 w-full">
										<div>
											<label className="block mb-2 text-sm font-medium text-black">Update Credits</label>
											<input value={enteredCredits} onChange={(e) => setEnteredCredits(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="0"/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-black">Update Courses</label>
											<input value={enteredCourse} onChange={(e) => setEnteredCourse(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="CS 4349"/>
										</div>
										<div>
											<button onClick={updateDBCredit} type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-primary-700 focus:ring-primary-800">Update Credits</button>
										</div>
										<div>
											<button onClick={updateDBCourses} type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-primary-700 focus:ring-primary-800">Add Course</button>
										</div>
									</div>

									<button onClick={doLogOut} type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-primary-700 focus:ring-primary-800">Log Out</button>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>


		</div>
	);
}

export default ProfilePage;