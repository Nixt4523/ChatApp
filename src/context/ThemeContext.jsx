/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeState = ({ children }) => {
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "corporate"
	);
	localStorage.setItem("theme", theme);

	const changeTheme = () => {
		if (localStorage.getItem("theme") === "corporate") {
			setTheme("business");
		} else {
			setTheme("corporate");
		}
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
