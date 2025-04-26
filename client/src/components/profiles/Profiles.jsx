import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import UserCard from "./UserCard";
import { useLocation, useNavigate } from "react-router-dom";
import { getUsers, getUsersByType } from "../../actions/users";
import { closeSideNav } from "../../actions/alert";
import UsersByType from "./UsersByType";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Profiles = ({
	getUsers,
	closeSideNav,
	getUsersByType,
	user: { users, loading },
}) => {
	const [students, setStudents] = useState([]);
	const [faculty, setFaculty] = useState([]);
	const [alumni, setAlumni] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [search, setSearch] = useState("");

	const query = useQuery();
	const navigate = useNavigate();  // for updating URL
	const searchQuery = query.get("search");

	useEffect(() => {
		closeSideNav();

		const loadUsers = async () => {
			const studentsData = await getUsersByType("student");
			setStudents(studentsData);

			const alumniData = await getUsersByType("alumni");
			setAlumni(alumniData);

			const facultyData = await getUsersByType("faculty");
			setFaculty(facultyData);

			const adminsData = await getUsersByType("admin");
			setAdmins(adminsData);
		};

		loadUsers();
	}, [closeSideNav, getUsersByType]);

	useEffect(() => {
		if (searchQuery) {
			setSearch(searchQuery);
			getUsers(searchQuery);
		} else {
			getUsers();
		}
	}, [searchQuery, getUsers]);

	const handleSubmit = (e) => {
		e.preventDefault(); // STOP browser reload

		if (search.trim()) {
			navigate(`?search=${search}`);
		} else {
			navigate(`/profiles`); // if search cleared, go to profiles page
		}
	};

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
						<form className="col-12 search-form" onSubmit={handleSubmit}>
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

					{/* User Stats */}
					<div className="user-type-stats" style={{ textAlign: "center" }}>
						<ul className="profile-stats">
							<UsersByType users={alumni} label={"Alumni"} />
							<UsersByType users={students} label={"Students"} />
							<UsersByType users={faculty} label={"Faculty"} />
							<UsersByType users={admins} label={"Admin"} />
						</ul>
					</div>

					{/* Profiles */}
					<h5 className="row ml-5 pb-2 mt-5" style={{ textAlign: "center" }}>
						{users && users.length} users found
					</h5>

					<div className="container profile-page grid-container">
						{users && users.length > 0 ? (
							users.map((user) => (
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
	getUsers: PropTypes.func.isRequired,
	closeSideNav: PropTypes.func.isRequired,
	getUsersByType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps, {
	getUsers,
	closeSideNav,
	getUsersByType,
})(Profiles);
