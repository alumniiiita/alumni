import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
	createPost,
	createPostRequest,
	getRequirePostApproval,
} from "../../actions/post";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";
import { setAlert } from "../../actions/alert";
import { getAllChannels } from "../../actions/channel";
import axios from "axios";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

const PostForm = ({
	createPost,
	setAlert,
	createPostRequest,
	getAllChannels,
	getRequirePostApproval,
	history,
	post: {
		settings: { requireApproval },
	},
	extras: { channels },
}) => {
	const [text, setText] = useState("");
	const [heading, setHeading] = useState("");
	const [channel, setChannel] = useState("Research");
	const [visibleStudent, setVisibleStudent] = useState(false);
	const [visibleFaculty, setVisibleProf] = useState(false);
	const [visibleAlumni, setVisibleAlumni] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [image, setImage] = useState("");

	useEffect(() => {
		async function myfunction() {
			await getRequirePostApproval();
			await getAllChannels();
		}
		myfunction();
	}, []);

	const onSubmit = async (e) => {
		// console.log(channel);
		e.preventDefault();

		if (
			visibleAlumni === false &&
			visibleFaculty === false &&
			visibleStudent === false
		) {
			setAlert("Please check atleast one checkbox", "danger");
		} else {
			let success = 0;

			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const images = [];

			if (image !== "") {
				const formData1 = new FormData();
				formData1.append("file", image);
				const res1 = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/upload-image`,
					formData1,
					config
				);
				images.push(res1.data);
			}
			console.log(requireApproval);
			if (requireApproval) {
				success = await createPostRequest({
					text,
					heading,
					visibleStudent,
					visibleFaculty,
					visibleAlumni,
					channel,
					images,
				});
			} else {
				success = await createPost({
					text,
					heading,
					visibleStudent,
					visibleFaculty,
					visibleAlumni,
					channel,
					images,
				});
			}

			if (success) {
				setSuccessOpen(true);
			} else {
				setErrorOpen(true);
			}
		}
	};

	const handleCloseSuccess = () => {
		setSuccessOpen(false);
	};
	const handleCloseError = () => {
		setErrorOpen(false);
	};

	return (
		<React.Fragment>
			<div className="container post-form-container">
				<div className="form-header">
					<h1 className="large text-primary">Write a post</h1>
					<small style={{ color: "red" }}>* = required field</small>
				</div>
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div className="form-group">
						<input
							type="text"
							placeholder="Topic/Heading"
							name="heading"
							value={heading}
							onChange={(e) => setHeading(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<CKEditor
							editor={ClassicEditor}
							data={text}
							onChange={(event, editor) => {
								const data = editor.getData();
								setText(data);
							}}
							required
						/>
					</div>
					<div className="form-group">
						<label>Attach Images</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>
					
					{/* <div className="form-group">
						<label>Upload images (.png, .jpg, .jpeg)</label>
						<input
							type="file"
							name="multi-files"
							id="multi-files"
							multiple
							onChange={handleFileChange}
						/>
					</div> */}

					<div className="form-group select-post-visibility">
						<p
							style={{ fontSize: "1.2rem" }}
							className="secondary-text"
						>
							Who do you want this post to be visible to?
						</p>
						<div className="form-group checkbox-inline">
							<label>Students</label>
							<input
								type="checkbox"
								name="student"
								checked={visibleStudent ? true : false}
								value={visibleStudent}
								id="student"
								onChange={(e) =>
									setVisibleStudent(!visibleStudent)
								}
							/>
						</div>
						<div className="form-group checkbox-inline">
							<label>Faculty</label>
							<input
								type="checkbox"
								name="prof"
								checked={visibleFaculty ? true : false}
								value={visibleFaculty}
								id="prof"
								onChange={(e) =>
									setVisibleProf(!visibleFaculty)
								}
							/>
						</div>
						<div className="form-group checkbox-inline">
							<label>Alumni</label>
							<input
								type="checkbox"
								name="alumni"
								checked={visibleAlumni ? true : false}
								value={visibleAlumni}
								id="alumni"
								onChange={(e) =>
									setVisibleAlumni(!visibleAlumni)
								}
							/>
						</div>
						<div className="form-group">
							<p
								style={{ fontSize: "1.2rem" }}
								className="secondary-text"
							>
								Select Channel
							</p>
							<select
								name="channel"
								id="channel"
								className="form-dropdown"
								value={channel}
								onChange={(event) =>
									setChannel(event.target.value)
								}
							>
								{channels !== null && channels.map((c) => {
									return (
										<option value={c.name} key={c._id}>
											{c.name}
										</option>
									);
								})}
							</select>
						</div>
					</div>
					<div className="back-submit-buttons">
						<Link
							className="btn btn-light my-1"
							to="/feed/topic/Placements"
							style={{ width: "40%" }}
						>
							Go Back
						</Link>
						<input
							type="submit"
							className="btn btn-primary my-1"
							style={{ width: "40%" }}
						/>
					</div>
				</form>
			</div>
			{text !== "" && (
				<div
					className="container preview"
					style={{ marginBottom: "2em" }}
				>
					<p>
						<strong>Preview:</strong>
					</p>
					<div className="parsed-text">{parse(text)}</div>
					{/* {image.preview && (
						<img src={image.preview} width="100" height="100" />
					)} */}
				</div>
			)}
			<Snackbar
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleCloseSuccess}
			>
				<Alert
					onClose={handleCloseSuccess}
					severity="success"
					sx={{ width: "100%" }}
					variant="filled"
				>
					{requireApproval ? "Post Request Sent" : "Post Created"}
				</Alert>
			</Snackbar>
			<Snackbar
				open={errorOpen}
				autoHideDuration={6000}
				onClose={handleCloseError}
			>
				<Alert
					onClose={handleCloseError}
					severity="error"
					sx={{ width: "100%" }}
					variant="filled"
				>
					{requireApproval
						? "Post Request Error"
						: "Create Post Error"}
				</Alert>
			</Snackbar>
		</React.Fragment>
	);
};

PostForm.propTypes = {
	createPost: PropTypes.func.isRequired,
	createPostRequest: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	extras: PropTypes.object.isRequired,
	getAllChannels: PropTypes.func.isRequired,
	getRequirePostApproval: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
	extras: state.extras,
});

export default connect(mapStateToProps, {
	createPost,
	createPostRequest,
	setAlert,
	getAllChannels,
	getRequirePostApproval,
})(withRouter(PostForm));
