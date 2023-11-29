import { useContext, useState } from "react";

import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../Firebase.js";

import Chats from "./Chats";

import { AuthContext } from "../context/AuthContext.jsx";

function Searchbar() {
	const [email, setEmail] = useState("");
	const [user, setUser] = useState(null);

	const [err, setErr] = useState(false);
	const [loading, setLoading] = useState(false);

	const currentUser = useContext(AuthContext);

	const searchUser = async () => {
		setLoading(true);
		const q = query(collection(db, "users"), where("email", "==", email));

		const querySnapshot = await getDocs(q);
		if (querySnapshot.docs.length === 0) {
			setEmail("");
			setErr(true);
		}

		try {
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
				console.log(doc.data());
			});
		} catch (error) {
			setErr(true);
		}
		setLoading(false);
	};

	const handleKey = (e) => {
		if (currentUser.email !== email) {
			e.code === "Enter" && searchUser();
		}
	};

	const selectUser = async () => {
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: user.uid + currentUser.uid;
		try {
			const res = await getDoc(doc(db, "chats", combinedId));

			if (!res.exists()) {
				await setDoc(doc(db, "chats", combinedId), { messages: [] });

				await updateDoc(doc(db, "userChats", currentUser.uid), {
					[combinedId + ".userInfo"]: {
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});

				await updateDoc(doc(db, "userChats", user.uid), {
					[combinedId + ".userInfo"]: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});
			}
		} catch (err) {
			console.log(err);
		}

		setEmail("");
		setUser(null);
	};

	return (
		<div className="w-full">
			<div className="py-2 px-3 flex items-center gap-1">
				<input
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					onKeyDown={handleKey}
					type="text"
					placeholder="Search for people..."
					className="input input-bordered w-full bg-base-200 focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
				/>
				<button
					disabled={email === "" ? true : false}
					className="p-3 bg-primary md:hidden rounded"
					onClick={() => {
						email !== currentUser.email && searchUser();
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 text-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</button>
			</div>
			<div className="p-3 space-y-2">
				{err && (
					<div
						className="alert cursor-pointer my-2 text-error flex"
						onClick={() => setErr(false)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>User not found..!</span>
					</div>
				)}
				{loading && (
					<span className="loading text-primary loading-spinner block">
						loading
					</span>
				)}
				{user && (
					<>
						<div
							className="flex items-center gap-4 hover:bg-base-200 transition-colors p-2 rounded-md cursor-pointer"
							onClick={() => selectUser()}
						>
							<div className="avatar">
								<div className="w-12 rounded-full">
									<img src={user.photoURL} />
								</div>
							</div>
							<div>
								<h1 className="text-2xl">{user.displayName}</h1>
								<p className="text-base opacity-70">{user.email}</p>
							</div>
						</div>
						<div className="divider"></div>
					</>
				)}
				<span className="text-sm opacity-50">Conversations</span>
				<Chats />
			</div>
		</div>
	);
}

export default Searchbar;
