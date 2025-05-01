import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logOut } from "../../actions/auth";
import { openSideNav, closeSideNav } from "../../actions/alert";
import logo from "../../019eddbf5bf91320da288c242aefa491.png";
import Notification from "../notification/notifications.jsx";
const Navbar = ({
  auth: { isAuthenticated, loadingAuth, authUser },
  logOut,
  openSideNav,
  closeSideNav,
  sideNavOpen,
}) => {
  const authLinksAdmin = (
    <Fragment>
      <li>
        <Link to="/add-achievement" className="navbar-link">
          <span className="hide-sm">Achievements/Awards</span>
        </Link>
      </li>
      <li>
      <Link to="/messenger" className="navbar-link">
       <i className="fas fa-comments"></i> 
      <span className="hide-sm">Messenger</span>
      </Link>
      </li>

      <li>
        <Link
          to="/jobs"
          className="logo navbar-link"
          style={{ fontSize: "1.1em" }}
        >
          <span style={{ textTransform: "capitalize" }}>Jobs</span>
        </Link>
      </li>

      <li >
        <Notification />
      </li>

      <li>
        <Link
          to="/events"
          className="logo navbar-link"
          style={{ fontSize: "1.1em" }}
        >
          <span style={{ textTransform: "capitalize" }}>Events</span>
        </Link>
      </li>
      <li>
        <Link to="/profiles?search=" className="navbar-link">
          <span className="hide-sm">Members</span>
        </Link>
      </li>
      <li>
     <Link to="/stories" className="navbar-link">
      <span className="hide-sm">Stories of Alumni</span>
     </Link>
     </li>

      <li>
        <Link to="/userprofile" className="navbar-link">
          <i className="fas fa-user"></i>{" "}
          {/* <span className="hide-sm">Profile</span> */}
          {authUser !== null &&
            authUser.isAdmin &&
            authUser.adminType === "head" && (
              <span className="user-role-tag">Head Admin</span>
            )}
          {authUser !== null &&
            authUser.isAdmin &&
            authUser.adminType === "sub" && (
              <span className="user-role-tag">{authUser.role} Admin</span>
            )}
        </Link>
      </li>
      <li>
        <Link to="/dashboard" className="navbar-link">
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/feed/topic/Placements?search=" className="navbar-link">
          <span className="hide-sm">Feed</span>
        </Link>
      </li>
      {/* <li>
        <Link to="/help" className="navbar-link">
          <span className="hide-sm">Help</span>
        </Link>
      </li> */}
      <li>
        <Link
          onClick={() => {
            logOut();
          }}
          to="/"
          className="navbar-link"
        >
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Log Out</span>
        </Link>
      </li>
    </Fragment>
  );

  const authLinksOther = (
    <Fragment>
      {/* <li>
        <Link to="/add-achievement" className="navbar-link">
          <span className="hide-sm">Achievements/Awards</span>
        </Link>
      // </li> */}

    <li>
     <Link to="/resources" className="navbar-link">
       <i className="fas fa-book"></i>
       <span className="hide-sm">Resources</span>
    </Link>
   </li>

   <li>
     <Link to="/mentorship" className="navbar-link">
       <i className="fas fa-hands-helping"></i> 
       <span className="hide-sm">Mentorship</span>
    </Link>
   </li>

    <li>
      <Link to="/doubts" className="navbar-link">
      <i className="fas fa-question-circle"></i>
      <span className="hide-sm">Doubt Room</span>
     </Link>
     </li>
     <li>
       <Link to="/messenger" className="navbar-link">
       <i className="fas fa-comments"></i> 
       <span className="hide-sm">Messenger</span>
      </Link>
      </li>
      <li>
        <a
        href="/Manual.pdf"
        className="navbar-link"
       target="_blank"
         rel="noopener noreferrer"
      >
       <span className="hide-sm">Download Manual</span>
       </a>
      </li>

      <li>
        <Link
          to="/jobs"
          className="logo navbar-link"
          style={{ fontSize: "1.1em" }}
        >
          <span style={{ textTransform: "capitalize" }}>Jobs</span>
        </Link>
      </li>
     
      <li>
        <Notification />
      </li>

      <li>
        <Link
          to="/events"
          className="logo navbar-link"
          style={{ fontSize: "1.1em" }}
        >
          <span style={{ textTransform: "capitalize" }}>Events</span>
        </Link>
      </li>
      <li>
        <Link to="/profiles?search=" className="navbar-link">
          <span className="hide-sm">Members</span>
        </Link>
      </li>
      <li>
     <Link to="/stories" className="navbar-link">
         <span className="hide-sm">Stories of Alumni</span>
    </Link>
     </li>

      <li>
        <Link to="/userprofile" className="navbar-link">
          <i className="fas fa-user"></i>{" "}
          {/* <span className="hide-sm">Profile</span> */}
          {authUser !== null && (
            <span className="user-role-tag">{authUser.role}</span>
          )}
        </Link>
      </li>

      <li>
        <Link to="/feed/topic/Placements?search=" className="navbar-link">
          <span className="hide-sm">Feed</span>
        </Link>
      </li>
      {/* <li>
        <Link to="/help" className="navbar-link">
          <span className="hide-sm">Help</span>
        </Link>
      </li> */}
      <li>
        <Link
          onClick={() => {
            logOut();
          }}
          to="/"
          className="navbar-link"
        >
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Log Out</span>
        </Link>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/add-achievement" className="navbar-link">
          <span className="hide-sm">Achievements/Awards</span>
        </Link>
      </li>
      <li>
        <Link to="/help" className="navbar-link">
          <span className="hide-sm">Help</span>
        </Link>
      </li>
      <li>
     <Link to="/stories" className="navbar-link">
       <span className="hide-sm">Stories of Alumni</span>
     </Link>
      </li>
      <li>
        <Link to="/register" className="navbar-link">
          Register
        </Link>
      </li>

      <li>
        <Link to="/login" className="navbar-link">
          Login
        </Link>
      </li>
    </Fragment>
  );

  const authLinksSideBarClosedOthers = (
    <ul>
      <li>
        <button
          className="navbar-link hamburger-icon"
          style={{ fontSize: "1.5em" }}
          onClick={() => openSideNav()}
        >
          <i className="fas fa-bars"></i>
        </button>
      </li>
      <ul className="nav-links">{authLinksOther}</ul>
    </ul>
  );

  const authLinksSideBarClosedAdmin = (
    <ul>
      <li>
        <button
          className="navbar-link hamburger-icon"
          style={{
            fontSize: "1.5em",
            outline: "none",
            backgroundColor: "white",
            border: "none",
          }}
          onClick={() => openSideNav()}
        >
          <i className="fas fa-bars"></i>
        </button>
      </li>
      <ul className="nav-links">{authLinksAdmin}</ul>
    </ul>
  );

  const guestLinksSideBarClosed = (
    <ul>
      <li>
        <button
          className="navbar-link hamburger-icon"
          style={{
            fontSize: "1.5em",
            outline: "none",
            backgroundColor: "white",
            border: "none",
          }}
          onClick={() => openSideNav()}
        >
          <i className="fas fa-bars"></i>
        </button>
      </li>
      <ul className="nav-links">{guestLinks}</ul>
    </ul>
  );
  return (
    <div>
      <nav className="navbar"
         style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          padding: "0.75em 1.5em",
        }}
      >
        <div>
          <img
            src={logo}
            alt="logo"
            style={{ height: "30px", width: "30px", marginBottom: "5px" }}
            className="navbar-link"
          />
          <Link
            to="/"
            className="logo navbar-link"
            style={{ fontSize: "1.1em" }}
          >
            IIITA <span style={{ textTransform: "capitalize" }}>Alumni</span>
            <span style={{ textTransform: "capitalize" }}>Connect</span>
          </Link>
        </div>
        {!loadingAuth && (
          <Fragment>
            {isAuthenticated && authUser !== null
              ? authUser.isAdmin
                ? authLinksSideBarClosedAdmin
                : authLinksSideBarClosedOthers
              : guestLinksSideBarClosed}
          </Fragment>
        )}
      </nav>
      <Fragment>
        {sideNavOpen && (
          <div className="side-panel">
            <button
              style={{
                fontSize: "1.5em",
                outline: "none",
                backgroundColor: "white",
                border: "none",
              }}
              className="navbar-link nav-close-icon"
              onClick={() => closeSideNav()}
            >
              <i className="fas fa-times"></i>
            </button>
            {!loadingAuth && (
              <ul className="side-panel-links">
                <React.Fragment>
                  {isAuthenticated
                    ? authUser.isAdmin
                      ? authLinksAdmin
                      : authLinksOther
                    : guestLinks}
                </React.Fragment>
              </ul>
            )}
          </div>
        )}
      </Fragment>
    </div>
  );
};

Navbar.propTypes = {
  logOut: PropTypes.func.isRequired,
  openSideNav: PropTypes.func.isRequired,
  closeSideNav: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  sideNavOpen: state.alert.sideNavOpen,
});

export default connect(mapStateToProps, { logOut, openSideNav, closeSideNav })(
  Navbar
);
