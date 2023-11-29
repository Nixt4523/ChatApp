import React, { useContext, useEffect } from "react";

import { ImagePreviewContext } from "../context/ImagePreviewContext";

function ImagePreview() {
	const { image, setImage } = useContext(ImagePreviewContext);

	useEffect(() => {
		image !== null && window.imagePreview.showModal();
	}, [image]);

	return (
		<div>
			<dialog id="imagePreview" className="modal backdrop-blur-sm">
				<form
					method="dialog"
					className="modal-box rounded-md shadow-none cursor-default max-w-5xl bg-transparent flex items-center justify-center"
				>
					<img
						src={image}
						className="rounded-md aspect-[16/9] object-cover w-full"
					/>
				</form>
				<form method="dialog" className="modal-backdrop ">
					<button
						className="cursor-default focus:outline-none"
						onClickCapture={() => {
							setTimeout(() => {
								setImage(null);
							}, 1000);
						}}
					></button>
				</form>
			</dialog>
		</div>
	);
}

export default ImagePreview;
