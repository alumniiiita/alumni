import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { toggleLike, toggleDisLike, deletePost } from "../../actions/post";
import parse from "html-react-parser";

const PostCard = ({
	post: {
		_id,
		heading,
		text,
		likes,
		dislikes,
		comments,
		date,
		user,
		avatar,
		name,
	},
	auth: { loadingAuth, authUser },
	toggleLike,
	toggleDisLike,
	deletePost,
}) => {
	return (
		<div className="post-card bg-white p-2 my-3">
			<div className="row post-card-row">
				<div
					className="col-md-2"
					style={{ textAlign: "center", margin: "auto auto" }}
				>
					<Link to={`/profile/${user}`}>
						<img
							className="rounded-circle"
							alt="avatar"
							src={avatar}
							width="45"
						/>
						<h6>{name}</h6>
					</Link>
				</div>
				<div className="col-md-10">
					<div className="row post-card-row pl-2">
						<Link to={`/posts/${_id}`}>
							<strong>
								<h3>{heading}</h3>
							</strong>
						</Link>
					</div>
					<div className="row post-card-row">
						<span className="my-1 single-post-text">{parse(text)}</span>
					</div>
					<div className="row post-card-row post-actions">
						<button
							type="button"
							className="btn post-action"
							onClick={(e) => toggleLike(_id)}
						>
							<i
								className="far fa-thumbs-up post-icons"
								style={{ marginBottom: "0.1em" }}
								aria-hidden="true"
							/>
							<div className="post-action-count">
								<span>{likes.length}</span>
							</div>
						</button>
						<button
							type="button"
							className="btn post-action"
							onClick={(e) => toggleDisLike(_id)}
						>
							<i
								className="far fa-thumbs-down post-icons"
								style={{ marginTop: "0.5em" }}
								aria-hidden="true"
							/>
							<span>{dislikes.length}</span>
						</button>
						<button className="btn post-action">
							<i
								className="far fa-comments post-icons"
								aria-hidden="true"
							/>
							<div className="post-action-count">
								<span>{comments.length}</span>
							</div>
						</button>
						{!loadingAuth && authUser._id === user && (
							<button
								className="btn post-action"
								onClick={(e) => deletePost(_id)}
							>
								<i
									className="fa fa-trash post-icons"
									aria-hidden="true"
								/>
							</button>
						)}
						<p className="post-date post-action">
							<i
								className="far fa-calendar post-icons"
								aria-hidden="true"
							/>
							<Moment fromNow>{date}</Moment>
						</p>
					</div>
				</div>
			</div>
		</div>
		// <div class="bg-white border mt-2 post-card">
		// 	<div>
		// 		<div class="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
		// 			<div class="d-flex flex-row align-items-center feed-text px-2">
		// 				<img
		// 					class="rounded-circle"
		// 					src={avatar}
		// 					width="45"
		// 				/>
		// 				<div class="d-flex flex-column flex-wrap ml-2">
		// 					<span class="font-weight-bold">{name}</span>
		// 					<span class="text-black-50 time">
		// 						<Moment fromNow>{date}</Moment>
		// 					</span>
		// 				</div>
		// 			</div>
		// 			<div class="feed-icon px-2">
		// 				<i class="fa fa-ellipsis-v text-black-50"></i>
		// 			</div>
		// 		</div>
		// 		<div >
		// 			{heading}
		// 		</div>
		// 	</div>
		// 	<div class="p-2 px-3 single-post-text">
		// 		<span>
		// 			{parse(text)}
		// 		</span>
		// 	</div>
		// 	<div class="d-flex justify-content-end socials p-2 py-3">
		// 		<i class="fa fa-thumbs-up"></i>
		// 		<i class="fa fa-comments-o"></i>
		// 		<i class="fa fa-share"></i>
		// 	</div>
		// </div>
	);
};

PostCard.propTypes = {
	post: PropTypes.object.isRequired,
	toggleLike: PropTypes.func.isRequired,
	toggleDisLike: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
	toggleLike,
	toggleDisLike,
	deletePost,
})(PostCard);
