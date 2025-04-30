import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../../actions/alert";

const MentorshipButton = ({ receiverId, auth: { authUser }, setAlert }) => {
  const handleRequest = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship/request`, {
        receiverId,
      });
      setAlert("Mentorship request sent!", "success");
    } catch (err) {
      console.error(err.message);
      setAlert("Failed to send request", "danger");
    }
  };

  // ✅ Only students can request mentorship from others (non-students)
  if (!authUser || authUser.role !== "student") return null;
  if (authUser._id === receiverId) return null; // prevent self-request

  return (
    <button
      onClick={handleRequest}
      className="btn btn-outline-primary"
      style={{ borderRadius: "20px", marginTop: "1em" }}
    >
      🤝 Request Mentorship
    </button>
  );
};

MentorshipButton.propTypes = {
  receiverId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(MentorshipButton);
