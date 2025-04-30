import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../layouts/NotFound";
import Register from "../auth/Register.jsx";
import Alert from "../layouts/Alert.jsx";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "../routing/PrivateRoute";
import AdminRoute from "../routing/AdminRoute";
import AlumniRoute from "../routing/AlumniRoute";
import Login from "../auth/Login.jsx";
import CreateProfile from "../profile-form/CreateProfile";
import EditProfile from "../profile-form/EditProfile";
import AddExperience from "../profile-form/AddExperience";
import AddEducation from "../profile-form/AddEducation";
import Profile from "../profile/Profile";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import AdminDash from "../dashboard/AdminDash.jsx";
import GeneralDashboard from "../dashboard/Dashboard.jsx";
import Posts from "../posts/Posts";
import PostForm from "../posts/PostForm";
import PostDisplay from "../posts/PostDisplay";
import Profiles from "../profiles/Profiles";
import Help from "../layouts/Help";
import Achievement from "../layouts/Achievement";
import Messenger from "../messenger/Messenger";

import Job from "../Jobs/jobs.jsx";
import ArchiveJobs from "../Jobs/archiveJobs.jsx";
import CreateJob from "../Jobs/createJob.jsx";
import Gallery from "../Gallery/gallery.jsx";
import Event from "../Event/event.jsx";
import CreateEvent from "../Event/createEvent.jsx";

import Notifications from "../notification/notifications.jsx";

// ✅ Story Components
import StoriesFeed from "../story/StoriesFeed";
import StoryForm from "../story/StoryForm";

// ✅ Friends Components
import FriendSuggestion from "../friends/FriendSuggestion";
import FriendsList from "../friends/FriendsList";
import FriendRequests from "../friends/FriendRequests";
import BlockList from "../friends/BlockList";
import SentRequests from "../friends/SentRequests"; // import it

import CreateGroup from "../messenger/CreateGroup";
import DoubtRoom from '../doubts/DoubtRoom';

import MentorDashboard from "../mentorship/MentorDashBoard";




const Routes = () => {
	return (
		<section
			className="container my-container"
			style={{ minHeight: "100vh", marginTop: "70px" }}
		>
			<Alert />
			<Switch>
				<Route exact path="/register" component={Register} />
				<Route exact path="/login" component={Login} />

				<PrivateRoute exact path="/profile/:id" component={Profile} />
				<PrivateRoute exact path="/profiles" component={Profiles} />

				<Route exact path="/jobs" component={Job} />
				<Route exact path="/archivejobs" component={ArchiveJobs} />
				<Route exact path="/createjob" component={CreateJob} />
				<Route exact path="/gallery" component={Gallery} />
				<Route exact path="/events" component={Event} />
				<Route exact path="/createEvent" component={CreateEvent} />
				<Route exact path="/notifications" component={Notifications} />

				<Route exact path="/forgotPassword" component={ForgotPassword} />
				<Route exact path="/resetPassword/:user_id/:reset_token" component={ResetPassword} />
				<Route exact path="/help" component={Help} />

				<PrivateRoute exact path="/userprofile" component={Dashboard} />
				<PrivateRoute exact path="/add-experience" component={AddExperience} />
				<PrivateRoute exact path="/add-education" component={AddEducation} />
				<PrivateRoute exact path="/feed/topic/:channel_name" component={Posts} />
				<PrivateRoute exact path="/create-post" component={PostForm} />
				<PrivateRoute exact path="/posts/:id" component={PostDisplay} />
				<PrivateRoute exact path="/edit-profile" component={EditProfile} />

				<AdminRoute exact path="/dashboard" component={AdminDash} />
				<Route exact path="/add-achievement" component={Achievement} />

				{/* ✅ Messenger Pages */}
				<PrivateRoute  path="/messenger" component={Messenger} />
				{/* <PrivateRoute exact path="/messenger/create-group" component={CreateGroup} />
				<PrivateRoute exact path="/friends/suggestions" component={FriendSuggestion} />
				<PrivateRoute exact path="/friends/list" component={FriendsList} />
				<PrivateRoute exact path="/friends/requests" component={FriendRequests} />
				<PrivateRoute exact path="/friends/requests/sent" component={SentRequests} />
				<PrivateRoute exact path="/friends/blocklist" component={BlockList} /> */}

				{/* ✅ Story Pages */}
				<Route exact path="/stories" component={StoriesFeed} />
				<AlumniRoute exact path="/stories/add" component={StoryForm} />
				<Route exact path="/doubts" component={DoubtRoom} />
				<Route exact path="/mentorship" component={MentorDashBoard} />

				{/* Not Found Page */}
				<Route component={NotFound} />
			</Switch>
		</section>
	);
};

export default Routes;
