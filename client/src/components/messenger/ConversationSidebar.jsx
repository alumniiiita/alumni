import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useRouteMatch } from "react-router-dom";

const ConversationSidebar = () => {
	const [friends, setFriends] = useState([]);
	const [groups, setGroups] = useState([]);
	let { url } = useRouteMatch();

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
				console.error("Error fetching sidebar data", err.message);
			}
		};

		fetchData();
	}, []);

	return (
		<div style={{ padding: "1em" }}>
			<h3>Friends</h3>

			{friends.length === 0 ? (
				<p style={{ color: "gray" }}>No Friends Yet</p>
			) : (
				friends.map((friend) => (
					<Link
						key={friend._id}
						to={`${url}/chat/${friend._id}`}
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
						{friend.name}
					</Link>
				))
			)}

			{/* ✅ Find Friends Button */}
			<div style={{ marginTop: "1.5em", textAlign: "center" }}>
				<Link
					to="/messenger/friends/suggestions"
					className="btn btn-primary"
					style={{ width: "100%" }}
				>
					Find Friends
				</Link>
			</div>

			<hr style={{ margin: "2em 0" }} />

			<h3>Groups</h3>

			{groups.length === 0 ? (
				<p style={{ color: "gray" }}>No Groups Joined Yet</p>
			) : (
				groups.map((group) => (
					<Link
						key={group._id}
						to={`${url}/group/${group._id}`}
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
				))
			)}
		</div>
	);
};

export default ConversationSidebar;
