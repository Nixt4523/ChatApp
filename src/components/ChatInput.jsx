import React, { useContext, useEffect, useState } from "react";

import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

import {
	Timestamp,
	arrayUnion,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { v4 as uuid } from "uuid";

function ChatInput() {
	const currentUser = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const [disable, setDisable] = useState(true);
	const [sending, setSending] = useState(false);

	const [text, setText] = useState("");
	const [image, setImage] = useState(null);

	useEffect(() => {
		if (text !== "" || image !== null) {
			setDisable(false);
		} else {
			setDisable(true);
		}
	}, [text, image]);

	const sendMessage = async () => {
		setDisable(true);
		setSending(true);
		if (image) {
			const storageRef = ref(storage, uuid());

			await uploadBytesResumable(storageRef, image).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					await updateDoc(doc(db, "chats", data.chatId), {
						messages: arrayUnion({
							id: uuid(),
							text,
							senderId: currentUser.uid,
							date: Timestamp.now(),
							image: downloadURL,
						}),
					});
				});
			});
		} else {
			await updateDoc(doc(db, "chats", data.chatId), {
				messages: arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now(),
				}),
			});
		}

		await updateDoc(doc(db, "userChats", currentUser.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
			},
			[data.chatId + ".date"]: serverTimestamp(),
		});

		await updateDoc(doc(db, "userChats", data.user.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
			},
			[data.chatId + ".date"]: serverTimestamp(),
		});

		setDisable(true);
		setSending(false);
		setText("");
		setImage(null);
	};

	const handleKey = (e) => {
		if (text !== "" || image !== null || image !== undefined) {
			e.code === "Enter" && sendMessage();
		}
	};

	return (
		<div className="w-full p-4">
			<div
				className={`flex items-center justify-center gap-2 transition-transform  ${
					data.chatId === "null" ? "md:translate-y-[200%]" : null
				}`}
			>
				<div className="bg-base-100 rounded shadow-md w-full flex items-center justify-between">
					<input
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKey}
						value={text !== "" ? text[0].toUpperCase() + text.slice(1) : ""}
						type="text"
						placeholder="Type here"
						className="input w-full rounded focus:outline-none placeholder:text-base-content placeholder:opacity-50"
					/>
					<input
						onChange={(e) => setImage(e.target.files[0])}
						onKeyDown={handleKey}
						type="file"
						accept="image/*"
						id="chatImage"
						className="hidden"
					/>
					<label htmlFor="chatImage" className="p-2">
						{image ? (
							<img
								src={URL.createObjectURL(image)}
								className="w-8 h-8 object-cover rounded-md cursor-pointer dropdown"
							/>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-8 h-8 relative text-base-content opacity-50 cursor-pointer hover:text-primary hover:opacity-100 transition-colors"
							>
								<path
									fillRule="evenodd"
									d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</label>
				</div>
				<button
					onClick={sendMessage}
					className="btn btn-primary"
					disabled={disable}
				>
					{sending ? (
						<span className="flex items-center gap-2">
							<span className="hidden md:flex">sending</span>
							<span className="loading loading-dots loading-sm"></span>
						</span>
					) : (
						<span className="flex items-center gap-2">
							<span className="hidden md:flex">send</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-5 h-5"
							>
								<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
							</svg>
						</span>
					)}
				</button>
			</div>
		</div>
	);
}

export default ChatInput;
