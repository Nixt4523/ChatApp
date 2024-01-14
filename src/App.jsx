/* eslint-disable react/prop-types */
import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { AuthContext } from "./context/AuthContext.jsx";
import { FullscreenContext } from "./context/FullscreenContext";
import { ThemeContext } from "./context/ThemeContext";

function App() {
	const theme = useContext(ThemeContext);
	const fullscreen = useContext(FullscreenContext);
	const currentUser = useContext(AuthContext);

	const ProtectedRoute = ({ children }) => {
		if (!currentUser) {
			return <Navigate to="/login" />;
		}

		return children;
	};

	return (
		<div
			data-theme={theme.theme}
			className={`w-screen min-h-screen bg-base-200`}
		>
			<BrowserRouter>
				<Routes>
					<Route path="/">
						<Route
							index
							element={
								<div
									className={`${
										fullscreen.fullscreen ? "md:w-full" : "md:w-3/4"
									} mx-auto transition-[width] duration-500 w-full`}
								>
									<ProtectedRoute>
										<HomePage />
									</ProtectedRoute>
								</div>
							}
						/>
						<Route
							path="login"
							element={
								<div className="md:w-full mx-auto w-[90vw]">
									<LoginPage />
								</div>
							}
						/>
						<Route
							path="register"
							element={
								<div className="md:w-full w-[90vw] mx-auto">
									<RegisterPage />
								</div>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
