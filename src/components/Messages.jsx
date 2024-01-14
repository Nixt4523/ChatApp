import { useContext, useEffect, useState } from "react";

import Message from "./Message";

import { ChatContext } from "../context/ChatContext";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

function Messages() {
	const [messages, setMessages] = useState([]);

	const { data } = useContext(ChatContext);

	useEffect(() => {
		const unSubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});

		return () => {
			unSubscribe();
		};
	}, [data.chatId]);

	return (
		<div className="overflow-scroll scroll-smooth will-change-scroll">
			{messages?.map((message) => {
				return <Message message={message} key={message.id} />;
			})}
		</div>
	);
}

export default Messages;
