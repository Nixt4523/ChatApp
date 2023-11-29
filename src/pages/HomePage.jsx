import React from "react";

import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import ImagePreview from "../components/ImagePreview";
import EditProfileModal from "../components/EditProfileModal";

function HomePage() {
	return (
		<div className="flex w-full h-screen shadow-md overflow-hidden">
			<ImagePreview />
			<EditProfileModal />
			<Sidebar />
			<Chat />
		</div>
	);
}

export default HomePage;
