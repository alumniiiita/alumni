import React, { useState } from "react";
import { submitFeedback } from "../../actions/extras";
import { connect } from "react-redux";

const Help = ({ submitFeedback }) => {
	const [formInput, setFormInput] = useState({
		name: "",
		email: "",
		role: "student",
		feedback: "",
	});

	const { name, email, role, feedback } = formInput;

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		const status = submitFeedback(formInput);
		setTimeout(() => {
			if (status) {
				setFormInput({
					name: "",
					email: "",
					role: "student",
					feedback: "",
				});
			}
		}, 1500);
	};

	return (
		<React.Fragment>
			<div className="help-page" style={{ display: "flex" }}>
				<div className="container post-form-container">
					<div className="form-header">
						<h5 className="large text-primary">
							For any queries/feedback, you can fill out this form
						</h5>
					</div>
					<form className="form" onSubmit={(e) => onSubmit(e)}>
						<div className="form-group">
							<input
								type="text"
								name="name"
								value={name}
								id="name"
								placeholder="Name"
								onChange={(e) => onChange(e)}
								required
							/>
						</div>
						<div className="form-group">
							<input
								type="email"
								name="email"
								id="email"
								value={email}
								placeholder="Email Address"
								onChange={(e) => onChange(e)}
								required
							/>
						</div>
						<div className="form-group">
							<p>Select your role</p>
							<select
								name="role"
								id="role"
								className="form-dropdown"
								value={role}
								onChange={(e) => onChange(e)}
								required
							>
								<option value="student">Student</option>
								<option value="faculty">Faculty</option>
								<option value="alumni">Alumni</option>
							</select>
						</div>
						<div className="form-group">
							<textarea
								name="feedback"
								id="feedback"
								rows="6"
								value={feedback}
								onChange={(e) => onChange(e)}
								required
							/>
						</div>
						<div className="form-group">
							<input
								type="submit"
								value="Submit"
								className="btn btn-primary"
							/>
						</div>
					</form>
				</div>
				<div
					className="container"
					style={{ padding: "2em", alignSelf: "center" }}
				>
					<h5 className="text-primary">Contact us:</h5>
					<div className="help-section help-location-div">
						<i
							className="fas fa-map-marker-alt location-icon"
							aria-hidden="false"
						></i>
						<p className="contact-info">
							Office of Alumni Affairs Admin Extension-1, IIIT
							Allahabad, Devghat, Jhalwa Prayagraj - 211015 Uttar
							Pradesh, India
						</p>
					</div>
					<div className="help-section help-mail-div">
						<i className="fa fa-envelope mail-icon"></i>
						<div className="contact-info">
							<p>alumni.coordinator@iiita.ac.in</p>
							<p>alumni.connect@iiita.ac.in</p>
						</div>
					</div>
					<div className="help-section help-phone-div">
						<i
							className="fa fa-phone phone-icon"
							aria-hidden="true"
						></i>
						<div className="contact-info">
							<p>(91) 0532 292 2599/2308</p>
							<p>(91) 7317319062</p>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default connect(null, { submitFeedback })(Help);
