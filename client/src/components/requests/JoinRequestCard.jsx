import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { rejectJoinRequest, approveJoinRequest } from "../../actions/request";

const JoinRequestCard = ({
	request,
	rejectJoinRequest,
	approveJoinRequest,
}) => {
	return (
		<div className="join-request-card">
			<ul className="join-request-card-info">
				<li>
					<strong>Name : </strong>
					{request.name}
				</li>
				<li>
					<strong>Role : </strong>
					{request.role}
				</li>
				<li>
					<strong>Email : </strong>
					{request.email}
				</li>
				{request.role === "student" && (
					<React.Fragment>
						<li><strong>Program Name : </strong>{request.program}</li>
						<li><strong>Starting Year : </strong>{request.starting_year}</li>
						<li><strong>Passing Year :</strong> {request.passing_year}</li>
					</React.Fragment>
				)}
				{request.role === "alumni" && (
					<React.Fragment>
						<li>
							<strong>Program Name : </strong> {request.program}
						</li>
						<li>
							<strong>Starting Year : </strong>{" "}
							{request.starting_year}
						</li>
						<li>
							<strong>Passing Year : </strong>
							{request.passing_year}
						</li>
						<li>
							<strong>Working Area : </strong>
							{request.working_area}
						</li>
						<li>
							<strong>Organisation : </strong>
							{request.organisation}
						</li>
						<li>
							<strong>Working as : </strong>
							{request.designation}
						</li>
						<li>
							<strong>Location : </strong>
							{request.location}
						</li>
					</React.Fragment>
				)}
				{request.role === "professor" && (
					<React.Fragment>
						<li>
							<strong>Working as : </strong>
							{request.designation}
						</li>
						<li>
							<strong>Department : </strong>
							{request.department}
						</li>
					</React.Fragment>
				)}
			</ul>
			<div className="action-buttons-request-card">
				<button
					className="row action-button-request-card approve-button"
					onClick={() => approveJoinRequest(request._id)}
				>
					<i
						className="fa fa-check"
						aria-hidden="true"
						style={{ marginTop: "3px" }}
					></i>
					Approve
				</button>
				<button
					className="row action-button-request-card reject-button"
					onClick={() => rejectJoinRequest(request._id)}
				>
					<i
						className="fa fa-times"
						aria-hidden="true"
						style={{ marginTop: "3px" }}
					></i>
					Decline
				</button>
			</div>
		</div>
	);
};

JoinRequestCard.propTypes = {
	request: PropTypes.object.isRequired,
	approveJoinRequest: PropTypes.func.isRequired,
	rejectJoinRequest: PropTypes.func.isRequired,
};

export default connect(null, {
	approveJoinRequest,
	rejectJoinRequest,
})(JoinRequestCard);
