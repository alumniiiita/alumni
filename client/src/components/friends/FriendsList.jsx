import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FriendsList = () => {
	const [friends, setFriends] = useState([]);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends/list`);
				setFriends(res.data);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchFriends();
	}, []);

	const filteredFriends = friends.filter(friend =>
		friend.name.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div className="container">
			<h1 className="large text-primary">Your Friends</h1>

			{/* Search Input */}
			<div className="form-group" style={{ marginBottom: "1em" }}>
				<input
					type="text"
					className="form-control"
					placeholder="Search Friends by Name..."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>

			{filteredFriends.length === 0 ? (
				<h3>No Friends Found</h3>
			) : (
				<div className="friends-list">
					{filteredFriends.map((friend) => (
						<Link
							to={`/messenger/chat/${friend._id}`}
							key={friend._id}
							className="card p-3 mb-3"
							style={{ textDecoration: "none", color: "black" }}
						>
							<div style={{ display: "flex", alignItems: "center" }}>
								<img
									src={friend.avatar || "/default-avatar.png"}
									alt="avatar"
									style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "1em" }}
								/>
								<strong>{friend.name}</strong>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default FriendsList;
