import React, { useEffect } from "react";
import { Route, Switch, useRouteMatch, Link } from "react-router-dom";
import ConversationSidebar from "./ConversationSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroup from "./CreateGroup";
import FriendSuggestion from "../friends/FriendSuggestion";
import FriendRequests from "../friends/FriendRequests";
import SentRequests from "../friends/SentRequests";
import FriendsList from "../friends/FriendsList";
import BlockList from "../friends/BlockList";
import { connect } from "react-redux";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const Messenger = ({ auth: { authUser } }) => {
  const { path, url } = useRouteMatch();

  // ✅ Important: Add user to socket when login
  useEffect(() => {
	if (authUser && authUser._id) {
	  console.log("✅ Adding user to socket:", authUser._id);
	  socket.emit("addUser", authUser._id);
	} else {
	  console.log("⚠️ authUser not ready yet");
	}
  }, [authUser]);
  

  return (
    <div className="messenger-container" style={{ display: "flex", height: "90vh" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", borderRight: "1px solid lightgray", overflowY: "auto", padding: "1em" }}>
        <h3 style={{ marginBottom: "1em" }}>Messenger</h3>

        <Link to={`${url}`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Inbox
        </Link>

        <Link to={`${url}/create-group`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Create Group
        </Link>

        <hr />

        <h5>Friends</h5>

        <Link to={`${url}/friends/suggestions`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Find Friends
        </Link>

        <Link to={`${url}/friends/requests`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Pending Requests
        </Link>

        <Link to={`${url}/friends/requests/sent`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Sent Requests
        </Link>

        <Link to={`${url}/friends/list`} className="btn btn-light my-1" style={{ width: "100%" }}>
          My Friends
        </Link>

        <Link to={`${url}/friends/blocklist`} className="btn btn-light my-1" style={{ width: "100%" }}>
          Blocklist
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Switch>
          <Route exact path={`${path}`} component={ConversationSidebar} />
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Messenger);
