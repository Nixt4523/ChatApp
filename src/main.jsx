import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { FullscreenState } from "./context/FullscreenContext.jsx";
import { ImagePreviewState } from "./context/ImagePreviewContext.jsx";
import { ThemeState } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthContextProvider>
			<ImagePreviewState>
				<ChatContextProvider>
					<FullscreenState>
						<ThemeState>
							<App />
						</ThemeState>
					</FullscreenState>
				</ChatContextProvider>
			</ImagePreviewState>
		</AuthContextProvider>
	</React.StrictMode>
);
