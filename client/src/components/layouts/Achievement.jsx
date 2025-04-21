import React, { useState } from "react";
import PropTypes from "prop-types";
import { submitAchievement } from "../../actions/extras";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";


const Achievement = ({ setAlert, submitAchievement }) => {
	const [formInput, setFormInput] = useState({
		name: "",
		enrollment_number: "",
		program: "btech-it",
		passing_year: "",
		rewards: "",
		award_date: "",
	});
	const [image, setImage] = useState("");
	const [proof, setProof] = useState("");
	const [successOpen, setSuccessOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const { name, program, passing_year, enrollment_number, rewards, award_date } =
		formInput;

	const history = useHistory();

	const onChange = (e) =>
		setFormInput({ ...formInput, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();

		const formData1 = new FormData();
		formData1.append("file", image);

		const formData2 = new FormData();
		formData2.append("file", proof);

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};

		const res1 = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/upload-image`,
			formData1,
			config
		);
		const res2 = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/upload-image`,
			formData2,
			config
		);

		const success = submitAchievement(
			formInput,
			`${process.env.REACT_APP_BACKEND_URL}/awards/${res1.data}`,
			`${process.env.REACT_APP_BACKEND_URL}/awards/${res2.data}`
		);

		if (success) {
			setSuccessOpen(true);
			setTimeout(() => {
				history.push("/");
			}, 3000);
		} else {
			setErrorOpen(true);
		}
	};

	const handleCloseSuccess = () => {
		setSuccessOpen(false);
	};
	const handleCloseError = () => {
		setErrorOpen(false);
	};

	return (
		<React.Fragment>
			<div className="form-container">
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div style={{ paddingBottom: "1em", color: "red" }}>
						<strong>
							Note: If you are an ALUMNI and you have achieved any
							patent / reward / recognition, then you can fill out
							this form to let the institute know of your
							achievement.
						</strong>
					</div>

					<p style={{ color: "red", marginBottom: "1em" }}>
						<span>*</span> Indicates required field
					</p>

					<div className="form-group">
						<label htmlFor="name">
							Name <span style={{ color: "red" }}>*</span>
						</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="Name"
							value={name}
							required
							onChange={onChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="enrollment_number">
							Enrollment Number
							<span style={{ color: "red" }}>*</span>
						</label>
						<input
							type="text"
							name="enrollment_number"
							id="enrollment_number"
							placeholder="Enrollment Number"
							value={enrollment_number}
							onChange={onChange}
						/>
					</div>

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
							required
							onChange={onChange}
						>
							<option value="btech-it">B.Tech IT</option>
							<option value="btech-ece">B.Tech ECE</option>
							<option value="mtech">M.Tech</option>
							<option value="mba">MBA</option>
							<option value="mba">MS</option>
							<option value="mba">Dual-Degree</option>
							<option value="phd">PHD</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="passing_year">
							Passout Year <span style={{ color: "red" }}>*</span>
						</label>
						<input
							type="number"
							min="1995"
							name="passing_year"
							id="passing_year"
							placeholder="Passout Year"
							value={passing_year}
							required
							onChange={onChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="rewards">
							Awards / Achievements{" "}
							<span style={{ color: "red" }}>*</span>
						</label>
						<textarea
							className="form-group"
							name="rewards"
							id="rewards"
							rows="12"
							required
							value={rewards}
							onChange={onChange}
							placeholder={
								"Please Enter details in the following format:\n\nTitle of Award:\n\nType of Award:\n\nName of Awarding Organisation:\n\nReceived Jointly / Solo:\n\nCash Prize Received:"
							}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="award_date">
							Date of Award <span style={{ color: "red" }}>*</span>
						</label>
						<input
							type="date"
							name="award_date"
							id="award_date"
							value={award_date}
							required
							onChange={onChange}
						/>
					</div>

					<div className="form-group">
						<label>
							Your photo receiving the award / Any Passport photo
							(Supported formats: .png, .jpg, .jpeg)
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>

					<div className="form-group">
						<label>
							Certificate / Proof of Achievement (Supported formats: .pdf, .png, .jpg, .jpeg)
						</label>
						<input
							type="file"
							accept="application/pdf, image/*"
							onChange={(e) => setProof(e.target.files[0])}
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

			<Snackbar
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleCloseSuccess}
			>
				<Alert
					onClose={handleCloseSuccess}
					severity="success"
					sx={{ width: "100%" }}
					variant="filled"
				>
					Submit Success !!
				</Alert>
			</Snackbar>

			<Snackbar
				open={errorOpen}
				autoHideDuration={6000}
				onClose={handleCloseError}
			>
				<Alert
					onClose={handleCloseError}
					severity="error"
					sx={{ width: "100%" }}
					variant="filled"
				>
					Submit Error !!
				</Alert>
			</Snackbar>
		</React.Fragment>
	);
};

Achievement.propTypes = {
	submitAchievement: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, submitAchievement })(Achievement);
