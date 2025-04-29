import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import UserCard from "./UserCard";
import { getUsers, getUsersByType } from "../../actions/users";
import UsersByType from "./UsersByType";

const Profiles = ({
	getUsers,
	getUsersByType,
	user: { users, loading },
}) => {
	const [students, setStudents] = useState([]);
	const [faculty, setFaculty] = useState([]);
	const [alumni, setAlumni] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getUsers(); // Load all users initially
		getUsersByType("student").then(setStudents);
		getUsersByType("alumni").then(setAlumni);
		getUsersByType("faculty").then(setFaculty);
		getUsersByType("admin").then(setAdmins);
	}, []);

	// Filter users based on the search term
	const filteredUsers = users?.filter((user) =>
		user?.name?.toLowerCase().includes(search.toLowerCase())
	);

	return loading ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className="large text-primary text-center">Members</h1>
			<p className="lead text-center">
				<i className="fab fa-connectdevelop" /> Browse and connect with members
			</p>

			{/* 🔍 LIVE Search */}
			<div className="search-div text-center mb-4">
				<input
					type="text"
					className="form-control"
					placeholder="Search Members..."
					style={{ maxWidth: "400px", margin: "auto" }}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{/* 📊 Stats */}
			<div className="user-type-stats text-center">
				<ul className="profile-stats">
					<UsersByType users={alumni} label="Alumni" />
					<UsersByType users={students} label="Students" />
					<UsersByType users={faculty} label="Faculty" />
					<UsersByType users={admins} label="Admins" />
				</ul>
			</div>

			<h5 className="text-center mt-4">{filteredUsers.length} users found</h5>

			{/* 🧑‍💻 Display Users */}
			<div className="container profile-page grid-container mt-3">
				{filteredUsers && filteredUsers.length > 0 ? (
					filteredUsers.map((user) => (
						<UserCard key={user._id} profile={user} />
					))
				) : (
					<h4 className="text-center">No Profiles Found</h4>
				)}
			</div>
		</Fragment>
	);
};

Profiles.propTypes = {
	user: PropTypes.object.isRequired,
	getUsers: PropTypes.func.isRequired,
	getUsersByType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps, {
	getUsers,
	getUsersByType,
})(Profiles);
