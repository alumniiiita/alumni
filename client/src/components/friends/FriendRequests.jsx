import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";

const FriendRequests = ({ auth: { authUser }, setAlert }) => {
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends/requests`);
				setRequests(res.data);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchRequests();
	}, []);

	const acceptRequest = async (requestId) => {
		try {
			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/friends/accept`, { requestId });
			setAlert("Friend request accepted!", "success");
			setRequests(requests.filter((r) => r._id !== requestId));
		} catch (err) {
			console.error(err.message);
			setAlert("Error accepting request", "danger");
		}
	};

	const declineRequest = async (requestId) => {
		try {
			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/friends/decline`, { requestId });
			setAlert("Friend request declined!", "info");
			setRequests(requests.filter((r) => r._id !== requestId));
		} catch (err) {
			console.error(err.message);
			setAlert("Error declining request", "danger");
		}
	};

	return (
		<div className="container" style={{ padding: "2rem" }}>
			<h1 className="large text-primary" style={{ textAlign: "center", marginBottom: "2rem" }}>
				Pending Friend Requests
			</h1>

			{requests.length === 0 ? (
				<h3 style={{ textAlign: "center", color: "gray" }}>
					No Pending Requests
				</h3>
			) : (
				<div className="requests-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
					{requests.map((req) => (
						<div
							key={req._id}
							className="card"
							style={{
								padding: "1.5rem",
								borderRadius: "10px",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
								textAlign: "center",
								background: "#fff",
								transition: "transform 0.3s",
							}}
							onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
							onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
						>
							<img
								src={req.sender.avatar || "/default-avatar.png"}
								alt="avatar"
								style={{
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									objectFit: "cover",
									marginBottom: "1rem",
									border: "2px solid #28a745",
								}}
							/>
							<h4 style={{ marginBottom: "0.5rem" }}>{req.sender.name}</h4>

							{req.sender.location && (
								<p style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5rem" }}>
									📍 {req.sender.location}
								</p>
							)}

							{req.sender.role && (
								<p style={{ fontSize: "0.9rem", color: "#28a745", marginBottom: "1rem" }}>
									{req.sender.role.charAt(0).toUpperCase() + req.sender.role.slice(1)}
								</p>
							)}

							<div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
								<button
									className="btn btn-success"
									style={{ flex: 1 }}
									onClick={() => acceptRequest(req._id)}
								>
									Accept
								</button>
								<button
									className="btn btn-danger"
									style={{ flex: 1 }}
									onClick={() => declineRequest(req._id)}
								>
									Decline
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(FriendRequests);
