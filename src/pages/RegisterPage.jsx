import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../Firebase.js";

function RegisterPage() {
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [profile, setProfile] = useState(null);

	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (email !== "" && password !== "" && name !== "" && surname !== "") {
			setDisabled(false);
		}
	}, [email, password, name, surname]);

	async function registerUser() {
		setDisabled(true);
		setLoading(true);
		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);
			const storageRef = ref(storage, email.split("@")[0]);

			await uploadBytesResumable(storageRef, profile).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					try {
						await updateProfile(res.user, {
							displayName: name + " " + surname,
							photoURL: downloadURL,
						});

						await setDoc(doc(db, "users", res.user.email), {
							uid: res.user.uid,
							displayName: name + " " + surname,
							email,
							photoURL: downloadURL,
						});

						await setDoc(doc(db, "userChats", res.user.uid), {});

						navigate("/");
					} catch (err) {
						setErr(true);
						setLoading(false);
						setDisabled(false);
					}
				});
			});
		} catch (err) {
			setErr(true);
			setLoading(false);
			setDisabled(false);
		}
		setLoading(false);
	}

	return (
		<div className="w-full md:w-2/6 mx-auto h-screen flex items-center justify-center">
			<div className="w-full h-fit px-4 py-16 bg-base-100 rounded-md shadow-md flex items-center justify-center flex-col">
				<div className="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.75}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
						/>
					</svg>
					<h1 className="text-2xl font-medium">Chit Chat</h1>
				</div>
				<span className="mt-4 opacity-50">Register</span>
				<div className="w-3/4 mt-6 space-y-4">
					<div>
						<div className="flex gap-2 items-center">
							<div className="flex-1">
								<label className="label">Name</label>
								<input
									type="text"
									placeholder="John"
									value={
										name !== "" ? name[0].toUpperCase() + name.slice(1) : ""
									}
									className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="flex-1">
								<label className="label">Surname</label>
								<input
									type="text"
									placeholder="Doe"
									value={
										surname !== ""
											? surname[0].toUpperCase() + surname.slice(1)
											: ""
									}
									className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
									onChange={(e) => setSurname(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div>
						<label className="label">
							<span className="label-text flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
									<path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
								</svg>
								Email
							</span>
						</label>
						<input
							type="email"
							placeholder="example@gmail.com"
							className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label className="label">
							<span className="label-text flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
										clipRule="evenodd"
									/>
								</svg>
								Password
							</span>
						</label>
						<input
							type="password"
							className="input input-bordered w-full focus:outline-primary"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<label className="label">
							<span className="label-text flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
										clipRule="evenodd"
									/>
								</svg>
								Profile picture
							</span>
						</label>
						<input
							type="file"
							accept="image/png, image/jpg, image/jpeg"
							className="file-input file-input-ghost file-input-bordered w-full focus:file-input-primary"
							onChange={(e) => setProfile(e.target.files[0])}
						/>
					</div>
				</div>
				<div className="mt-6 w-3/4 flex flex-col gap-2">
					<button
						onClick={registerUser}
						className="btn btn-primary"
						disabled={disabled}
					>
						{loading ? (
							<span className="loading loading-spinner"></span>
						) : (
							"Sign Up"
						)}
					</button>
					{err && (
						<span className="text-sm text-error">Something went wrong..!</span>
					)}
					<p className="text-sm">
						Already have an account?{" "}
						<span className="cursor-pointer hover:underline hover:text-primary">
							<Link to="/login">Login</Link>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
