import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../../actions/alert";

const FriendSuggestion = ({ auth: { authUser }, setAlert }) => {
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		const fetchSuggestions = async () => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends/suggestions`);
				setSuggestions(res.data);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchSuggestions();
	}, []);

	const sendFriendRequest = async (receiverId) => {
		try {
			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/friends/request`, { receiverId });
			setAlert("Friend Request Sent!", "success");
			setSuggestions(suggestions.filter((s) => s._id !== receiverId));
		} catch (err) {
			console.error(err.message);
			setAlert("Error sending friend request", "danger");
		}
	};

	return (
		<div className="container">
			<h1 className="large text-primary" style={{ textAlign: "center" }}>
				Find New Friends
			</h1>

			{suggestions.length === 0 ? (
				<h3 style={{ textAlign: "center", marginTop: "2em" }}>No Suggestions Available</h3>
			) : (
				<div className="suggestions-grid" style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "1.5em",
					marginTop: "2em"
				}}>
					{suggestions.map((user) => (
						<div
							key={user._id}
							className="card"
							style={{
								backgroundColor: "#ffffff",
								borderRadius: "12px",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
								padding: "1.5em",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								transition: "transform 0.3s",
							}}
						>
							<img
								src={user.avatar || "/default-avatar.png"}
								alt="avatar"
								style={{
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									objectFit: "cover",
									marginBottom: "1em",
								}}
							/>
							<strong style={{ fontSize: "1.2rem", marginBottom: "0.5em" }}>
								{user.name}
							</strong>

							{user.role && (
								<p style={{ margin: "0", color: "gray", fontSize: "0.9rem" }}>
									{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
								</p>
							)}

							{user.program && (
								<p style={{ margin: "0", color: "gray", fontSize: "0.85rem" }}>
									{user.program.replace("-", " ").toUpperCase()}
								</p>
							)}

							{user.starting_year && (
								<p style={{ margin: "0", color: "gray", fontSize: "0.85rem" }}>
									Batch: {user.starting_year}
								</p>
							)}

							<button
								className="btn btn-primary"
								style={{
									marginTop: "1em",
									width: "80%",
									borderRadius: "20px",
									background: "#007bff",
									border: "none",
									fontWeight: "bold",
								}}
								onClick={() => sendFriendRequest(user._id)}
							>
								Add Friend
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

FriendSuggestion.propTypes = {
	auth: PropTypes.object.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(FriendSuggestion);
