import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../../actions/alert";

const FriendSuggestion = ({ auth: { authUser }, setAlert }) => {
	const [suggestions, setSuggestions] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const suggestionsPerPage = 6;

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

	const filteredSuggestions = suggestions.filter((user) =>
		user.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const indexOfLast = currentPage * suggestionsPerPage;
	const indexOfFirst = indexOfLast - suggestionsPerPage;
	const currentSuggestions = filteredSuggestions.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredSuggestions.length / suggestionsPerPage);

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	return (
		<div className="container">
			<h1 className="large text-primary" style={{ textAlign: "center" }}>
				Find New Friends
			</h1>

			{/* Search bar */}
			<div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
				<input
					type="text"
					placeholder="Search by name..."
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1);
					}}
					style={{
						width: "60%",
						padding: "0.8em",
						borderRadius: "8px",
						border: "1px solid #ccc",
						outline: "none",
					}}
				/>
			</div>

			{currentSuggestions.length === 0 ? (
				<h3 style={{ textAlign: "center", marginTop: "2em" }}>No Suggestions Found</h3>
			) : (
				<>
					{/* Scrollable grid */}
					<div style={{
						maxHeight: "60vh",
						overflowY: "auto",
						marginTop: "2em",
						paddingRight: "1em"
					}}>
						<div
							className="suggestions-grid"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
								gap: "1.5em"
							}}
						>
							{currentSuggestions.map((user) => (
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
					</div>

					{/* Pagination Controls */}
					<div style={{ display: "flex", justifyContent: "center", marginTop: "1.5em" }}>
						<button
							onClick={handlePrev}
							disabled={currentPage === 1}
							className="btn btn-light"
							style={{ marginRight: "1em" }}
						>
							← Previous
						</button>
						<span style={{ margin: "0 1em", alignSelf: "center" }}>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={handleNext}
							disabled={currentPage === totalPages}
							className="btn btn-light"
						>
							Next →
						</button>
					</div>
				</>
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
