import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeSideNav } from "../../actions/alert";
import { forgotPassword } from '../../actions/auth';

const ForgotPassword = ({ closeSideNav, history, forgotPassword }) => {
	useEffect(() => {
		closeSideNav();
	}, [closeSideNav]);

	const [formInput, setFormInput] = useState({
		email: "",
	});

	const { email } = formInput;

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		forgotPassword(formInput).then(link => {
			history.push(link);
		}).catch(err => {
			console.log(err);
		})
	};

	return (
		<div className="form-container">
			<h3>Forgot Password</h3>
			<p style={{ color: "blue" }}>
				{" "}
				Enter the email address associated with your account
			</p>

			<form className="form auth-form" onSubmit={(e) => onSubmit(e)}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email address"
						name="email"
						value={email}
						autoComplete="true"
						onChange={(event) => onChange(event)}
					/>
				</div>
				<input
					type="submit"
					className="btn btn-primary"
					value="Submit"
				/>
			</form>
		</div>
	);
};

ForgotPassword.propTypes = {
	closeSideNav: PropTypes.func.isRequired,
};

export default connect(null, { closeSideNav, forgotPassword })(withRouter(ForgotPassword));
