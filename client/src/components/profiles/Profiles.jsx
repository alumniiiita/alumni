import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import UserCard from "./UserCard";
import { useLocation } from "react-router-dom";
import { getUsersByType } from "../../actions/users";
import { closeSideNav } from "../../actions/alert";
import UsersByType from "./UsersByType";

const Profiles = ({
	closeSideNav,
	getUsersByType,
	user: { users, loading },
}) => {
	const [students, setStudents] = useState([]);
	const [faculty, setFaculty] = useState([]);
	const [alumni, setAlumni] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [search, setSearch] = useState("");
	const [allUsers, setAllUsers] = useState([]); // store all users locally

	useEffect(() => {
		closeSideNav();

		const loadUsers = async () => {
			const studentsData = await getUsersByType("student");
			const alumniData = await getUsersByType("alumni");
			const facultyData = await getUsersByType("faculty");
			const adminsData = await getUsersByType("admin");

			setStudents(studentsData);
			setAlumni(alumniData);
			setFaculty(facultyData);
			setAdmins(adminsData);

			// Combine all into one array
			const combinedUsers = [...studentsData, ...alumniData, ...facultyData, ...adminsData];
			setAllUsers(combinedUsers);
		};

		loadUsers();
	}, [closeSideNav, getUsersByType]);

	// Filtered users based on search
	const filteredUsers = allUsers.filter((user) => {
		const searchLower = search.toLowerCase();
		return (
			user.name?.toLowerCase().includes(searchLower) ||
			user.email?.toLowerCase().includes(searchLower) ||
			user.organisation?.toLowerCase().includes(searchLower)
		);
	});

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<h1 className="large text-primary" style={{ textAlign: "center" }}>
						Members
					</h1>
					<p className="lead" style={{ textAlign: "center" }}>
						<i className="fab fa-connectdevelop"></i> Browse and connect with members
					</p>

					{/* Search Bar */}
					<div className="search-div">
						<form className="col-12 search-form" onSubmit={(e) => e.preventDefault()}>
							<input
								type="text"
								name="search"
								id="search"
								placeholder="Search Members..."
								className="col-9 search-input posts-top-item"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<input
								type="submit"
								value="Search"
								className="btn btn-primary col-3 posts-top-item"
							/>
						</form>
					</div>

					{/* User type stats */}
					<div className="user-type-stats" style={{ textAlign: "center" }}>
						<ul className="profile-stats">
							<UsersByType users={alumni} label={"Alumni"} />
							<UsersByType users={students} label={"Students"} />
							<UsersByType users={faculty} label={"Faculty"} />
							<UsersByType users={admins} label={"Admin"} />
						</ul>
					</div>

					{/* List of filtered users */}
					<h5 className="row ml-5 pb-2 mt-5" style={{ textAlign: "center" }}>
						{filteredUsers.length} users found
					</h5>

					<div className="container profile-page grid-container">
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<UserCard key={user._id} profile={user} />
							))
						) : (
							<h4 style={{ textAlign: "center" }}>
								No Profiles Found
							</h4>
						)}
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Profiles.propTypes = {
	user: PropTypes.object.isRequired,
	closeSideNav: PropTypes.func.isRequired,
	getUsersByType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps, {
	closeSideNav,
	getUsersByType,
})(Profiles);
