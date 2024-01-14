import Chat from "../components/Chat";
import EditProfileModal from "../components/EditProfileModal";
import ImagePreview from "../components/ImagePreview";
import Sidebar from "../components/Sidebar";

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
