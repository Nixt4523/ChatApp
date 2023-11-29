import { createContext, useState } from "react";

export const ImagePreviewContext = createContext();

export const ImagePreviewState = ({ children }) => {
	const [image, setImage] = useState(null);

	return (
		<ImagePreviewContext.Provider value={{ image, setImage }}>
			{children}
		</ImagePreviewContext.Provider>
	);
};
