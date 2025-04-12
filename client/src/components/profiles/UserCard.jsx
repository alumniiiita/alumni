import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  makeAdmin,
  removeAdmin,
  blockUser,
  unblockUser,
} from "../../actions/users";
import { connect } from "react-redux";

const UserCard = ({
  auth: { authUser, loadingAuth },
  profile,
  makeAdmin,
  removeAdmin,
  blockUser,
  unblockUser,
}) => {
  return (
    <div
      className="profile-card bg-light grid-item"
      style={{ maxWidth: "540px" }}
    >
      <div style={{ width: "100%", maxWidth: "540px" }}>
        <div className="card profile-header">
          <div className="body">
            <div className="row">
              <div
                className="col-lg-4 col-md-4 col-12"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="profile-image float-md-right">
                  {profile.images && profile.images.length > 0 ? (
                    <img
                      key={profile.images[0]}
                      alt="uploaded_image"
                      src={`http://localhost:5000/awards/${profile.images[0]}`}
                      style={{
                        maxHeight: "100px",
                        maxWidth: "100px",
                        borderRadius: "50%",
                      }}
                    ></img>
                  ) : (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  )}
                </div>
                {profile.isAdmin && (
                  <span
                    className="profile-tag"
                    style={{ textTransform: "capitalize" }}
                  >
                    {profile.adminType === "head" ? "Head" : profile.role}{" "}
                    {"Admin"}
                  </span>
                )}
              </div>
              <div className="col-lg-8 col-md-8 col-12">
                <h4 className="m-t-0 m-b-0">
                  <Link to={`/profile/${profile._id}`}>
                    <strong>{profile.name}</strong>
                  </Link>
                </h4>

                {profile.role === "alumni" && (
                  <span
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.designation}
                    {" @ "}
                    {profile.organisation}
                  </span>
                )}

                {profile.role === "student" && "Student @ IIITA"}

                {profile.role === "faculty" && (
                  <React.Fragment>
                    <p
                      style={{
                        textTransform: "capitalize",
                        marginBottom: "0",
                        marginTop: "0",
                      }}
                    >
                      {profile.designation}
                    </p>

                    <p>
                      {"Department of "}
                      <span
                        style={{
                          textTransform: "uppercase",
                        }}
                      >
                        {profile.department}
                      </span>
                    </p>
                  </React.Fragment>
                )}

                {profile.role === "student" && (
                  <p>
                    {profile.starting_year}-{profile.passing_year}
                  </p>
                )}

                {profile.role === "alumni" && (
                  <div>
                    <p style={{ marginBottom: "0" }}>{profile.location}</p>
                    {/* <br/> */}
                    <p>
                      {"Alumni @ IIITA"}
                      {" ( "}
                      {profile.passing_year}
                      {" Passout )"}
                    </p>
                  </div>
                )}

                <div>
                  {!loadingAuth &&
                    authUser.isAdmin &&
                    authUser.adminType === "head" &&
                    !profile.blocked &&
                    profile.adminType !== "head" && (
                      <button
                        className="btn btn-danger btn-round mr-1"
                        onClick={() => blockUser(profile._id)}
                      >
                        Block User
                      </button>
                    )}
                  {!loadingAuth &&
                    authUser.isAdmin &&
                    authUser.adminType === "head" &&
                    profile.blocked && (
                      <button
                        className="btn btn-danger btn-round mr-1"
                        onClick={() => unblockUser(profile._id)}
                      >
                        Unblock User
                      </button>
                    )}
                  {!profile.isAdmin &&
                    !loadingAuth &&
                    authUser.isAdmin &&
                    authUser.adminType === "head" && (
                      <button
                        className="btn btn-secondary btn-round btn-simple ml-1"
                        style={{
                          minWidth: "150px",
                        }}
                        onClick={() => makeAdmin(profile._id)}
                      >
                        Make admin
                      </button>
                    )}
                  {profile.isAdmin &&
                    profile.adminType === "sub" &&
                    !loadingAuth &&
                    authUser.isAdmin &&
                    authUser.adminType === "head" && (
                      <button
                        className="btn btn-secondary btn-round btn-simple ml-1"
                        style={{
                          minWidth: "150px",
                        }}
                        onClick={() => removeAdmin(profile._id)}
                      >
                        Remove admin
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  makeAdmin: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  unblockUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  makeAdmin,
  removeAdmin,
  blockUser,
  unblockUser,
})(UserCard);
