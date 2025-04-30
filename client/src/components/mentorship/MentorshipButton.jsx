import React, { useState } from "react";
import axios from "axios";

const MentorshipButton = ({ receiverId }) => {
  const [showForm, setShowForm] = useState(false);
  const [areaOfHelp, setAreaOfHelp] = useState("Career");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mentorship`, {
        requestedTo: receiverId,
        areaOfHelp,
        message,
      });
      setSuccess(true);
      setError("");
      setShowForm(false);
    } catch (err) {
      setError("Failed to send request.");
      console.error(err);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowForm(true)}>
        Request Mentorship
      </button>

      {showForm && (
        <div className="card p-3 mt-3" style={{ maxWidth: "400px" }}>
          <h5>Mentorship Request</h5>
          <form onSubmit={submitRequest}>
            <div className="form-group">
              <label>Area of Help</label>
              <select
                className="form-control"
                value={areaOfHelp}
                onChange={(e) => setAreaOfHelp(e.target.value)}
                required
              >
                <option>Career</option>
                <option>Research</option>
                <option>Higher Studies</option>
                <option>Entrepreneurship</option>
                <option>Placements</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Send Request
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setShowForm(false)}
              type="button"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {success && <p className="text-success mt-2">Request Sent Successfully!</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default MentorshipButton;
