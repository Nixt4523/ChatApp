import React, { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import { db, storage, auth } from "../Firebase";
import {
	ref,
	deleteObject,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function EditProfileModal() {
	const currentUser = useContext(AuthContext);

	const [name, setName] = useState(
		currentUser.displayName?.toString().split(" ")[0]
	);
	const [surname, setSurname] = useState(
		currentUser.displayName?.toString().split(" ")[1]
	);
	const [profile, setProfile] = useState(currentUser.photoURL);

	const [disable, setDisable] = useState(false);
	const [error, setError] = useState(false);

	const updateUser = () => {
		if (profile !== currentUser.photoURL) {
			const imageRef = ref(storage, currentUser.email.toString().split("@")[0]);
			setDisable(true);
			deleteObject(imageRef)
				.then(async () => {
					const storageRef = ref(
						storage,
						currentUser.email.toString().split("@")[0]
					);

					await uploadBytesResumable(storageRef, profile).then(() => {
						getDownloadURL(storageRef).then(async (downloadURL) => {
							try {
								await updateProfile(auth.currentUser, {
									displayName: name + " " + surname,
									photoURL: downloadURL,
								});

								await updateDoc(doc(db, "users", currentUser.email), {
									displayName: name + " " + surname,
									photoURL: downloadURL,
								});
							} catch (error) {
								console.log(err);
								setError(true);
							}
						});
					});
					setDisable(false);
					window.location.reload();
				})
				.catch((err) => {
					console.log(err);
					setError(true);
				});
		} else {
			const updateDisplayName = async () => {
				setDisable(true);
				await updateProfile(auth.currentUser, {
					displayName: name + " " + surname,
					photoURL: currentUser.photoURL,
				});

				await updateDoc(doc(db, "users", currentUser.email), {
					displayName: name + " " + surname,
					photoURL: currentUser.photoURL,
				}).then(() => {
					setDisable(false);
				});
			};

			updateDisplayName();
		}
	};

	const resetChanges = () => {
		setProfile(currentUser.photoURL);
		setName(currentUser.displayName?.toString().split(" ")[0]);
		setSurname(currentUser.displayName?.toString().split(" ")[1]);
	};

	return (
		<div>
			<dialog id="editProfile" className="modal backdrop-blur-sm">
				<form method="dialog" className="modal-box">
					<div className="flex items-center gap-2 opacity-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path
								fillRule="evenodd"
								d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
								clipRule="evenodd"
							/>
						</svg>

						<h1>Profile</h1>
					</div>
					<div className="w-full h-full p-4 flex flex-col gap-4 items-center justify-center mt-4">
						<input
							type="file"
							id="image"
							accept="image/png, image/jpg, image/jpeg"
							className="hidden"
							onChange={(e) => {
								setProfile(e.target.files[0]);
							}}
						/>
						<label
							htmlFor="image"
							className="p-2 cursor-pointer relative group"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="hidden group-hover:flex transition-all w-8 h-8 absolute top-[50%] left-[50%] z-40 -translate-x-1/2 -translate-y-1/2 text-primary-content"
							>
								<path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
								<path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
							</svg>
							{profile === currentUser.photoURL ? (
								<div className="avatar group-hover:grayscale transition-all">
									<div className="w-36 rounded-full">
										<img src={profile} />
									</div>
								</div>
							) : (
								<div className="avatar group-hover:grayscale transition-all">
									<div className="w-36 rounded-full">
										<img
											src={
												profile !== currentUser.photoURL &&
												profile !== undefined
													? URL.createObjectURL(profile)
													: currentUser.photoURL
											}
										/>
									</div>
								</div>
							)}
						</label>
						<div className="w-full">
							<div className="space-y-4">
								<div className="flex gap-2">
									<div className="flex-1">
										<label className="label">Name</label>
										<input
											type="text"
											onChange={(e) => setName(e.target.value)}
											value={
												name !== "" && name !== undefined
													? name[0].toUpperCase() + name.slice(1)
													: ""
											}
											className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
										/>
									</div>
									<div className="flex-1">
										<label className="label">Surname</label>
										<input
											type="text"
											onChange={(e) => setSurname(e.target.value)}
											value={
												surname !== "" && surname !== undefined
													? surname[0].toUpperCase() + surname.slice(1)
													: ""
											}
											className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
										/>
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
										defaultValue={currentUser.email}
										disabled={true}
										className="input input-bordered w-full focus:outline-primary placeholder:text-base-content placeholder:opacity-50"
									/>
								</div>
							</div>
						</div>
						<div className="w-full flex gap-2 mt-2">
							<button
								disabled={disable}
								className="btn btn-error flex-1 flex items-center gap-2 focus:outline-none"
								onClickCapture={resetChanges}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								close
							</button>
							<div
								className="btn btn-success flex-1 flex items-center gap-2"
								disabled={disable}
								onClick={() => {
									updateUser();
								}}
							>
								{disable === true ? (
									<>
										<span className="loading"></span>
										saving
									</>
								) : (
									<>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
										save
									</>
								)}
							</div>
						</div>
						{error === true && (
							<span className="text-sm text-error">
								Something went wrong..!
							</span>
						)}
						<span className="text-sm text-base-content flex gap-2 self-start items-center">
							<span
								className="tooltip tooltip-right cursor-pointer tooltip-primary"
								data-tip="Your friends need to add you again, to see your profile changes."
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6 text-primary"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
									/>
								</svg>
							</span>
							<span className="opacity-50">
								Ask your friends to add you again..!
							</span>
						</span>
					</div>
				</form>
			</dialog>
		</div>
	);
}

export default EditProfileModal;
