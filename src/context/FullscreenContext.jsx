/* eslint-disable react/prop-types */
import { useState, createContext } from 'react';

export const FullscreenContext = createContext();

export const FullscreenState = ({ children }) => {
	const [fullscreen, setFullscreen] = useState(
		localStorage.getItem('fullscreen') === 'false' ? false : true
	);
	localStorage.setItem('fullscreen', fullscreen);

	const expandScreen = () => {
		if (fullscreen) {
			setFullscreen(false);
		} else {
			setFullscreen(true);
		}
	};

	return (
		<FullscreenContext.Provider value={{ fullscreen, expandScreen }}>
			{children}
		</FullscreenContext.Provider>
	);
};
