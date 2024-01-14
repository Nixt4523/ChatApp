/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { ImagePreviewContext } from "../context/ImagePreviewContext";

function Message({ message }) {
	const currentUser = useContext(AuthContext);
	const { data } = useContext(ChatContext);
	const { setImage } = useContext(ImagePreviewContext);

	const ref = useRef();

	useEffect(() => {
		ref.current?.scrollIntoView({
			behavior: "auto",
			block: "center",
			inline: "end",
		});
	}, []);

	return (
		<div>
			{message && (
				<div
					ref={ref}
					className={`chat md:space-y-4 ${
						message.senderId === currentUser.uid ? "chat-end" : "chat-start"
					}`}
				>
					<div className="chat-image avatar">
						<div className="w-8 md:w-10 rounded-full">
							<img
								src={
									message.senderId === currentUser.uid
										? currentUser.photoURL
										: data.user.photoURL
								}
							/>
						</div>
					</div>

					{message.text !== "" && (
						<div
							className={`chat-bubble ${
								message.senderId === currentUser.uid
									? "chat-bubble-primary text-white"
									: "bg-base-100 text-primary-content"
							} md:max-w-[30%] max-w-[70%] shadow-md`}
						>
							{message.text}
						</div>
					)}

					{message.image && (
						<>
							<div
								className={`${
									message.senderId !== currentUser.uid && "text-base-content "
								}
							md:w-1/3 w-3/4 flex`}
							>
								<img
									onClick={() => setImage(message.image)}
									src={message.image}
									className={`my-2 object-contain rounded-lg cursor-pointer ${
										message.senderId === currentUser.uid ? "ml-auto" : "mr-auto"
									}`}
								/>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default Message;
