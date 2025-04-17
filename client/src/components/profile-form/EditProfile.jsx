import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createProfile, getCurrentUserProfile } from "../../actions/users";
import axios from 'axios';

const EditProfile = ({
	createProfile,
	getCurrentUserProfile,
	auth: { loadingAuth, authUser },
	history,
}) => {
	let userData = localStorage.getItem("_user_data");
	userData = JSON.parse(userData);
	const userid = userData._id;

	const [image, setImage] = useState("");

	const [formInput, setFormInput] = useState({
		organisation: "",
		website: "",
		location: "",
		status: "",
		skills: "",
		githubusername: "",
		bio: "",
		twitter: "",
		facebook: "",
		linkedin: "",
		youtube: "",
		instagram: "",
		userID: userid,
		images: [],
	});

	const [displaySocialInputs, toggleSocialInputs] = useState(false);

	const {
		organisation,
		website,
		location,
		status,
		skills,
		githubusername,
		bio,
		twitter,
		facebook,
		linkedin,
		youtube,
		instagram,
		userID,
		images,
	} = formInput;

	const onChange = (e) => {
		setFormInput({ ...formInput, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const timages = [];
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		if (image !== "") {
			const formData1 = new FormData();
			formData1.append("file", image);
			const res1 = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/upload-image`,
				formData1,
				config
			);
			timages.push(res1.data);
			setFormInput({ ...formInput, images: timages });
			createProfile(
				{ ...formInput, images: timages },
				history,
				true
			);
		} else {
			createProfile(formInput, history, true);
		}
	};

	return (
		<React.Fragment>
			<div className="profile-form-container">
				<div className="form-header">
					<h1 className="large text-primary">Edit your Profile</h1>
					<small style={{ color: "red" }}>* = required field</small>
				</div>
				<form className="form" onSubmit={onSubmit}>
					<div className="form-group">
						<label>Status <span style={{ color: "red" }}>*</span></label>
						<select
							style={{ width: "100%" }}
							name="status"
							value={status}
							required
							onChange={onChange}
						>
							<option value="">-- Select Status --</option>
							<option value="Developer">Developer</option>
							<option value="Junior Developer">Junior Developer</option>
							<option value="Senior Developer">Senior Developer</option>
							<option value="Student">Student</option>
							<option value="Intern">Intern</option>
							<option value="Instructor">Instructor/Teacher</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="form-group">
						<input
							type="text"
							name="organisation"
							placeholder="Organisation"
							value={organisation}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Website"
							name="website"
							value={website}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							name="location"
							placeholder="Location"
							value={location}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<label>Skills <span style={{ color: "red" }}>*</span></label>
						<input
							type="text"
							placeholder="HTML,CSS,JavaScript"
							name="skills"
							value={skills}
							onChange={onChange}
							required
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Github Username"
							name="githubusername"
							value={githubusername}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<textarea
							rows="6"
							style={{ padding: "0.5em", outline: "none", width: "100%" }}
							placeholder="A short bio of yourself"
							name="bio"
							value={bio}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<label>Attach Image</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>
					<div className="mr-2 my-4">
						<button
							onClick={() => toggleSocialInputs(!displaySocialInputs)}
							type="button"
							className="btn btn-light mr-2"
						>
							Add Social Network Links
						</button>
						<span className="mt-1" style={{ color: "blue" }}>*Optional</span>
					</div>
					{displaySocialInputs && (
						<React.Fragment>
							{["twitter", "facebook", "youtube", "linkedin", "instagram"].map((platform) => (
								<div className="form-group social-input" key={platform}>
									<i className={`fab fa-${platform} fa-2x`} />
									<input
										type="text"
										placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
										name={platform}
										value={formInput[platform]}
										onChange={onChange}
									/>
								</div>
							))}
						</React.Fragment>
					)}
					<div className="back-submit-buttons">
						<Link className="btn btn-light my-1" to="/userprofile" style={{ width: "40%" }}>
							Go Back
						</Link>
						<input
							type="submit"
							className="btn btn-primary my-1"
							style={{ width: "40%" }}
							value="Update Profile"
						/>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
};

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentUserProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { createProfile, getCurrentUserProfile })(
	withRouter(EditProfile)
);
