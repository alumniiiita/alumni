import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import PostCard from "./PostCard";
import { Link, useLocation } from "react-router-dom";
import { closeSideNav } from "../../actions/alert";
import { getAllChannels } from "../../actions/channel";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Posts = ({
	getPosts,
	closeSideNav,
	getAllChannels,
	post: { posts, loading },
	auth: { authUser, loadingAuth },
	extras: { channels },
	match,
}) => {
	const query = useQuery();
	const searchQuery = query.get("search");
	const [search, setSearch] = useState("");

	useEffect(() => {
		async function getMyData() {
			closeSideNav();
			await getAllChannels();
			// Decode the channel name safely
			await getPosts(searchQuery, decodeURIComponent(match.params.channel_name));
		}
		getMyData();
	}, [match.params.channel_name]);

	const searchPosts = () => {
		if (search.trim()) {
			getPosts(search.trim(), decodeURIComponent(match.params.channel_name));
		}
	};

	return loading ? (
		<Spinner />
	) : (
		<Fragment>
			<div className="feed-page">
				<div className="col">
					<h1 className="large text-primary">Posts</h1>
					<p className="lead">
						<i className="fas fa-user mr-4" />
						Welcome to the community
					</p>
				</div>
				<div className="row">
					{/* Sidebar - Channels List */}
					<ul className="col-md-3 sidebar">
						<li
							style={{
								color: "blue",
								paddingLeft: "2rem",
								textAlign: "left",
								borderBottom: "1px solid lightgrey",
							}}
						>
							<strong>Channels</strong>
						</li>
						{channels !== null && channels.map((c) => (
							<li
								key={c._id}
								className={
									match.params.channel_name === c.name
										? "selected-tab admin-side-panel-subitem"
										: "admin-side-panel-subitem"
								}
							>
								<Link
									to={`/feed/topic/${encodeURIComponent(c.name)}?search=${search}`}
									className="side-nav-channel-link"
								>
									<span>{c.name}</span>
								</Link>
							</li>
						))}
					</ul>

					{/* Main Content */}
					<div className="content col-md-9">
						<div className="search-div">
							<Link
								to="/create-post"
								className="btn btn-light col-3 posts-top-item"
								style={{ width: "100%" }}
							>
								<i
									className="fas fa-edit"
									style={{ marginRight: "0.5em" }}
								></i>
								Create Post
							</Link>
							<form method="get" className="col-9 search-form" onSubmit={(e) => { e.preventDefault(); searchPosts(); }}>
								<input
									type="text"
									name="search"
									id="search"
									placeholder="Search here..."
									className="col-9 search-input posts-top-item"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
								<input
									type="submit"
									value="Search"
									className="btn btn-primary col-3 posts-top-item"
								/>
							</form>
						</div>

						{/* Posts List */}
						<div className="posts-list">
							{posts !== null && posts.length === 0 && (
								<h3 style={{ textAlign: "center" }}>
									No Posts to Display
								</h3>
							)}
							{posts !== null && posts.map((pst) => {
								if (
									authUser !== null &&
									(pst.visibility.includes(authUser.role) ||
										pst.user === authUser._id ||
										authUser.isAdmin)
								) {
									return (
										<PostCard key={pst._id} post={pst} />
									);
								}
								return null;
							})}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

Posts.propTypes = {
	auth: PropTypes.object.isRequired,
	extras: PropTypes.object.isRequired,
	post: PropTypes.object.isRequired,
	getPosts: PropTypes.func.isRequired,
	closeSideNav: PropTypes.func.isRequired,
	getAllChannels: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
	auth: state.auth,
	extras: state.extras,
});

export default connect(mapStateToProps, {
	getPosts,
	closeSideNav,
	getAllChannels,
})(Posts);
