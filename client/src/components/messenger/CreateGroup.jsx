import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";

const CreateGroup = ({ auth: { authUser }, setAlert }) => {
	const [friends, setFriends] = useState([]);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [groupName, setGroupName] = useState("");

	const history = useHistory();

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

	const toggleFriendSelection = (friendId) => {
		setSelectedFriends((prevSelected) =>
			prevSelected.includes(friendId)
				? prevSelected.filter((id) => id !== friendId)
				: [...prevSelected, friendId]
		);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!groupName.trim() || selectedFriends.length === 0) {
			setAlert("Please enter a group name and select friends", "danger");
			return;
		}

		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/start`, {
				memberIds: selectedFriends,
				groupName: groupName,
			});

			setAlert("Group Created Successfully!", "success");
			history.push(`/messenger/group/${res.data._id}`); // 🚀 Redirect to new group chat
		} catch (err) {
			console.error(err.message);
			setAlert("Error creating group", "danger");
		}
	};

	return (
		<div className="container">
			<h1 className="large text-primary">Create New Group</h1>

			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Group Name <span style={{ color: "red" }}>*</span></label>
					<input
						type="text"
						className="form-control"
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
						placeholder="Enter Group Name"
						required
					/>
				</div>

				<div className="form-group">
					<label>Select Friends <span style={{ color: "red" }}>*</span></label>
					<div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid lightgray", padding: "1em" }}>
						{friends.map((friend) => (
							<div key={friend._id} style={{ marginBottom: "10px" }}>
								<input
									type="checkbox"
									id={friend._id}
									checked={selectedFriends.includes(friend._id)}
									onChange={() => toggleFriendSelection(friend._id)}
									style={{ marginRight: "10px" }}
								/>
								<label htmlFor={friend._id}>{friend.name}</label>
							</div>
						))}
					</div>
				</div>

				<input
					type="submit"
					value="Create Group"
					className="btn btn-primary"
					style={{ width: "100%", marginTop: "1em" }}
				/>
			</form>
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(CreateGroup);
