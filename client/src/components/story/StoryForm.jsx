import React, { useState } from "react";
import { connect } from "react-redux";
import { addStory } from "../../actions/story";
import { useHistory } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import PropTypes from "prop-types";
import axios from "axios";

const StoryForm = ({ addStory, setAlert, auth: { authUser } }) => {
	const history = useHistory();
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) {
			setAlert("Story cannot be empty", "danger");
			return;
		}

		const formData = new FormData();
		formData.append("text", text);
		if (image) {
			formData.append("image", image);
		}

		try {
			await addStory(formData); // We will modify addStory to accept formData
			history.push("/stories");
		} catch (err) {
			console.error(err);
		}
	};

	// 🚫 Only allow Alumni
	if (authUser && authUser.role !== "alumni") {
		return <h2 style={{ textAlign: "center", marginTop: "2em" }}>Access Denied: Alumni Only</h2>;
	}

	return (
		<div className="container">
			<h1 className="large text-primary">Share Your College Story</h1>
			<form className="form" onSubmit={onSubmit} encType="multipart/form-data">
				<div className="form-group">
					<textarea
						placeholder="Share your favorite memory, journey or experience..."
						name="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows="8"
						required
					/>
				</div>
				{/* ✅ Image upload */}
				<div className="form-group">
					<label>Attach a Photo (optional)</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
					/>
				</div>

				<input type="submit" className="btn btn-primary" value="Post Story" />
			</form>
		</div>
	);
};

StoryForm.propTypes = {
	addStory: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { addStory, setAlert })(StoryForm);
