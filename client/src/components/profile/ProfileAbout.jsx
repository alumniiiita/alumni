import {instagram} from "react-bootstrap-icons";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
const ProfileAbout = (props) => {
	let profile = props.profile;
	console.log("props = " ,props);
	return (
		<div className="profile-about bg-light ">
			<h2>About</h2>
			{profile.bio && (
				<Fragment>
					{/* <h5 className="text-primary">
						{profile.name.trim().split(" ")[0]}'s Bio
					</h5> */}
					<p>{profile.bio}</p>
					<p>website-{" " }{profile.website}</p>
					<p>github username-{" " }{profile.githubusername}</p>
				</Fragment>
			)}

			<div className="skills"> Skills-
				{profile.skills && profile.skills.map((skill, index) => (
					<div key={index} className="p-1">
                        <i className="fa fa-check"></i>{skill}</div>
				))}

			</div>
{/* 
			<div className="social">
			{profile.social && profile.social.map((social, index) => (
					<div key={index} className="p-1">
                        <a href={social}>instagram</a>
						</div>
				))}
			</div> */}
		</div>
	);
};

ProfileAbout.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
