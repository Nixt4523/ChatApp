import { useContext, useEffect, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase.js";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Chats() {
	const [chats, setChats] = useState([]);
	const [loading, setLoading] = useState(false);
	const currentUser = useContext(AuthContext);
	const { dispatch, data } = useContext(ChatContext);

	useEffect(() => {
		setLoading(true);
		const getChats = () => {
			const unSubscribe = onSnapshot(
				doc(db, "userChats", currentUser.uid),
				(doc) => {
					if (doc.data()) {
						setChats(doc.data());
					}
				}
			);

			setLoading(false);
			return () => {
				unSubscribe();
			};
		};

		currentUser.uid && getChats();
	}, [currentUser.uid]);

	const selectUser = (user) => {
		dispatch({ type: "CHANGE_USER", payload: user });

		let sidebar = document.getElementById("sidebar");
		sidebar.classList.add("hidden");

		let chatWindow = document.getElementById("chats");
		chatWindow.classList.remove("hidden");
	};

	const Loader = () => {
		return (
			<div className="flex animate-pulse items-center gap-4 md:p-4 p-2 w-full ">
				<div className="avatar placeholder">
					<div className="w-12 rounded-full bg-base-200"></div>
				</div>
				<div className="w-full space-y-2">
					<div className="bg-base-200 w-2/3 h-6 rounded-md"></div>
					<div className="opacity-70 w-1/2 bg-base-200 h-4 rounded-md"></div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-0 md:space-y-2">
			{loading && (
				<>
					<Loader />
					<Loader />
					<Loader />
				</>
			)}
			{Object.entries(chats)
				.sort((a, b) => {
					b[1].date - a[1].date;
				})
				.map((chat) => {
					return (
						<div
							onClick={() => selectUser(chat[1].userInfo)}
							className={`flex items-center gap-4 hover:bg-base-200 transition-colors md:p-4 p-2 rounded-md cursor-pointer w-full ${
								data?.user.uid === chat[1].userInfo.uid ? "bg-base-200" : null
							}`}
							key={chat[0]}
						>
							<div className="avatar">
								<div className="w-12 rounded-full">
									<img src={chat[1].userInfo.photoURL} />
								</div>
							</div>
							<div>
								<h1 className="text-2xl">{chat[1].userInfo.displayName}</h1>
								<p className="text-base opacity-70">
									{chat[1].lastMessage?.text.slice(0, 25)}
									{chat[1].lastMessage?.text.length > 25 ? "..." : ""}
								</p>
							</div>
						</div>
					);
				})}
		</div>
	);
}

export default Chats;
