import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { closeSideNav } from "../../actions/alert";

const Login = ({ login, isAuthenticated, closeSideNav }) => {
	const [passwordType, setPasswordType] = useState("password");
	useEffect(() => {
		closeSideNav();
	}, []);

	const [formInput, setFormInput] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formInput;

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		login({ email, password });
	};

	if (isAuthenticated) {
		return <Redirect to="/feed/topic/Placements?search=" />;
	}

	const togglePassword = () => {
		setPasswordType(passwordType === "password" ? "text" : "password");
	};

	// LinkedIn Login Handler
	const handleLinkedInLogin = () => {
		  const params = new URLSearchParams({
			  response_type:'code',
			  client_id:process.env.VITE_LINKEDIN_CLIENT_ID,
			  redirect_uri:'http://localhost:5001/api/linkedin/callback',
			  scope:'openid email profile'
		  }) // Redirect to backend

		  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`
	};

	return (
		<div className="form-container">
			<h1>Login</h1>
			<p className="lead"> Login To Your Account</p>
			<form className="form auth-form" onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email address"
						name="email"
						value={email}
						autoComplete="true"
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<input
						type={passwordType}
						placeholder="Password"
						name="password"
						value={password}
						autoComplete="true"
						onChange={onChange}
						minLength="6"
					/>
					<div>
						<span style={{ cursor: "pointer" }} onClick={togglePassword}>
							Show Password
						</span>
					</div>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>

			{/* LinkedIn Login Button */}
			<div style={{ marginTop: "20px" }}>
				<button onClick={handleLinkedInLogin} style={{ padding: "10px", fontSize: "16px" }}>
					SingIn with LinkedIn
				</button>
			</div>

			<p className="my-1">
				Forgot Password? <Link to="/forgotPassword">Reset Password</Link>
			</p>
		</div>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	closeSideNav: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login, closeSideNav })(Login);
