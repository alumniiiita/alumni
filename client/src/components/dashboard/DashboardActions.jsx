import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAccount } from "../../actions/users";

const DashboardActions = ({ deleteAccount }) => {
	return (
		<div className="my-3 mx-4">
			<Link
				to="/edit-profile"
				className="btn btn-light"
				style={{ width: "100%", marginBottom: "1em" }}
			>
				<i
					className="fas fa-user-circle"
					style={{ marginRight: "0.5em" }}
				></i>
				Edit Profile
			</Link>
			<Link
				to="/add-experience"
				className="btn btn-light"
				style={{ width: "100%", marginBottom: "1em" }}
			>
				<i
					className="fab fa-black-tie"
					style={{ marginRight: "0.5em" }}
				></i>
				Add Experience
			</Link>
			<Link
				to="/create-post"
				className="btn btn-light"
				style={{ width: "100%", marginBottom: "1em" }}
			>
				<i
					className="fas fa-edit"
					style={{ marginRight: "0.5em" }}
				></i>
				Create Post
			</Link>
			<Link
				to="/add-education"
				className="btn btn-light"
				style={{ width: "100%", marginBottom: "1em" }}
			>
				<i
					className="fas fa-graduation-cap"
					style={{ marginRight: "0.5em" }}
				></i>
				Add Education
			</Link>
			<Link
				to=""
				onClick={() => {
					deleteAccount();
				}}
				className="btn btn-danger"
				style={{ width: "100%" }}
			>
				<i
					className="fas fa-user-minus"
					style={{ marginRight: "0.5em" }}
				></i>
				Delete Account
			</Link>
		</div>
	);
};

DashboardActions.propTypes = {
	deleteAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteAccount })(DashboardActions);
