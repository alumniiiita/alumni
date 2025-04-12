import React from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { deleteExperience } from "../../actions/users";

const Experience = ({ experience, deleteExperience }) => {
	const experiences = experience.map((exp) => (
		<div className="row experience-card" key={exp._id}>
			<div className="col-md-10">
				<h3 className="text-dark">{exp.company}</h3>
				<p>
					<Moment format="DD/MM/YYYY">{exp.from}</Moment> --{" "}
					{exp.current ? (
						"Now"
					) : (
						<Moment format="DD/MM/YYYY">{exp.to}</Moment>
					)}
				</p>
				<p>
					<strong>Position:</strong> {exp.title}
				</p>
				<p>
					<strong>Location:</strong> {exp.location}
				</p>
				<p>
					<strong>Description:</strong> {exp.description}
				</p>
			</div>
			<div className="col-md-2">
				<button
					className="btn btn-danger"
					onClick={() => {
						deleteExperience(exp._id);
					}}
				>
					Delete
				</button>
			</div>
		</div>
	));

	return (
		<React.Fragment>
			<h2 className="my-2" style={{textAlign:"center"}}>Experience</h2>
			<div className="experience-list">
				{experience.length > 0 ? experiences : <div style={{textAlign: "center"}}>You have not added any experiences yet</div>}
			</div>
		</React.Fragment>
	);
};

Experience.propTypes = {
	experience: PropTypes.array.isRequired,
	deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
