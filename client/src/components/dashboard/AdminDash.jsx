import Icon from "awesome-react-icons";
import React, { useState, useEffect } from "react";
import JoinRequestCard from "../requests/JoinRequestCard";
import PostRequestCard from "../requests/PostRequestCard";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getJoinRequests, getPostRequests } from "../../actions/request";
import Spinner from "../layouts/Spinner";
import Settings from "../layouts/Settings";
import DisplayAchievments from "./DisplayAchievements";
import DisplayFeedbacks from "./DisplayFeedbacks";


import { getAchievements, getFeedbacks } from "../../actions/extras";

const AdminDash = ({
	getJoinRequests,
	getPostRequests,
	getAchievements,
	getFeedbacks,
	request: { joinRequests, postRequests, loading },
	auth: { authUser },
	extras,
}) => {
	useEffect(() => {
		getJoinRequests();
		getPostRequests();
		getAchievements();
		getFeedbacks();
	}, []);

	// data and set data
	const [studentJoin, setStudentJoin] = useState(false);
	const [alumniJoin, setAlumniJoin] = useState(false);
	const [professorJoin, setProfessorJoin] = useState(false);
	const [studentPost, setStudentPost] = useState(false);
	const [alumniPost, setAlumniPost] = useState(false);
	const [professorPost, setProfessorPost] = useState(false);

	//show and not show
	const [showAllJoin, setShowAllJoin] = useState(true);
	const [showAllPost, setShowAllPost] = useState(false);
	const [showStudentJoin, setShowStudentJoin] = useState(false);
	const [showAlumniJoin, setShowAlumniJoin] = useState(false);
	const [showProfessorJoin, setShowProfessorJoin] = useState(false);
	const [showStudentPost, setShowStudentPost] = useState(false);
	const [showAlumniPost, setShowAlumniPost] = useState(false);
	const [showProfessorPost, setShowProfessorPost] = useState(false);
	const [showAchievements, setShowAchievements] = useState(false);
	const [showFeedbacks, setShowFeedbacks] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	const fields = [
		{ label: "ID", key: "_id" },
		{ label: "Name", key: "name" },
		{ label: "Enrollment number", key: "enrollment_number" },
		{ label: "Program", key: "program" },
		{ label: "Passing year", key: "passing_year" },
		{ label: "Awards", key: "rewards" },
		{ label: "Award Date", key: "award_date" },
		{ label: "Image Link", key: "imgUrl" },
		{ label: "Certificate Link", key: "proofUrl" },
	];

	// handle loading state and spinner
	const [joinTabOpen, setJoinTabOpen] = useState(true);
	const [postTabOpen, setPostTabopen] = useState(false);

	const fillJoinRequests = (filter) => {
		if (joinRequests !== null) {
			const filteredRequests = joinRequests.filter(
				(req) => req.role === filter
			);

			switch (filter) {
				case "student":
					setStudentJoin(filteredRequests);
					break
				case "alumni":
					setAlumniJoin(filteredRequests);
					break
				case "professor":
					setProfessorJoin(filteredRequests);
					break
				default:
					setStudentJoin([])
					setAlumniJoin([])
					setProfessorJoin([])
			}
		}
	};

	const fillPostRequests = (filter) => {
		if (postRequests !== null) {
			const filteredRequests = postRequests.filter(
				(req) => req.role === filter
			);

			switch (filter) {
				case "student":
					setStudentPost(filteredRequests);
					break
				case "alumni":
					setAlumniPost(filteredRequests);
					break
				case "professor":
					setProfessorPost(filteredRequests);
					break
				default:
					setStudentPost([])
					setAlumniPost([])
					setProfessorPost([])
			}
		}
	};

	const closeAllTabs = () => {
		setShowAllJoin(false);
		setShowAllPost(false);
		setShowAlumniJoin(false);
		setShowStudentJoin(false);
		setShowProfessorJoin(false);
		setShowAlumniPost(false);
		setShowStudentPost(false);
		setShowProfessorPost(false);
		setShowAchievements(false);
		setShowFeedbacks(false);
		setShowSettings(false);
	};

	return (
		<React.Fragment>
			<div className="my-container">
				<div
					className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0
				border-r-2 lg:translate-x-0 lg:static lg:inset-0 ease-out translate-x-0 col-3 admin-side-nav float-child"
				>
					<ul>
						<li
							className={
								joinTabOpen || showAllJoin
									? "selected-tab"
									: "admin-side-panel-subitem"
							}
							onClick={() => {
								setJoinTabOpen(!joinTabOpen);
								closeAllTabs();
								setShowAllJoin(true);
							}}
						>
							<Icon name="user" />
							Join Requests
						</li>
						{joinTabOpen && (
							<React.Fragment>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillJoinRequests("student");
										closeAllTabs();
										setShowStudentJoin(true);
									}}
								>
									Students
								</li>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillJoinRequests("alumni");
										closeAllTabs();
										setShowAlumniJoin(true);
									}}
								>
									Alumni
								</li>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillJoinRequests("professor");
										closeAllTabs();
										setShowProfessorJoin(true);
									}}
								>
									Professors
								</li>
							</React.Fragment>
						)}
					</ul>
					<ul>
						<li
							className={
								postTabOpen || showAllPost
									? "selected-tab"
									: "admin-side-panel-subitem"
							}
							onClick={() => {
								setPostTabopen(!postTabOpen);
								closeAllTabs();
								setShowAllPost(true);
							}}
						>
							<Icon name="message-square" />
							Post Requests
						</li>
						{postTabOpen && (
							<React.Fragment>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillPostRequests("student");
										closeAllTabs();
										setShowStudentPost(true);
									}}
								>
									Students
								</li>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillPostRequests("alumni");
										closeAllTabs();
										setShowAlumniPost(true);
									}}
								>
									Alumni
								</li>
								<li
									className="admin-side-panel-subitem panel-subsubitem"
									onClick={() => {
										fillPostRequests("professor");
										closeAllTabs();
										setShowProfessorPost(true);
									}}
								>
									Professors
								</li>
							</React.Fragment>
						)}
					</ul>
					<ul>
						<li
							className={
								showAchievements
									? "selected-tab"
									: "admin-side-panel-subitem"
							}
							onClick={() => {
								closeAllTabs();
								setShowAchievements(true);
							}}
						>
							<Icon name="book" />
							Achievemnets
						</li>
					</ul>
					<ul>
						<li
							className={
								showFeedbacks
									? "selected-tab"
									: "admin-side-panel-subitem"
							}
							onClick={() => {
								closeAllTabs();
								setShowFeedbacks(true);
							}}
						>
							<Icon name="edit-pencil-simple" />
							Feedbacks/Queries
						</li>
					</ul>
					{authUser.adminType === "head" && (
						<ul>
							<li
								className={
									showSettings
										? "selected-tab"
										: "admin-side-panel-subitem"
								}
								onClick={() => {
									closeAllTabs();
									setShowSettings(true);
								}}
							>
								<Icon name="settings" />
								Settings
							</li>
						</ul>
					)}
				</div>
				<div className="row">
					{showAllJoin ? (
						loading ? (
							<Spinner />
						) : (
							<React.Fragment>
								{joinRequests !== null &&
									joinRequests.length === 0 && (
										<div className="no-data-page">
											No Join Requests Found
										</div>
									)}
								<div className="request-list-admin-dash float-child" style={{height: "800px"}}>
									{joinRequests !== null &&
										joinRequests.map((item) => {
											return (
												<JoinRequestCard
													key={item._id}
													request={item}
												/>
											);
										})}
								</div>
							</React.Fragment>
						)
					) : (
						<React.Fragment />
					)}

					{showStudentJoin && (
						<React.Fragment>
							{studentJoin.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									No Join requests found
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{studentJoin.map((item) => {
									return (
										<JoinRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showProfessorJoin && (
						<React.Fragment>
							{professorJoin.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									No Join requests found
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{professorJoin.map((item) => {
									return (
										<JoinRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showAlumniJoin && (
						<React.Fragment>
							{alumniJoin.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									No Join requests found
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{alumniJoin.map((item) => {
									return (
										<JoinRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showAllPost ? (
						loading ? (
							<Spinner />
						) : (
							<React.Fragment>
								{postRequests.length === 0 && (
									<div className="no-data-page" style={{textAlign:"center"}}>
										No Post Requests found
									</div>
								)}
								<div className="request-list-admin-dash float-child">
									{postRequests.map((item) => {
										return (
											<PostRequestCard
												key={item._id}
												request={item}
											/>
										);
									})}
								</div>
							</React.Fragment>
						)
					) : (
						<React.Fragment />
					)}

					{showStudentPost && (
						<React.Fragment>
							{studentPost.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									Nothing to show here
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{studentPost.map((item) => {
									return (
										<PostRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showProfessorPost && (
						<React.Fragment>
							{professorPost.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									Nothing to show here
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{professorPost.map((item) => {
									return (
										<PostRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showAlumniPost && (
						<React.Fragment>
							{alumniPost.length === 0 && (
								<div className="request-list-admin-dash float-child no-data-page">
									Nothing to show here
								</div>
							)}
							<div className="request-list-admin-dash float-child">
								{alumniPost.map((item) => {
									return (
										<PostRequestCard
											key={item._id}
											request={item}
										/>
									);
								})}
							</div>
						</React.Fragment>
					)}

					{showAchievements && (
						<DisplayAchievments
							achievements={extras.achievements}
						/>
					)}
					{showFeedbacks && (
						<DisplayFeedbacks feedbacks={extras.feedbacks} />
					)}
					{showSettings && <Settings />}
				</div>
			</div>
		</React.Fragment>
	);
};

AdminDash.propTypes = {
	request: PropTypes.object.isRequired,
	extras: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	post: PropTypes.object.isRequired,
	getJoinRequests: PropTypes.func.isRequired,
	getPostRequests: PropTypes.func.isRequired,
	getAchievements: PropTypes.func.isRequired,
	getFeedbacks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	request: state.request,
	extras: state.extras,
	auth: state.auth,
	post: state.post,
});

export default connect(mapStateToProps, {
	getJoinRequests,
	getPostRequests,
	getAchievements,
	getFeedbacks,
})(AdminDash);
