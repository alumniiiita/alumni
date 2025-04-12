import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getUserById } from "../../actions/users";
import { Link, useHistory } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";

const Profile = ({
  getUserById,
  auth: { loadingAuth, authUser },
  users: { userProfile, loading },
  match,
}) => {
  const history = useHistory();
  useEffect(() => {
    getUserById(match.params.id);
  }, [getUserById, match.params.id]);

	console.log("prof")

  
  return (
    <Fragment>
      {userProfile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <button
            className="btn btn-light mb-5 mt-5 mr-2"
            onClick={() => history.goBack()}
          >
            Back To Profiles
          </button>
          {/* {auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to="/edit-profile" className="btn btn-dark mb-5 mt-5 ml-2">
								Edit Profile
							</Link>
						)} */}
          <div className="profile-grid my-1">
            <ProfileTop profile={userProfile} />
            <ProfileAbout profile={userProfile} />
            <div className="row">
              <div
                className="profile-exp bg-white p-2 col"
                style={{ minHeight: "50vh" }}
              >
                <h2 className="text-primary">Experience</h2>
                {userProfile.experience.length > 0 ? (
                  <Fragment>
                    {userProfile.experience.map((exp) => (
                      <ProfileExperience key={exp._id} experience={exp} />
                    ))}
                  </Fragment>
                ) : (
                  <h4 style={{ textAlign: "center" }}>
                    No Experience to display
                  </h4>
                )}
              </div>
              <div
                className="profile-edu bg-white p-2 col"
                style={{ minHeight: "50vh" }}
              >
                <h2 className="text-primary">Education</h2>
                {userProfile.education.length > 0 ? (
                  <Fragment>
                    {userProfile.education.map((edu) => (
                      <ProfileEducation key={edu._id} education={edu} />
                    ))}
                  </Fragment>
                ) : (
                  <h4 style={{ textAlign: "center" }}>
                    No Education to display
                  </h4>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getUserById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.user,
});

export default connect(mapStateToProps, { getUserById })(Profile);
