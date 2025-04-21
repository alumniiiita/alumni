import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setAlert, closeSideNav } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, closeSideNav, isAuthenticated }) => {
	useEffect(() => {
		closeSideNav();
	}, []);

	const history = useHistory();
	const [formInput, setFormInput] = useState({
		name: "",
		email: "",
		password: "",
		password_confirm: "",
		role: "student",
		program: "btech-it",
		starting_year: "",
		passing_year: "",
		designation: "",
		organisation: "",
		location: "",
		department: "it",
		working_area: "public_sector",
		linkedinId: "" // Added LinkedIn ID
	});

	const {
		name,
		email,
		password,
		password_confirm,
		role,
		program,
		starting_year,
		passing_year,
		designation,
		organisation,
		location,
		department,
		working_area,
		linkedinId // Extract LinkedIn ID from state
	} = formInput;

	const [showStudentFields, setShowStudentFields] = useState(true);
	const [showFacultyFields, setShowFacultyFields] = useState(false);
	const [showAlumniFields, setShowAlumniFields] = useState(false);

	const onChangeSelectValue = (e) => {
		setFormInput({ ...formInput, [e.target.name]: e.target.value });
		setShowStudentFields(false);
		setShowAlumniFields(false);
		setShowFacultyFields(false);
		if (e.target.value === "faculty") {
			setShowFacultyFields(true);
		} else if (e.target.value === "alumni") {
			setShowAlumniFields(true);
		} else if (e.target.value === "student") {
			setShowStudentFields(true);
		}
	};

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password_confirm) {
			setAlert("Passwords do not match", "danger");
		} else {
			if (role === "alumni") {
				alert("Please fill your details at the redirected Link");
				window.open(
					"https://alumni.iiita.ac.in/alumni/login/",
					"_blank"
				);
			}
			const success = await register({
				name,
				email,
				password,
				role,
				program,
				starting_year,
				passing_year,
				designation,
				organisation,
				location,
				department,
				working_area,
				linkedinId // Send LinkedIn ID in payload
			});
			console.log(success);
			if (success) {
				setTimeout(() => {
					history.push("/");
				}, 2000);
			}
		}
	};
	return (
		<div className="form-container">
	<h1>Sign Up</h1>
	<p className="lead">Create Your Account</p>
	<p style={{ color: "red", marginBottom: "1em" }}>
		<span>*</span> Indicates required field
	</p>

	<form className="form auth-form" onSubmit={onSubmit}>
		<div className="form-group">
			<label htmlFor="name">
				Name <span style={{ color: "red" }}>*</span>
			</label>
			<input
				type="text"
				placeholder="Name"
				value={name}
				name="name"
				id="name"
				required
				autoComplete="true"
				onChange={onChange}
			/>
		</div>

		<div className="form-group">
			<label htmlFor="email">
				Email Address <span style={{ color: "red" }}>*</span>
			</label>
			<input
				type="email"
				placeholder="Email address"
				name="email"
				id="email"
				value={email}
				required
				autoComplete="true"
				onChange={onChange}
			/>
		</div>

		<div className="form-group">
			<label htmlFor="linkedinId">LinkedIn ID (optional)</label>
			<input
				type="text"
				placeholder="LinkedIn ID"
				name="linkedinId"
				id="linkedinId"
				value={linkedinId}
				onChange={onChange}
			/>
		</div>

		<div className="form-group">
			<label htmlFor="role">
				Choose your role <span style={{ color: "red" }}>*</span>
			</label>
			<select
				name="role"
				id="role"
				className="form-dropdown"
				value={role}
				onChange={onChangeSelectValue}
				required
			>
				<option value="faculty">Alumni</option>
				<option value="alumni">Students</option>
				<option value="alumni">Faculty</option>
				<option value="student">Staff</option>
			</select>
		</div>

		<div className="form-group">
			<label htmlFor="password">
				Password <span style={{ color: "red" }}>*</span>
			</label>
			<input
				type="password"
				placeholder="Password"
				name="password"
				id="password"
				value={password}
				required
				autoComplete="true"
				onChange={onChange}
			/>
		</div>

		<div className="form-group">
			<label htmlFor="password_confirm">
				Confirm Password <span style={{ color: "red" }}>*</span>
			</label>
			<input
				type="password"
				placeholder="Confirm Password"
				name="password_confirm"
				id="password_confirm"
				value={password_confirm}
				required
				autoComplete="true"
				onChange={onChange}
			/>
		</div>

		{(showStudentFields || showAlumniFields) && (
			<React.Fragment>
				<div className="form-group">
					<label htmlFor="program">
						Choose your Academic Program{" "}
						<span style={{ color: "red" }}>*</span>
					</label>
					<select
						name="program"
						id="program"
						className="form-dropdown"
						value={program}
						onChange={onChange}
						required
					>
						<option value="btech-it">B.Tech IT</option>
						<option value="btech-ece">B.Tech ECE</option>
						<option value="btech-itbi">B.Tech IT-BI</option>
						<option value="mtech">M.Tech</option>
						<option value="mba">MBA</option>
						<option value="phd">PHD</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="starting_year">
						Starting Year <span style={{ color: "red" }}>*</span>
					</label>
					<input
						type="number"
						placeholder="Enter starting Year"
						name="starting_year"
						id="starting_year"
						value={starting_year}
						onChange={onChange}
						max={new Date().getFullYear()}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="passing_year">
						Passing Year <span style={{ color: "red" }}>*</span>
					</label>
					<input
						type="number"
						placeholder="Enter Passing Year"
						name="passing_year"
						id="passing_year"
						value={passing_year}
						onChange={onChange}
						min="2000"
						required
					/>
				</div>
			</React.Fragment>
		)}

		<input
			type="submit"
			className="btn btn-primary"
			value="Sign Up"
		/>
	</form>

	<p className="my-1">
		Already have an account ? <Link to="/login">Login</Link>
	</p>
</div>

	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	closeSideNav: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register, closeSideNav })(
	Register
);
