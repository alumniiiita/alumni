import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setAlert, closeSideNav } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

// ✅ Helper function to check password strength
const checkPasswordStrength = (password) => {
	if (password.length < 6) return "Weak";
	if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
	if (password.match(/[a-zA-Z]/) && password.match(/[0-9]/)) return "Medium";
	return "Weak";
};

const Register = ({ setAlert, register, closeSideNav, isAuthenticated }) => {
	useEffect(() => {
		closeSideNav();
	}, []);

	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [pendingApproval, setPendingApproval] = useState(false);

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
	} = formInput;

	const [passwordStrength, setPasswordStrength] = useState("Weak");
	const [showStudentFields, setShowStudentFields] = useState(true);
	const [showFacultyFields, setShowFacultyFields] = useState(false);
	const [showAlumniFields, setShowAlumniFields] = useState(false);

	const onChangeSelectValue = (e) => {
		const value = e.target.value;
		setFormInput({ ...formInput, [e.target.name]: value });

		setShowStudentFields(false);
		setShowAlumniFields(false);
		setShowFacultyFields(false);

		if (value === "faculty") setShowFacultyFields(true);
		else if (value === "alumni") setShowAlumniFields(true);
		else if (value === "student") setShowStudentFields(true);
	};

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormInput({ ...formInput, [name]: value });

		// ✅ Password strength checking
		if (name === "password") {
			setPasswordStrength(checkPasswordStrength(value));
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password_confirm) {
			setAlert("Passwords do not match", "danger");
			return;
		}

		// ✅ Do not allow weak passwords
		if (passwordStrength === "Weak") {
			setAlert("Password is too weak. Please choose a stronger password.", "danger");
			return;
		}

		setLoading(true);

		if (role === "alumni") {
			alert("Please fill your details at the redirected Link");
			window.open("https://alumni.iiita.ac.in/alumni/login/", "_blank");
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
		});
		setLoading(false);

		if (success) {
			setFormInput({
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
			});
			setPasswordStrength("Weak");
			setPendingApproval(true);
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
				{/* Name */}
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

				{/* Email */}
				<div className="form-group">
					<label htmlFor="email">
						Email Address <span style={{ color: "red" }}>*</span>
						<br />
						<small style={{ color: "gray" }}>
							(Students must register using their college email ID, e.g., iit2020xxx@iiita.ac.in)
						</small>
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

				{/* Role */}
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
						<option value="faculty">Faculty</option>
						<option value="student">Student</option>
						<option value="alumni">Alumni</option>
					</select>
				</div>

				{/* Password */}
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
					{/* ✅ Password strength message */}
					{password && (
						<div style={{
							color: passwordStrength === "Strong" ? "green" :
								   passwordStrength === "Medium" ? "orange" : "red",
							marginTop: "0.5em"
						}}>
							Password Strength: {passwordStrength}
						</div>
					)}
				</div>

				{/* Confirm Password */}
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
                
				{/* Conditional Student/Alumni Fields */}
				{(showStudentFields || showAlumniFields) && (
					<>
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
								<option value="phd">PhD</option>
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
					</>
				)}

				{/* Alumni-specific Fields */}
				{showAlumniFields && (
					<>
						<div className="form-group">
							<p>Select your Working Area</p>
							<select
								name="working_area"
								id="working_area"
								className="form-dropdown"
								value={working_area}
								onChange={onChange}
							>
								<option value="public_sector">Public Sector</option>
								<option value="business">Business/Entrepreneurship</option>
								<option value="private_sector">Private Sector</option>
								<option value="mba_finance">MBA/Finance</option>
								<option value="academic_area">Academic Area</option>
								<option value="higher_studies">Higher Studies</option>
								<option value="other">Other</option>
							</select>
						</div>

						<div className="form-group">
							<input
								type="text"
								name="organisation"
								id="organisation"
								value={organisation}
								placeholder="Enter your Organisation/Institute Name"
								onChange={onChange}
								required
							/>
						</div>

						<div className="form-group">
							<input
								type="text"
								name="location"
								id="location"
								value={location}
								placeholder="Location"
								onChange={onChange}
								required
							/>
						</div>
					</>
				)}

				{/* Faculty + Alumni Fields */}
				{(showFacultyFields || showAlumniFields) && (
					<div className="form-group">
						<input
							type="text"
							name="designation"
							id="designation"
							value={designation}
							placeholder="Enter your Designation/Position"
							onChange={onChange}
							required
						/>
					</div>
				)}

				{/* Faculty-specific Fields */}
				{showFacultyFields && (
					<div className="form-group">
						<select
							className="form-dropdown"
							name="department"
							id="department"
							value={department}
							onChange={onChange}
						>
							<option value="it">Information Technology</option>
							<option value="ece">Electronics and Communications</option>
							<option value="management">Management Studies</option>
							<option value="applied_science">Applied Sciences</option>
						</select>
					</div>
				)}

				{/* Alumni warning */}
				{showAlumniFields && (
					<div style={{ paddingBottom: "1em", color: "red" }}>
						<strong>
							Note: It is mandatory to fill your information on alumni.iiita.ac.in,
							without which your join request won't be accepted.
						</strong>
					</div>
				)}

				{/* Submit */}
				<input
					type="submit"
					className="btn btn-primary"
					value={loading ? "Submitting..." : "Sign Up"}
					disabled={loading}
				/>

				{/* Loading/Pending messages */}
				{loading && (
					<div style={{ marginTop: "1em", color: "blue" }}>
						<i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
						Sending join request for approval...
					</div>
				)}
				{pendingApproval && (
                  	<div style={{ marginTop: "1em", color: "green", fontWeight: "bold" }}>
	                 	Registration successful! Your account is now pending approval by the admin. You will receive an email at your registered address once the approval is complete.
	                </div>
                )}
			</form>

			<p className="my-1">
				Already have an account? <Link to="/login">Login</Link>
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

export default connect(mapStateToProps, { setAlert, register, closeSideNav })(Register);
