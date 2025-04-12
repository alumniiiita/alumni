import React from "react";
import PropTypes from "prop-types";
import Spinner from "../layouts/Spinner";
import { connect } from "react-redux";
import {
  blockUser,
  unblockUser,
  makeAdmin,
  removeAdmin,
  followUser,
  unFollowUser,
} from "../../actions/users";

const ProfileTop = ({
  profile,
  auth,
  blockUser,
  unblockUser,
  makeAdmin,
  removeAdmin,
  followUser,
  unFollowUser,
}) => {
  return profile === null || auth === null ? (
    <Spinner />
  ) : (
    <div className="profile-top p-2" style={{ display: "flex" }}>
      <div className="col-md-3" style={{ textAlign: "center", margin: "auto" }}>
        {profile.images && profile.images.length > 0 ? (
          <img
            key={profile.images[0]}
            alt="uploaded_image"
            src={`http://localhost:5000/awards/${profile.images[0]}`}
            style={{
              maxHeight: "100px",
              maxWidth: "100px",
			  objectFit : "cover",
              borderRadius: "50%",
            }}
          ></img>
        ) : (
          <img src={profile.avatar} alt="" className="round-img my-1" />
        )}
        <div className="">
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
        </div>
      </div>
      <div className="col-md-9">
        <div className="profile-stats">
          <ul>
            {/* <li>
							<span className="profile-stat-count">164</span>{" "}
							posts
						</li> */}
            <li>
              <span className="profile-stat-count">
                {profile.followers.length}
              </span>{" "}
              followers
            </li>
            <li>
              <span className="profile-stat-count">
                {profile.followings.length}
              </span>{" "}
              following
            </li>
          </ul>
        </div>
        <div className="profile-buttons row">
          {auth.authUser &&
            profile._id !== auth.authUser._id &&
            (auth.authUser.followings.includes(profile._id) ? (
              <button
                className="btn profile-edit-btn"
                onClick={() => unFollowUser(profile._id)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="btn profile-edit-btn"
                onClick={() => followUser(profile._id)}
              >
                Follow
              </button>
            ))}
          {auth.authUser &&
            auth.authUser.isAdmin &&
            auth.authUser.adminType === "head" &&
            profile._id !== auth.authUser._id &&
            profile.blocked && (
              <button
                className="btn profile-edit-btn"
                onClick={() => unblockUser(profile._id)}
              >
                Unblock
              </button>
            )}

          {auth.authUser &&
            auth.authUser.isAdmin &&
            auth.authUser.adminType === "head" &&
            profile._id !== auth.authUser._id &&
            !profile.blocked && (
              <button
                className="btn profile-edit-btn"
                onClick={() => blockUser(profile._id)}
              >
                Block
              </button>
            )}

          {auth.authUser &&
            auth.authUser.isAdmin &&
            auth.authUser.adminType === "head" &&
            profile._id !== auth.authUser._id &&
            profile.isAdmin && (
              <button
                className="btn profile-edit-btn"
                onClick={() => removeAdmin(profile._id)}
              >
                Remove Admin
              </button>
            )}

          {auth.authUser &&
            auth.authUser.isAdmin &&
            auth.authUser.adminType === "head" &&
            profile._id !== auth.authUser._id &&
            !profile.isAdmin && (
              <button
                className="btn profile-edit-btn"
                onClick={() => makeAdmin(profile._id)}
              >
                Make Admin
              </button>
            )}
        </div>
        {/* <div className="row">
					<div className="col">
						<p>Followers</p>
						<span style={{ textAlign: "center" }}>
							{profile.followers.length}
						</span>
					</div>
					<div className="col">
						<p>Following</p>
						<span style={{ textAlign: "center" }}>
							{profile.followings.length}
						</span>
					</div>
				</div> */}
      </div>
      {/* <img src={profile.avatar} alt="" className="round-img my-1" />
			<h1 className="large ">{profile.name}</h1>
			<p className="lear">
				{profile.name} {profile.name && <span> at {profile.name}</span>}
			</p>
			<p>{profile.name ? <span>{profile.name}</span> : null}</p> */}
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  makeAdmin: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  unblockUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  makeAdmin,
  removeAdmin,
  blockUser,
  unblockUser,
  followUser,
  unFollowUser,
})(ProfileTop);
