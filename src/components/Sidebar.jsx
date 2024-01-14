import Navbar from "./Navbar";
import Searchbar from "./Searchbar";

function Sidebar() {
	return (
		<div
			id="sidebar"
			className="md:flex flex-col w-full md:w-1/5 bg-base-100 h-full border-r border-base-200 flex-1"
		>
			<Navbar />
			<Searchbar />
		</div>
	);
}

export default Sidebar;
