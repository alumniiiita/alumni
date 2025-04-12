import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/users";

const AddEducation = ({ addEducation, history }) => {
	const [formInput, setFormInput] = useState({
		school: "",
		degree: "",
		fieldofstudy: "",
		from: "",
		to: "",
		current: false,
		description: "",
	});

	const [toDateDisabled, toggleSwitch] = useState(false);
	const {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		description,
		current,
	} = formInput;

	const onChange = (e) => {
		setFormInput({ ...formInput, [e.target.name]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		addEducation(formInput, history);
	};

	return (
		<React.Fragment>
			<div className="profile-form-container">
				<div className="form-header">
					<h1 className="large text-primary">Add Education</h1>
					<small style={{ color: "red" }}>* = required field</small>
				</div>
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div className="form-group">
						<input
							type="text"
							placeholder="* School / University / Institution"
							name="school"
							value={school}
							onChange={onChange}
							// required
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="* Degree"
							name="degree"
							value={degree}
							onChange={onChange}
							// required
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="* Field of Study"
							name="fieldofstudy"
							value={fieldofstudy}
							onChange={onChange}
						/>
					</div>
					<div className="form-group">
						<p>From Date</p>
						<input
							type="date"
							name="from"
							value={from}
							onChange={onChange}
						/>
					</div>
					<div className="form-group checkbox-inline">
						<label>Current Study</label>
						<input
							type="checkbox"
							name="current"
							checked={current}
							value={current}
							onChange={() => {
								setFormInput({
									...formInput,
									current: !current,
								});
								toggleSwitch(!toDateDisabled);
							}}
						/>
					</div>
					<div className="form-group">
						<p>To Date</p>
						<input
							type="date"
							name="to"
							value={to}
							onChange={onChange}
							disabled={toDateDisabled ? "disabled" : ""}
						/>
					</div>
					<div className="form-group">
						<textarea
							name="description"
							style={{
								width: "100%",
								padding: "1em",
								outline: "none",
							}}
							rows="5"
							placeholder="Job Description"
							value={description}
							onChange={onChange}
						/>
					</div>
					<div className="back-submit-buttons">
						<Link
							className="btn btn-light my-1"
							to="/userprofile"
							style={{ width: "40%" }}
						>
							Go Back
						</Link>
						<input
							type="submit"
							className="btn btn-primary my-1"
							style={{ width: "40%" }}
						/>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
};

AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
