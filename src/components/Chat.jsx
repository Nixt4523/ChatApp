import React, { useContext } from "react";

import Messages from "./Messages";
import ChatInput from "./ChatInput";

import { FullscreenContext } from "../context/FullscreenContext";
import { ChatContext } from "../context/ChatContext";
import { ImagePreviewContext } from "../context/ImagePreviewContext";

function Chat() {
	const fullscreen = useContext(FullscreenContext);
	const { setImage } = useContext(ImagePreviewContext);

	const { data, dispatch } = useContext(ChatContext);

	function showSidebar() {
		let sidebar = document.getElementById("sidebar");
		sidebar.classList.remove("hidden");

		let chatWindow = document.getElementById("chats");
		chatWindow.classList.add("hidden");
		dispatch({ type: "CHANGE_USER", payload: {} });
	}

	return (
		<div
			id="chats"
			className={`${
				fullscreen.fullscreen ? "md:flex-[4]" : "md:flex-[3]"
			}  flex-col relative transition-all duration-500 w-full md:w-auto md:block hidden`}
		>
			<div className="w-full bg-base-100 md:h-[10vh] flex items-center justify-normal border-b border-base-200">
				{data.chatId !== "null" ? (
					<div className="flex items-center gap-2 md:gap-4 p-2 md:p-4">
						<button className="md:hidden" onClick={showSidebar}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
						</button>
						<div className="avatar ">
							<div
								className="w-12 rounded-full cursor-pointer"
								onClick={() => {
									setImage(data?.user.photoURL);
								}}
							>
								<img src={data.user?.photoURL} />
							</div>
						</div>
						<div>
							<h1 className="text-2xl">{data.user?.displayName}</h1>
						</div>
					</div>
				) : null}
			</div>
			<div className="overflow-y-scroll scroll-smooth max-h-[80%] md:max-h-[atuo] space-y-2 md:p-4 p-2 w-full">
				<Messages />
			</div>
			<div className="absolute bottom-0 z-50 w-full p-2 bg-base-200 h-fit">
				<ChatInput />
			</div>
		</div>
	);
}

export default Chat;
