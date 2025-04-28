// src/components/messenger/ConversationSidebar.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

const ConversationSidebar = () => {
	const [friends, setFriends] = useState([]);
	const [groups, setGroups] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [friendsRes, groupsRes] = await Promise.all([
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends/list`),
					axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/groups`),
				]);
				setFriends(friendsRes.data);
				setGroups(groupsRes.data);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchData();
	}, []);

	const handleFriendClick = async (friendId) => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/start`, {
				memberIds: [friendId],
			});
			history.push(`/messenger/chat/${res.data._id}`);
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<div style={{ padding: "1em" }}>
			<h3>Friends</h3>

			{friends.length === 0 ? (
				<p style={{ color: "gray" }}>No Friends Yet</p>
			) : (
				friends.map((friend) => (
					<div
						key={friend._id}
						onClick={() => handleFriendClick(friend._id)}
						className="card p-2 mb-2"
						style={{
							cursor: "pointer",
							borderRadius: "8px",
							background: "#f9f9f9",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						}}
					>
						{friend.name}
					</div>
				))
			)}

			<hr style={{ margin: "2em 0" }} />

			<h3>Groups</h3>

			{groups.map((group) => (
				<Link
					key={group._id}
					to={`/messenger/group/${group._id}`}
					className="card p-2 mb-2"
					style={{
						display: "block",
						textDecoration: "none",
						color: "black",
						borderRadius: "8px",
						background: "#f9f9f9",
						boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
					}}
				>
					{group.groupName}
				</Link>
			))}
		</div>
	);
};

export default ConversationSidebar;
