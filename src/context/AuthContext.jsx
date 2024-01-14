/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});

		return () => {
			unSubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
	);
};
