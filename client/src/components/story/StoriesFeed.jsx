import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getStories, likeStory, unlikeStory } from "../../actions/story";
import Spinner from "../layouts/Spinner";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

const StoriesFeed = ({ getStories, likeStory, unlikeStory, story: { stories, loading }, auth: { authUser } }) => {
	const [page, setPage] = useState(1);

	useEffect(() => {
		getStories(page);
	}, [getStories, page]);

	const loadMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	return loading ? (
		<Spinner />
	) : (
		<div className="container">
			<h1 className="large text-primary">Stories of Our Alumni</h1>

			{authUser && authUser.role === "alumni" && (
				<div style={{ textAlign: "right", marginBottom: "1em" }}>
					<Link to="/stories/add" className="btn btn-success">
						<i className="fas fa-plus-circle" style={{ marginRight: "5px" }}></i>
						Share Your Story
					</Link>
				</div>
			)}

			{stories.length === 0 ? (
				<h3>No Stories yet...</h3>
			) : (
				stories.map((story) => (
					<div
						key={story._id}
						className="card mb-4"
						style={{
							background: "#fff",
							borderRadius: "12px",
							boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
							padding: "1.5em",
							marginBottom: "2em",
							textAlign: "center",
						}}
					>
						{story.image && (
							<div style={{ marginBottom: "1em" }}>
								<img
									src={`${process.env.REACT_APP_BACKEND_URL}${story.image}`}
									alt="Story"
									style={{
										width: "100%",
										maxHeight: "400px",
										objectFit: "cover",
										borderRadius: "8px",
									}}
								/>
							</div>
						)}

						<p style={{ fontSize: "1.2rem", marginBottom: "1em" }}>
							"{story.text}"
						</p>

						<p style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5em" }}>
							Posted on {moment(story.date).format('MMMM Do YYYY, h:mm a')}
						</p>

						<small style={{ color: "gray" }}>
							— <Link to={`/profile/${story.user}`} style={{ textDecoration: "none", color: "gray", fontWeight: "bold" }}>
								{story.name}
							  </Link>
						</small>

						{/* Like/Unlike Button */}
						{/* Like & Unlike Buttons */}
                     <div style={{ marginTop: "1em", display: "flex", justifyContent: "center", gap: "1em" }}>
	<button
		onClick={() => likeStory(story._id)}
		className="btn btn-light"
		style={{ display: "flex", alignItems: "center" }}
	>
		<i className="fas fa-heart" style={{ marginRight: "5px" }}></i> Like
	</button>

	<button
		onClick={() => unlikeStory(story._id)}
		className="btn btn-danger"
		style={{ display: "flex", alignItems: "center" }}
	>
		<i className="fas fa-heart-broken" style={{ marginRight: "5px" }}></i> Unlike
	</button>

	<span style={{ alignSelf: "center", marginLeft: "10px", color: "gray" }}>
		{story.likes.length} Likes
	</span>
                      </div>
					</div>
				))
			)}

			{/* Load More Button */}
			<div style={{ textAlign: "center", marginTop: "2em" }}>
				<button className="btn btn-primary" onClick={loadMore}>
					Load More Stories
				</button>
			</div>
		</div>
	);
};

StoriesFeed.propTypes = {
	getStories: PropTypes.func.isRequired,
	likeStory: PropTypes.func.isRequired,
	unlikeStory: PropTypes.func.isRequired,
	story: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	story: state.story,
	auth: state.auth,
});

export default connect(mapStateToProps, { getStories, likeStory, unlikeStory })(StoriesFeed);
