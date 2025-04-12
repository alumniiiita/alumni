import React from "react";
import PropTypes from "prop-types";
import { deleteFeedback } from "../../actions/extras";
import { connect } from "react-redux";

const FeedbackCard = ({ data, deleteFeedback }) => {
	return (
		<div className="join-request-card Feedback-card">
			<ul className="col-9 join-request-card-info">
				<li>
					<strong>Name : </strong>
					{data.name}
				</li>
				{"enrollment_number" in data ? (
					<li>
						<strong>Enrollment Number : </strong>
						<span style={{ textTransform: "uppercase" }}>
							{data.enrollment_number}
						</span>
					</li>
				) : (
					<React.Fragment />
				)}
				<li>
					<strong>Email: </strong>
					<span>{data.email}</span>
				</li>
				<li>
					<strong>Role: </strong>
					<span style={{ textTransform: "capitalize" }}>
						{data.role}
					</span>
				</li>
				<li>
					<strong>Queries/Feedback : </strong>
					{data.feedback}
				</li>
			</ul>
			<div className="col-3">
				<div className="action-buttons-request-card">
					<button
						className="row action-button-request-card reject-button"
						onClick={() => deleteFeedback(data._id)}
					>
						<i
							className="fa fa-times"
							aria-hidden="true"
							style={{ marginTop: "3px" }}
						></i>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

FeedbackCard.propTypes = {
	data: PropTypes.object.isRequired,
	deleteFeedback: PropTypes.func.isRequired,
};

export default connect(null, { deleteFeedback })(FeedbackCard);
