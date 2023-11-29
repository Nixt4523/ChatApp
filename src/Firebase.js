import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FirebaseApiKey,
	authDomain: import.meta.env.VITE_FirebaseAuthDomain,
	projectId: import.meta.env.VITE_FirebaseProjectId,
	storageBucket: import.meta.env.VITE_FirebaseStorageBucket,
	messagingSenderId: import.meta.env.VITE_FirebaseMessagingSenderId,
	appId: import.meta.env.VITE_FirebaseApiKey,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
