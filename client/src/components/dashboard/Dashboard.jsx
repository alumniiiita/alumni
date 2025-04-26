import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner.jsx";
import Experience from "./Experience";
import { getCurrentUserProfile } from "../../actions/users";
import { closeSideNav } from "../../actions/alert";
import DashboardActions from "./DashboardActions";
import Education from "./Education.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dashboard = ({ closeSideNav, auth: { authUser, loadingAuth } }) => {
  useEffect(() => {
    closeSideNav();
  }, [getCurrentUserProfile]);

  const containerStyle = {
    padding: "2rem",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem",
  };

  const nameStyle = {
    fontSize: "1.5rem",
    color: "#333",
    marginTop: "0.5rem",
  };

  const dashboardGrid = {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
  };

  const leftPanelStyle = {
    flex: "1",
    minWidth: "280px",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: "fit-content",
  };

  const rightPanelStyle = {
    flex: "3",
    minWidth: "300px",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const profileImageStyle = {
    height: "120px",
    width: "120px",
    borderRadius: "50%",
    border: "3px solid #007bff",
    objectFit: "cover",
    marginBottom: "1rem",
  };

  const bioStyle = {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.5",
    marginTop: "1rem",
  };

  const buttonSkill = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    margin: "5px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  const linkButton = {
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 20px",
    borderRadius: "5px",
    display: "inline-block",
    marginTop: "20px",
    fontWeight: "bold",
  };

  const socialIconsStyle = {
    fontSize: "22px",
    marginRight: "15px",
    color: "#555",
    cursor: "pointer",
  };

  return loadingAuth || authUser === null ? (
    <Spinner />
  ) : (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "2.5rem", color: "#007bff" }}>Dashboard</h1>
        <p style={nameStyle}>Welcome, {authUser && authUser.name}</p>
      </div>

      {authUser !== null ? (
        <div style={dashboardGrid}>
          <div style={leftPanelStyle}>
            <DashboardActions />
          </div>

          <div style={rightPanelStyle}>
            <div style={{ textAlign: "center" }}>
              {authUser.images && authUser.images.length > 0 && (
                <img
                  alt="Profile"
                  src={`https://alumni-nrvg.onrender.com/awards/${authUser.images[0]}`}
                  style={profileImageStyle}
                />
              )}
              <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{authUser.name}</h2>
              <p style={{ fontSize: "1.2rem", color: "#666" }}>
                {authUser.role === "alumni" && `${authUser.designation} @ ${authUser.organisation}, ${authUser.location}`}
                {authUser.role === "student" && "Student @ IIITA"}
                {authUser.role === "faculty" && `${authUser.designation} @ Department of ${authUser.department}`}
              </p>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3>About</h3>
              <p style={bioStyle}>{authUser.bio || "No bio added yet."}</p>

              {authUser.website && (
                <p>
                  <a href={authUser.website} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                    {authUser.website}
                  </a>
                </p>
              )}

              <div style={{ marginTop: "1.5rem" }}>
                <h4>Skills</h4>
                {authUser.skills && authUser.skills.length > 0 ? (
                  authUser.skills.map((skill, index) => (
                    <button key={index} style={buttonSkill}>
                      {skill}
                    </button>
                  ))
                ) : (
                  <p style={{ color: "gray" }}>No skills added yet.</p>
                )}
              </div>

              <div style={{ marginTop: "2rem" }}>
                <FontAwesomeIcon icon={["fab", "instagram"]} style={socialIconsStyle} />
                <FontAwesomeIcon icon={["fab", "facebook"]} style={socialIconsStyle} />
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Experience experience={authUser.experience} />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Education education={authUser.education} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>You have not created a profile yet.</p>
          <Link to="/create-profile" style={linkButton}>
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentUserProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  closeSideNav: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentUserProfile, closeSideNav })(Dashboard);
