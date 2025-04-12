import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createProfile, getCurrentUserProfile } from "../../actions/users";
import axios from 'axios'
// import { timingSafeEqual } from "crypto";

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
		userID : userid,
		images : []
	});

	

	const [displaySocialInputs, toggleSocialInputs] = useState(false);


	// useEffect(() => {
	// 	getCurrentUserProfile();
	// 	setFormInput({
	// 		organisation: loading || !profile.organisation ? "" : profile.company,
	// 		website: loading || !profile.website ? "" : profile.website,
	// 		status: loading || !profile.status ? "" : profile.status,
	// 		location: loading || !profile.location ? "" : profile.location,
	// 		bio: loading || !profile.bio ? "" : profile.bio,
	// 		githubusername:
	// 			loading || !profile.githubusername
	// 				? ""
	// 				: profile.githubusername,
	// 		skills: loading || !profile.skills ? "" : profile.skills.join(","),
	// 		twitter: loading || !profile.social ? "" : profile.social.twitter,
	// 		linkedin: loading || !profile.social ? "" : profile.social.linkedin,
	// 		facebook: loading || !profile.social ? "" : profile.social.facebook,
	// 		youtube: loading || !profile.social ? "" : profile.social.youtube,
	// 		instagram:
	// 			loading || !profile.social ? "" : profile.social.instagram,
	// 	});
	// }, [loading, getCurrentProfile]);

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
		images
		
	} = formInput;

	const onChange = (e) => {
		setFormInput({ ...formInput, [e.target.name]: e.target.value });
	};

	console.log("edit form");
	const onSubmit = async (e) => {
		console.log("submitting");
		e.preventDefault();
		const timages = [];
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
			if (image !== "") {
				console.log("image found")
				const formData1 = new FormData();
				formData1.append("file", image);
				const res1 = await axios.post(
					`${process.env.REACT_APP_BACKEND_URL}/upload-image`,
					formData1,
					config
				);
				timages.push(res1.data);
				console.log("img data = ", res1.data)
				setFormInput({ ...formInput, images: timages});
				createProfile({
					userID,
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
					timages
				}, history, true);
			}
			else{
				createProfile({
					userID,
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
				}, history, true);
			}
	};

	return (
		<React.Fragment>
			<div className="profile-form-container">
				<div className="form-header">
					<h1 className="large text-primary">Edit your Profile</h1>
					<small style={{ color: "red" }}></small>
				</div>
				{!loadingAuth && authUser.role === "alumni" &&
				<React.Fragment></React.Fragment>
				}
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div className="form-group">
						<select
							style={{ width: "100%" }}
							name="status"
							value={status}
							required
							onChange={onChange}
						>
							<option value="Developer">Developer</option>
							<option value="Junior Developer">
								Junior Developer
							</option>
							<option value="Senior Developer">
								Senior Developer
							</option>
							<option value="Student">Student</option>
							<option value="Intern">Intern</option>
							<option value="Istructor">
								Instructor/Teacher
							</option>
							<option value="Other">Other</option>
						</select>
						<small className="form-text">
							Tell us about your career
						</small>
					</div>

					<div className="form-group">
						<input
							type="text"
							name="organisation"
							placeholder="organisation"
							value={organisation}
							onChange={onChange}
						/>
						<small className="form-text">
							Could be your own organisation
						</small>
					</div>

					<div className="form-group">
						<input
							type="text"
							placeholder="Website"
							name="website"
							value={website}
							onChange={onChange}
						/>
						<small className="form-text">
							Could be your own or a organisation website
						</small>
					</div>

					<div className="form-group">
						<input
							type="text"
							name="location"
							placeholder="Location"
							value={location}
							onChange={onChange}
						/>
						<small className="form-text">
							City & state suggested (eg. Boston, MA)
						</small>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="* Skills"
							name="skills"
							// required
							value={skills}
							onChange={onChange}
						/>
						<small className="form-text">
							<span style={{ color: "#D40000" }}>*</span>
							Please use comma separated values (eg.
							HTML,CSS,JavaScript,PHP)
						</small>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Github Username"
							name="githubusername"
							value={githubusername}
							onChange={onChange}
						/>
						<small className="form-text">
							If you want your latest repos and a Github link,
							include your username
						</small>
					</div>
					<div className="form-group">
						<textarea
							rows="6"
							style={{
								padding: "0.5em",
								outline: "none",
								width: "100%",
							}}
							placeholder="A short bio of yourself"
							name="bio"
							value={bio}
							onChange={onChange}
						/>
						<small className="form-text">
							Tell us a little about yourself
						</small>
					</div>
					<div className="form-group">
						<label>Attach Images</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>
					<div className="mr-2 my-4">
						<button
							onClick={() =>
								toggleSocialInputs(!displaySocialInputs)
							}
							type="button"
							className="btn btn-light mr-2"
						>
							Add Social Network Links
						</button>
						<span className="mt-1" style={{ color: "blue" }}>
							*Optional
						</span>
					</div>


					{displaySocialInputs && (
						<React.Fragment>
							<div className="form-group social-input">
								<i className="fab fa-twitter fa-2x" />
								<input
									type="text"
									placeholder="Twitter URL"
									name="twitter"
									value={twitter}
									onChange={onChange}
								/>
							</div>

							<div className="form-group social-input">
								<i className="fab fa-facebook fa-2x" />
								<input
									type="text"
									placeholder="Facebook URL"
									name="facebook"
									value={facebook}
									onChange={onChange}
								/>
							</div>

							<div className="form-group social-input">
								<i className="fab fa-youtube fa-2x" />
								<input
									type="text"
									placeholder="YouTube URL"
									name="youtube"
									value={youtube}
									onChange={onChange}
								/>
							</div>

							<div className="form-group social-input">
								<i className="fab fa-linkedin fa-2x" />
								<input
									type="text"
									placeholder="Linkedin URL"
									name="linkedin"
									value={linkedin}
									onChange={onChange}
								/>
							</div>

							<div className="form-group social-input">
								<i className="fab fa-instagram fa-2x" />
								<input
									type="text"
									placeholder="Instagram URL"
									name="instagram"
									value={instagram}
									onChange={onChange}
								/>
							</div>
						</React.Fragment>
					)}
					<div className="back-submit-buttons">
						<Link
							className="btn btn-light my-1"
							to="/userprofile"
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
