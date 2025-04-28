import React from "react";
import { Route, Switch, useRouteMatch, Link, useLocation } from "react-router-dom";
import ConversationSidebar from "./ConversationSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroup from "./CreateGroup";
import FriendSuggestion from "../friends/FriendSuggestion";
import FriendRequests from "../friends/FriendRequests";
import SentRequests from "../friends/SentRequests";
import FriendsList from "../friends/FriendsList";
import BlockList from "../friends/BlockList";

const Messenger = () => {
	let { path, url } = useRouteMatch();
	const location = useLocation();

	// Helper to highlight active button
	const isActive = (route) => location.pathname === route;

	return (
		<div className="messenger-container" style={{ display: "flex", height: "90vh" }}>
			
			{/* Sidebar */}
			<div style={{ width: "25%", borderRight: "1px solid lightgray", overflowY: "auto", padding: "1em" }}>
				<h3 style={{ marginBottom: "1em" }}>Messenger</h3>

				<Link
					to={`${url}`}
					className={`btn my-1 ${isActive("/messenger") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Inbox
				</Link>

				<Link
					to={`${url}/create-group`}
					className={`btn my-1 ${isActive("/messenger/create-group") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Create Group
				</Link>

				<hr />

				<h5>Friends</h5>

				<Link
					to={`${url}/friends/suggestions`}
					className={`btn my-1 ${isActive("/messenger/friends/suggestions") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Find Friends
				</Link>

				<Link
					to={`${url}/friends/requests`}
					className={`btn my-1 ${isActive("/messenger/friends/requests") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Pending Requests
				</Link>

				<Link
					to={`${url}/friends/requests/sent`}
					className={`btn my-1 ${isActive("/messenger/friends/requests/sent") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Sent Requests
				</Link>

				<Link
					to={`${url}/friends/list`}
					className={`btn my-1 ${isActive("/messenger/friends/list") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					My Friends
				</Link>

				<Link
					to={`${url}/friends/blocklist`}
					className={`btn my-1 ${isActive("/messenger/friends/blocklist") ? "btn-primary" : "btn-light"}`}
					style={{ width: "100%" }}
				>
					Blocklist
				</Link>
			</div>

			{/* Main Content */}
			<div style={{ flex: 1, overflowY: "auto" }}>
				<Switch>
					<Route exact path={`${path}/`} component={ConversationSidebar} />
					<Route exact path={`${path}/chat/:id`} component={ChatWindow} />
					<Route exact path={`${path}/group/:id`} component={ChatWindow} />
					<Route exact path={`${path}/create-group`} component={CreateGroup} />
					<Route exact path={`${path}/friends/suggestions`} component={FriendSuggestion} />
					<Route exact path={`${path}/friends/requests`} component={FriendRequests} />
					<Route exact path={`${path}/friends/requests/sent`} component={SentRequests} />
					<Route exact path={`${path}/friends/list`} component={FriendsList} />
					<Route exact path={`${path}/friends/blocklist`} component={BlockList} />
				</Switch>
			</div>
		</div>
	);
};

export default Messenger;
