import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";

const SentRequests = ({ auth: { authUser }, setAlert }) => {
	const [sentRequests, setSentRequests] = useState([]);

	useEffect(() => {
		const fetchSentRequests = async () => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends/requests/sent`);
				setSentRequests(res.data);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchSentRequests();
	}, []);

	const cancelRequest = async (requestId) => {
		try {
			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/friends/cancel`, { requestId });
			setAlert("Friend request canceled!", "info");
			setSentRequests(sentRequests.filter((r) => r._id !== requestId));
		} catch (err) {
			console.error(err.message);
			setAlert("Error canceling request", "danger");
		}
	};

	return (
		<div className="container" style={{ padding: "2rem" }}>
			<h1 className="large text-primary" style={{ textAlign: "center", marginBottom: "2rem" }}>
				Sent Friend Requests
			</h1>

			{sentRequests.length === 0 ? (
				<h3 style={{ textAlign: "center", color: "gray" }}>
					No Sent Requests Yet
				</h3>
			) : (
				<div className="sent-requests-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
					{sentRequests.map((req) => (
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
								src={req.receiver.avatar || "/default-avatar.png"}
								alt="avatar"
								style={{
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									objectFit: "cover",
									marginBottom: "1rem",
									border: "2px solid #007bff",
								}}
							/>
							<h4 style={{ marginBottom: "0.5rem" }}>{req.receiver.name}</h4>

							{req.receiver.location && (
								<p style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5rem" }}>
									📍 {req.receiver.location}
								</p>
							)}

							{req.receiver.role && (
								<p style={{ fontSize: "0.9rem", color: "#007bff", marginBottom: "1rem" }}>
									{req.receiver.role.charAt(0).toUpperCase() + req.receiver.role.slice(1)}
								</p>
							)}

							<button
								className="btn btn-danger"
								onClick={() => cancelRequest(req._id)}
								style={{ marginTop: "0.5rem", width: "100%" }}
							>
								Cancel Request
							</button>
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

export default connect(mapStateToProps, { setAlert })(SentRequests);
