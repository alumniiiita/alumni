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

  return loadingAuth || authUser === null ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 style={{ fontSize: "2rem", color: "#007bff", marginBottom: "10px" }}>Dashboard</h1>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Welcome {authUser && authUser.name}</p>
      </div>
      {authUser !== null ? (
        <div style={{ display: "flex", padding: "20px" }}>
          <div style={{ flex: "1", padding: "10px" }}>
            <DashboardActions />
          </div>
          <div style={{ flex: "3", padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {authUser.images && authUser.images.length > 0 && (
                <img
                  key={authUser.images[0]}
                  alt="Profile"
                  src={`http://localhost:5000/awards/${authUser.images[0]}`}
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{authUser.name}</h2>
                <p style={{ fontSize: "1.2rem", color: "gray" }}>
                  {authUser.role === "alumni" && `${authUser.designation} @ ${authUser.organisation}, ${authUser.location}`}
                  {authUser.role === "student" && "Student @ IIITA"}
                  {authUser.role === "faculty" && `${authUser.designation} @ Department of ${authUser.department}`}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <h3>About</h3>
              <p>{authUser.bio}</p>
              <p><a href={authUser.website} target="_blank" rel="noopener noreferrer">{authUser.website}</a></p>
              <div>
                <h4>Skills:</h4>
                {authUser.skills && authUser.skills.map((skill, index) => (
                  <button key={index} style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    margin: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}>{skill}</button>
                ))}
              </div>
              <div style={{ marginTop: "10px" }}>
                <FontAwesomeIcon icon={["fab", "instagram"]} style={{ fontSize: "20px", marginRight: "10px" }} />
                <FontAwesomeIcon icon={["fab", "facebook"]} style={{ fontSize: "20px" }} />
              </div>
            </div>
            <Experience experience={authUser.experience} />
            <Education education={authUser.education} />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>You have not created a profile yet</p>
          <Link to="/create-profile" style={{
            textDecoration: "none",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            display: "inline-block",
            marginTop: "10px",
          }}>Create Profile</Link>
        </div>
      )}
    </React.Fragment>
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
