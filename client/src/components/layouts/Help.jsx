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
	const [loading, setLoading] = useState(false);

	const { name, email, role, feedback } = formInput;

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const status = await submitFeedback(formInput);
		setLoading(false);
		if (status) {
			setFormInput({
				name: "",
				email: "",
				role: "student",
				feedback: "",
			});
		}
	};

	return (
		<React.Fragment>
			<div className="help-page" style={{ display: "flex" }}>
				<div className="container post-form-container">
					<div className="form-header">
						<h5 className="large text-primary">
							For any queries/feedback, you can fill out this form
						</h5>
						<p style={{ color: "red", marginBottom: "1em" }}>
							<span>*</span> Indicates required field
						</p>
					</div>
					<form className="form" onSubmit={onSubmit}>
						<div className="form-group">
							<label htmlFor="name">
								Name <span style={{ color: "red" }}>*</span>
							</label>
							<input
								type="text"
								name="name"
								value={name}
								id="name"
								placeholder="Name"
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">
								Email Address <span style={{ color: "red" }}>*</span>
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={email}
								placeholder="Email Address"
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="role">
								Select your role <span style={{ color: "red" }}>*</span>
							</label>
							<select
								name="role"
								id="role"
								className="form-dropdown"
								value={role}
								onChange={onChange}
								required
							>
								<option value="student">Student</option>
								<option value="faculty">Faculty</option>
								<option value="alumni">Alumni</option>
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="feedback">
								Your Feedback <span style={{ color: "red" }}>*</span>
							</label>
							<textarea
								name="feedback"
								id="feedback"
								rows="6"
								value={feedback}
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group">
							<input
								type="submit"
								value={loading ? "Submitting..." : "Submit"}
								className="btn btn-primary"
								disabled={loading}
							/>
						</div>
						{loading && (
							<div style={{ marginTop: "1em", color: "blue" }}>
								<i
									className="fa fa-spinner fa-spin"
									style={{ marginRight: "8px" }}
								></i>
								Submitting your feedback...
							</div>
						)}
					</form>
				</div>
				<div
					className="container"
					style={{ padding: "2em", alignSelf: "center" }}
				>
					<h5 className="text-primary">Contact us:</h5>
					<div className="help-section help-location-div">
						<i className="fas fa-map-marker-alt location-icon" />
						<p className="contact-info">
							Office of Alumni Affairs Admin Extension-1, IIIT
							Allahabad, Devghat, Jhalwa Prayagraj - 211015 Uttar
							Pradesh, India
						</p>
					</div>
					<div className="help-section help-mail-div">
						<i className="fa fa-envelope mail-icon" />
						<div className="contact-info">
							<p>alumni.coordinator@iiita.ac.in</p>
							<p>alumni.connect@iiita.ac.in</p>
						</div>
					</div>
					<div className="help-section help-phone-div">
						<i className="fa fa-phone phone-icon" />
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
