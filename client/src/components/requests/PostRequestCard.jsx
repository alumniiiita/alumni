import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { rejectPostRequest, approvePostRequest } from "../../actions/request";
import parse from "html-react-parser";

const PostRequestCard = ({
	request,
	rejectPostRequest,
	approvePostRequest,
}) => {
	const {
		heading,
		text,
		avatar,
		user,
		date,
		name,
		visibility,
		images,
		channel,
	} = request;
	return (
		<div className="post-request-card">
			<div className="col-9">
				<div className="row post-request-card-user-info">
					<div className="float-left">
						<img
							src={avatar}
							alt="user-avatar"
							className="avatar-sm round-img"
							style={{ height: "30px", width: "30px" }}
						/>
						<Link
							to={`/profile/${user}`}
							style={{ color: "black" }}
						>
							<span
								style={{
									fontSize: "1.2rem",
									margin: "3px",
									marginLeft: "0.5em",
									marginRight: "0.5em",
								}}
							>
								{name}
							</span>
						</Link>
					</div>
					<div className="float-right" style={{ marginTop: "10px" }}>
						<Moment fromNow>{date}</Moment>
					</div>
				</div>
				<div className="row">
					<p style={{ fontWeight: "bolder", fontSize: "1.3rem" }}>
						{heading}
					</p>
				</div>
				<div className="row">
					<span>{parse(text)}</span>
					{request.images !== null &&
						request.images.map((image_name) => {
							return (
								<img
									src={`http://localhost:5000/awards/${image_name}`}
									style={{
										height: "500px",
										width: "700px",
									}}
								/>
							);
						})}
				</div>
				<div className="row">
					<p>
						<strong>Channel : </strong>
						{channel}
					</p>
				</div>
				<div className="row">
					{visibility.map((item) => {
						return (
							<span key={item} className="tag">
								{item}
							</span>
						);
					})}
				</div>
			</div>
			<div className="col-3 action-buttons-div">
				<div className="action-buttons-request-card">
					<button
						className="row action-button-request-card approve-button"
						onClick={() => approvePostRequest(request._id)}
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
						onClick={() => rejectPostRequest(request._id)}
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
		</div>
	);
};

PostRequestCard.propTypes = {
	request: PropTypes.object.isRequired,
	approvePostRequest: PropTypes.func.isRequired,
	rejectPostRequest: PropTypes.func.isRequired,
};

export default connect(null, {
	approvePostRequest,
	rejectPostRequest,
})(PostRequestCard);
