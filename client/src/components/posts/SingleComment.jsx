import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deleteComment } from "../../actions/post";
import { connect } from "react-redux";

const SingleComment = ({
	comment: { _id, text, name, avatar, user },
	currentUser,
	postId,
	deleteComment,
}) => {
	return (
		<div
			className="row single-comment-display"
			style={{ marginTop: "0.5em" }}
		>
			<div
				className="col-md-1 col-sm-2 col-xs-2"
				style={{ textAlign: "center" }}
			>
				<div className="">
					<img
						alt=""
						src={avatar}
						className="avatar avatar-sm rounded-circle"
					/>
				</div>
				<div className="">
					<Link to={`/profile/${user}`}>{name}</Link>
				</div>
			</div>

			<div className="col-md-10 col-sm-8 col-xs-8">{text}</div>

			{user === currentUser && (
				<div className="col-md-1 col-sm-2 col-xs-2">
					<i
						className="fa fa-trash delete-comment-button"
						aria-hidden="true"
						onClick={() => deleteComment(postId, _id)}
					/>
				</div>
			)}
		</div>
	);
};

SingleComment.propTypes = {
	comment: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired
};

export default connect(null, { deleteComment })(SingleComment);
